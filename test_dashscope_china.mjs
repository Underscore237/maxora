import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

const dashscopeKey = process.env.DASHSCOPE_API_KEY;

function testDashscopeChina(modelName) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: modelName,
      input: {
        prompt: "A realistic handsome African man with sculpted jawline, 8k portrait"
      },
      parameters: {
        size: "1024*1024",
        n: 1
      }
    });

    const options = {
      hostname: 'dashscope.aliyuncs.com',
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
        console.log(`Dashscope China [${modelName}] -> Code: ${res.statusCode}, Body: ${data.substring(0, 300)}`);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error(`Dashscope China [${modelName}] Error:`, e.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  await testDashscopeChina('wanx-v1');
  await testDashscopeChina('wanx2.1-t2i-turbo');
  await testDashscopeChina('wanx2.0-t2i-turbo');
}

main();
