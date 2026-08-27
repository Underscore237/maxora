import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

export const fallbackMetrics = {
  dashscopeAttempts: 0,
  dashscopeSuccesses: 0,
  geminiAttempts: 0,
  geminiSuccesses: 0,
  totalRequests: 0,
  logs: []
};

function logEvent(type, message, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details
  };
  fallbackMetrics.logs.unshift(entry);
  if (fallbackMetrics.logs.length > 50) fallbackMetrics.logs.pop();
  console.log(`[IMAGE_GEN_PIPELINE] ${type}: ${message}`, details);
}

/**
 * Requête HTTPS native pour DashScope
 */
function sendDashscopeRequest(path, method, headers, payload = null) {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : null;
    const reqHeaders = { ...headers };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: 'dashscope-intl.aliyuncs.com',
      port: 443,
      path,
      method,
      headers: reqHeaders,
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, data });
          } else {
            reject(new Error(data.message || data.code || `HTTP ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse DashScope response (HTTP ${res.statusCode}): ${body}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('DashScope request timeout'));
    });

    if (postData) req.write(postData);
    req.end();
  });
}

/**
 * 1. GÉNÉRATION VIA ALIBABA DASHSCOPE (PRIORITÉ 1)
 */
async function pollDashscopeTask(taskId, apiKey, workspaceId) {
  const maxAttempts = 25;
  const headers = { 'Authorization': `Bearer ${apiKey}` };
  if (workspaceId) headers['X-DashScope-WorkSpace'] = workspaceId;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const response = await sendDashscopeRequest(`/api/v1/tasks/${taskId}`, 'GET', headers);
      const taskStatus = response.data?.output?.task_status;

      if (taskStatus === 'SUCCEEDED') {
        const imageUrl = response.data.output.results?.[0]?.url;
        if (imageUrl) return imageUrl;
      } else if (taskStatus === 'FAILED') {
        throw new Error(`DashScope task failed: ${response.data.output?.message || 'Unknown error'}`);
      }
    } catch (err) {
      if (i === maxAttempts - 1) throw err;
    }
  }
  throw new Error('DashScope task polling timed out');
}

async function generateViaDashscope(fullPrompt) {
  const apiKey = process.env.DASHSCOPE_API_KEY;
  const workspaceId = process.env.DASHSCOPE_WORKSPACE_ID;

  if (!apiKey) {
    throw new Error('DASHSCOPE_API_KEY non configurée');
  }

  fallbackMetrics.dashscopeAttempts++;
  logEvent('DASHSCOPE_START', 'Lancement de la génération via Alibaba DashScope (qwen-image-plus)', { workspaceId });

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'X-DashScope-Async': 'enable'
  };
  if (workspaceId) {
    headers['X-DashScope-WorkSpace'] = workspaceId;
  }

  const payload = {
    model: 'qwen-image-plus',
    input: { prompt: fullPrompt },
    parameters: { size: '1024*1024', n: 1 }
  };

  const response = await sendDashscopeRequest(
    '/api/v1/services/aigc/text2image/image-synthesis',
    'POST',
    headers,
    payload
  );

  const taskId = response.data?.output?.task_id;
  if (!taskId) {
    throw new Error(`DashScope API did not return a task_id`);
  }

  const imageUrl = await pollDashscopeTask(taskId, apiKey, workspaceId);
  fallbackMetrics.dashscopeSuccesses++;
  logEvent('DASHSCOPE_SUCCESS', 'Image générée avec succès via Alibaba DashScope', { imageUrl });

  return {
    url: imageUrl,
    provider: 'alibaba_dashscope',
    model: 'qwen-image-plus',
    is_ai_generated: true
  };
}

/**
 * 2. GÉNÉRATION VIA GOOGLE GEMINI (PRIORITÉ 2)
 */
async function generateViaGemini(fullPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY non configurée');
  }

  fallbackMetrics.geminiAttempts++;
  logEvent('GEMINI_START', 'Lancement de la génération de secours via Google Gemini');

  const geminiModels = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image'];

  for (const modelName of geminiModels) {
    try {
      const result = await new Promise((resolve, reject) => {
        const postData = JSON.stringify({
          contents: [
            { parts: [{ text: fullPrompt }] }
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"]
          }
        });

        const options = {
          hostname: 'generativelanguage.googleapis.com',
          port: 443,
          path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          },
          timeout: 25000
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => { body += chunk; });
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const parts = parsed.candidates?.[0]?.content?.parts || [];
              for (const part of parts) {
                if (part.inlineData?.data) {
                  const mime = part.inlineData.mimeType || 'image/jpeg';
                  return resolve(`data:${mime};base64,${part.inlineData.data}`);
                }
              }
              reject(new Error(parsed.error?.message || `No image returned by ${modelName}`));
            } catch (e) {
              reject(new Error(`Failed to parse Gemini response: ${e.message}`));
            }
          });
        });

        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Gemini timeout on ${modelName}`));
        });

        req.write(postData);
        req.end();
      });

      fallbackMetrics.geminiSuccesses++;
      logEvent('GEMINI_SUCCESS', `Image générée avec succès via Gemini (${modelName})`);

      return {
        url: result,
        provider: 'google_gemini',
        model: modelName,
        is_ai_generated: true
      };
    } catch (err) {
      logEvent('GEMINI_MODEL_FAILED', `Tentative échouée sur modèle ${modelName}: ${err.message}`);
    }
  }

  throw new Error('Tous les modèles Gemini Image ont échoué.');
}

/**
 * GÉNÉRATEUR D'IMAGES MAXORA :
 * 1. DASHSCOPE_API_KEY (Alibaba Cloud DashScope) en PRIORITÉ
 * 2. GEMINI_API_KEY (Google Gemini) en SECONDAIRE
 */
export async function generateMaxedGlowUpImage(promptDetails = '', inputImageBase64 = null) {
  fallbackMetrics.totalRequests++;

  const basePrompt = `cinematic ultra-realistic 8k raw photographic portrait of a handsome African man after natural looksmaxing glow up, perfectly defined sculpted jawline, clear radiant luminous smooth skin tone, sharp groomed beard contours, intense magnetic masculine gaze, high cheekbones, luxury studio lighting, photorealistic 8k Hasselblad shot, symmetrical masculine aesthetics`;
  const fullPrompt = promptDetails ? `${basePrompt}, ${promptDetails}` : basePrompt;

  // Priorité 1 : Alibaba DashScope
  try {
    const dashResult = await generateViaDashscope(fullPrompt);
    return {
      success: true,
      result: dashResult
    };
  } catch (dashError) {
    logEvent('DASHSCOPE_FAILED', `Échec DashScope: ${dashError.message}. Bascule vers Gemini.`);
  }

  // Priorité 2 : Google Gemini
  try {
    const geminiResult = await generateViaGemini(fullPrompt);
    return {
      success: true,
      result: geminiResult
    };
  } catch (geminiError) {
    logEvent('GEMINI_FAILED', `Échec Gemini: ${geminiError.message}.`);
    throw new Error(`Échec de génération d'image (DashScope & Gemini): ${geminiError.message}`);
  }
}
