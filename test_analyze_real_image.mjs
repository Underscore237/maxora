import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const SYSTEM_ANALYSIS_PROMPT = `Tu es un expert en esthétique faciale masculine et biométrie faciale.
Tu analyses la photo soumise par un homme pour lui fournir un bilan d'harmonie faciale précis, constructif, réaliste et bienveillant.

RÈGLES CRITIQUES D'ANALYSE :
- Evalue la photo réelle avec rigueur.
- Si la photo ne montre aucun visage humain clair (objet, paysage, flou complet, profil masqué), renvoie "photo_valide": false et la raison.
- Si le visage est valide : calcule des scores réels et uniques spécifiques à ce visage.
- Rétention d'eau faciale (water_retention) : évalue le gonflement sous-orbitaire, les joues et le double-menton postural.
- Mâchoire et angle mandibulaire (jawline) : évalue la netteté de la ligne de la mâchoire et le contraste ombre/lumière.
- Qualité de peau (skin_quality) : texture, uniformité du teint, éclat, pores ou imperfections visibles.
- Symétrie faciale (symmetry) : harmonie entre côté gauche et droit.

Renvoie UNIQUEMENT un objet JSON valide avec cette structure exacte :
{
  "photo_valide": true,
  "raison_si_invalide": null,
  "score_global": 74,
  "potentiel_realiste": 92,
  "delai_recommande_jours": 90,
  "resume_analyse": "Analyse personnalisée détaillée du visage soumis...",
  "defauts_identifies": [
    {
      "type": "water_retention",
      "nom": "Rétention d'eau faciale",
      "gravite": "moderee",
      "description": "Explication sur la rétention d'eau visible sur ce visage.",
      "score_impact": 12,
      "delai_jours": 21
    },
    {
      "type": "jawline_definition",
      "nom": "Définition de la mâchoire",
      "gravite": "moderee",
      "description": "Manque de contraste sur le contour sous-maxillaire.",
      "score_impact": 15,
      "delai_jours": 90
    },
    {
      "type": "skin_texture",
      "nom": "Éclat & uniformité du teint",
      "gravite": "legere",
      "description": "Léger manque d'hydratation et d'éclat naturel.",
      "score_impact": 8,
      "delai_jours": 30
    }
  ],
  "scores_detailles": {
    "structure_osseuse": 85,
    "definition_mandibulaire": 68,
    "retention_eau": 62,
    "qualite_peau": 76,
    "symetrie": 80
  }
}`;

async function testWithRealPhoto() {
  const imgPath = path.resolve('public/assets/african_man_before.jpg');
  const imgBuffer = fs.readFileSync(imgPath);
  const base64Data = imgBuffer.toString('base64');

  console.log(`Image read: ${imgPath}, base64 length: ${base64Data.length}`);

  const postData = JSON.stringify({
    contents: [
      {
        parts: [
          { text: SYSTEM_ANALYSIS_PROMPT },
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
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 25000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        try {
          const parsed = JSON.parse(body);
          const rawText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          console.log('Gemini Analysis JSON Output:');
          console.log(rawText);
          resolve(true);
        } catch (e) {
          console.error('Parse error or raw body:', body.substring(0, 400));
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

testWithRealPhoto();
