import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testRealVision() {
  const imgBuffer = fs.readFileSync('public/assets/african_avatar_1.jpg');
  const base64Data = imgBuffer.toString('base64');
  console.log('Image size:', imgBuffer.length, 'bytes');

  const prompt = `Analyse ce visage et renvoie UNIQUEMENT un JSON avec:
{
  "photo_valide": true,
  "score_global": 78,
  "potentiel_realiste": 94,
  "delai_recommande_jours": 90,
  "resume_analyse": "Description des caractéristiques biométriques réelles du visage...",
  "defauts_identifies": [
    {
      "type": "water_retention",
      "nom": "Rétention d'eau",
      "gravite": "moderee",
      "description": "Explication personnalisée",
      "score_impact": 10,
      "delai_jours": 21
    }
  ],
  "scores_detailles": {
    "structure_osseuse": 85,
    "definition_mandibulaire": 75,
    "retention_eau": 70,
    "qualite_peau": 80,
    "symetrie": 82
  }
}`;

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json"
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      try {
        const parsed = JSON.parse(body);
        console.log('Parsed Candidates:', parsed.candidates?.[0]?.content?.parts?.[0]?.text);
      } catch (e) {
        console.log('Body:', body.substring(0, 400));
      }
    });
  });

  req.on('error', (e) => console.error('Req error:', e));
  req.write(postData);
  req.end();
}

testRealVision();
