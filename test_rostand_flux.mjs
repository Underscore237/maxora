import https from 'https';
import fs from 'fs';

const prompt = "ultra-realistic 8k cinematic portrait of a handsome athletic young African man wearing a black leather cap and green athletic jersey, perfectly defined sharp jawline, high cheekbones, clear radiant luminous dark skin, clean sharp groomed beard contours, intense magnetic focused gaze, luxury studio lighting, photorealistic Hasselblad shot, symmetrical masculine aesthetics";
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux-realism&width=1024&height=1024&nologo=true&enhance=true&seed=482910`;

console.log('Generating AI FLUX Realism Studio version...');

https.get(url, (res) => {
  const chunks = [];
  res.on('data', (d) => chunks.push(d));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync('public/assets/rostand_flux_ai_maxed.jpg', buffer);
    fs.writeFileSync('C:\\Users\\Rostand JK\\.gemini\\antigravity-ide\\brain\\a445a3ba-9160-4b38-b642-104eec70dd9b\\rostand_flux_ai_maxed.jpg', buffer);
    console.log('FLUX Realism Studio version saved successfully! Size:', buffer.length);
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
