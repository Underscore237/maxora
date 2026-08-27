import { spawn } from 'child_process';

function runTunnel() {
  console.log('[TUNNEL] Lancement du tunnel persistant MAXORA...');
  const child = spawn('npx.cmd', ['localtunnel', '--port', '5173'], {
    shell: true,
    stdio: 'inherit'
  });

  child.on('close', (code) => {
    console.log(`[TUNNEL] Tunnel déconnecté (code ${code}). Redémarrage automatique dans 2s...`);
    setTimeout(runTunnel, 2000);
  });

  child.on('error', (err) => {
    console.error('[TUNNEL] Erreur:', err.message);
    setTimeout(runTunnel, 3000);
  });
}

runTunnel();
