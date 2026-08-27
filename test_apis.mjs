import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Gemini API key prefix:', process.env.GEMINI_API_KEY?.substring(0, 10));
console.log('Testing Dashscope API key prefix:', process.env.DASHSCOPE_API_KEY?.substring(0, 10));

async function testGemini() {
  const key = process.env.GEMINI_API_KEY;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await res.json();
    console.log('Gemini API test status:', res.status, data?.models ? `Found ${data.models.length} models` : data);
  } catch (err) {
    console.error('Gemini error:', err.message);
  }
}

async function testDashScope() {
  const key = process.env.DASHSCOPE_API_KEY?.trim();
  try {
    const res = await fetch('https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: { messages: [{ role: 'user', content: 'hello' }] }
      })
    });
    const data = await res.json();
    console.log('DashScope test status:', res.status, data);
  } catch (err) {
    console.error('DashScope error:', err.message);
  }
}

async function run() {
  await testGemini();
  await testDashScope();
}
run();
