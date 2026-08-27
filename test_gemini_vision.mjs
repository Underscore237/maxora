import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function testVision() {
  const dummyBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const models = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

  for (const m of models) {
    console.log(`\nTesting: ${m}...`);
    try {
      const res = await ai.models.generateContent({
        model: m,
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Analyse et renvoie du JSON: {"test": "ok", "score": 82}' },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: dummyBase64
                }
              }
            ]
          }
        ]
      });
      console.log(`✅ ${m} SUCCESS! Response:`, res.text);
    } catch (e) {
      console.error(`❌ ${m} FAILED:`, e.message);
    }
  }
}

testVision();
