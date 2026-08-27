import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

const dashscopeKey = process.env.DASHSCOPE_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

const qwenModels = ['wanx2.1-t2i-turbo', 'wanx2.1-t2i-plus', 'wanx-v1', 'flux-schnell', 'flux-dev'];

async function testQwenModel(modelName) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: modelName,
      input: {
        prompt: "A handsome African man, defined jawline, studio portrait, 8k"
      },
      parameters: {
        size: "1024*1024",
        n: 1
      }
    });

    const options = {
      hostname: 'dashscope-intl.aliyuncs.com',
      port: 443,
      path: '/api/v1/services/aigc/text2image/image-synthesis',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dashscopeKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'enable',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Qwen Model [${modelName}] -> Code: ${res.statusCode}, Body: ${data.substring(0, 200)}`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error(`Qwen Model [${modelName}] Error:`, e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test image generation with Gemini Imagen 3
async function testGeminiImagen() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      instances: [
        { prompt: "A realistic handsome African man with sculpted jawline, clear radiant skin, glowing confidence, 8k portrait" }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1"
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/imagen-3.0-generate-002:predict?key=${geminiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Gemini Imagen-3 -> Code: ${res.statusCode}, Body: ${data.substring(0, 200)}`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error('Gemini Imagen-3 Error:', e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const m of qwenModels) {
    await testQwenModel(m);
  }
  await testGeminiImagen();
}

run();
