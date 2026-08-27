import https from 'https';
import fs from 'fs';

const prompt = "ultra-realistic 8k cinematic portrait of a handsome modern African man with razor-sharp sculpted jawline, clear radiant smooth skin, styled grooming beard, intense focused eyes, luxury studio lighting, photographic perfection";
const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux-realism&width=1024&height=1024&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 100000)}`;

console.log('Testing Pollinations FLUX Realism generation URL:', url);

https.get(url, (res) => {
  console.log('HTTP Status:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  
  const chunks = [];
  res.on('data', (d) => chunks.push(d));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    console.log(`Image downloaded successfully! Size: ${buffer.length} bytes`);
    fs.writeFileSync('public/assets/test_ai_flux_generated.jpg', buffer);
    console.log('Saved to public/assets/test_ai_flux_generated.jpg');
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
