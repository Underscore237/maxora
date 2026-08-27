import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

const geminiKey = process.env.GEMINI_API_KEY;
const dashscopeKey = process.env.DASHSCOPE_API_KEY;

console.log('Testing APIs...');

// Test 1: Gemini REST call via HTTPS module (bypassing Undici fetch)
function testGeminiHttps() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [
        {
          parts: [{ text: "Hello! Réponds avec un court JSON: {\"status\": \"ok\", \"score\": 84}" }]
        }
      ]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Gemini HTTPS Response Code:', res.statusCode);
        console.log('Gemini Response Body:', data.substring(0, 300));
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error('Gemini HTTPS Error:', e.message);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('Gemini HTTPS Timeout');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test 2: Qwen / Dashscope Image Generation
function testQwenHttps() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: "wanx-v1",
      input: {
        prompt: "A handsome African man, cinematic luxury portrait, sharp defined jawline, clear radiant smooth skin, confident expression, 8k"
      },
      parameters: {
        style: "<auto>",
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
        console.log('Qwen HTTPS Response Code:', res.statusCode);
        console.log('Qwen Response Body:', data.substring(0, 300));
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error('Qwen HTTPS Error:', e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  await testGeminiHttps();
  await testQwenHttps();
}

main();
