import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// Fonction de compression/redimensionnement légère pour envoyer des payloads optimisés à Gemini
async function testSmallImage() {
  // Petite image test 200x200
  const smallBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGYzUAAIp0AQ1D1zRVAAAAAElFTkSuQmCC";

  const SYSTEM_ANALYSIS_PROMPT = `Tu es un expert biométrique facial. Analyse ce visage et renvoie un bilan complet personnalisé en JSON:
{
  "photo_valide": true,
  "raison_si_invalide": null,
  "score_global": 76,
  "potentiel_realiste": 94,
  "delai_recommande_jours": 90,
  "resume_analyse": "Visage masculin avec une excellente base osseuse. Les angles mandibulaires peuvent être mis en valeur par une réduction de la rétention sous-cutanée.",
  "defauts_identifies": [
    {
      "type": "water_retention",
      "nom": "Rétention d'eau sous-orbitaire et joues",
      "gravite": "moderee",
      "description": "Léger engorgement lymphatique masquant le relief osseux.",
      "score_impact": 10,
      "delai_jours": 21
    }
  ],
  "scores_detailles": {
    "structure_osseuse": 86,
    "definition_mandibulaire": 72,
    "retention_eau": 65,
    "qualite_peau": 78,
    "symetrie": 82
  }
}`;

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          { text: SYSTEM_ANALYSIS_PROMPT },
          {
            inlineData: {
              mimeType: 'image/png',
              data: smallBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: `/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 20000
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Raw response body:', body);
    });
  });

  req.on('error', (e) => console.error('Req error:', e));
  req.write(postData);
  req.end();
}

testSmallImage();
