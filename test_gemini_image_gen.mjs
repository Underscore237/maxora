import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testGeminiImageModels() {
  const models = [
    'gemini-2.5-flash-image',
    'gemini-3-pro-image',
    'gemini-3.1-flash-image',
    'imagen-3.0-generate-002'
  ];

  for (const model of models) {
    console.log(`\nTesting image generation with: ${model}...`);

    const postData = JSON.stringify({
      contents: [
        {
          parts: [
            { text: "Generate a realistic photographic portrait of a handsome African man with sculpted jawline, clear radiant skin, luxury studio lighting, 8k" }
          ]
        }
      ]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 20000
    };

    const res = await new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          console.log(`[${model}] HTTP ${res.statusCode}:`, body.substring(0, 300));
          resolve(res.statusCode);
        });
      });
      req.on('error', (e) => {
        console.error(`[${model}] error:`, e.message);
        resolve(500);
      });
      req.write(postData);
      req.end();
    });
  }
}

testGeminiImageModels();
