import localtunnel from 'localtunnel';
import https from 'https';

async function startTunnel() {
  console.log('Création du tunnel public...');
  
  // Obtenir l'IP publique pour le mot de passe localtunnel
  https.get('https://loca.lt/mytunnelpassword', (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      console.log('MOT DE PASSE TUNNEL (si demandé) :', data.trim());
    });
  });

  const tunnel = await localtunnel({ port: 5173 });
  console.log('✅ LIEN PUBLIC ACTIF :', tunnel.url);

  tunnel.on('close', () => {
    console.log('Tunnel fermé.');
  });
}

startTunnel().catch(err => {
  console.error('Erreur tunnel:', err);
});
