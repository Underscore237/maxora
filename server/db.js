import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/store.json');

// Structure initiale de la base de données
const initialData = {
  users: {},
  scans: {},
  transactions: {},
  systemLogs: []
};

// Initialisation du fichier de données
function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture DB, réinitialisation:', err);
    return initialData;
  }
}

export function writeDb(data) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erreur écriture DB:', err);
  }
}

/**
 * Récupère ou crée un utilisateur par son identifiant ou email
 */
export function getOrCreateUser(userId, userData = {}) {
  const db = readDb();
  if (!db.users[userId]) {
    db.users[userId] = {
      id: userId,
      email: userData.email || `${userId}@glowup.ai`,
      name: userData.name || 'Champion Glow Up',
      avatar: userData.avatar || null,
      plan: 'decouverte', // decouverte | glow_up_30 | glow_up_90
      planExpiresAt: null,
      scanCount: 0,
      scansHistory: [],
      currentDay: 1,
      streak: 0,
      xp: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedTasks: {}, // { "day_1_mewing": true }
      program: null,
      createdAt: new Date().toISOString()
    };
    writeDb(db);
  }
  return db.users[userId];
}

/**
 * Met à jour un utilisateur
 */
export function updateUser(userId, updates = {}) {
  const db = readDb();
  if (db.users[userId]) {
    db.users[userId] = { ...db.users[userId], ...updates };
    writeDb(db);
    return db.users[userId];
  }
  return null;
}

/**
 * Enregistre un nouveau scan facial
 */
export function saveScan(userId, scanRecord) {
  const db = readDb();
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const record = {
    id: scanId,
    userId,
    createdAt: new Date().toISOString(),
    ...scanRecord
  };

  db.scans[scanId] = record;

  if (db.users[userId]) {
    db.users[userId].scanCount = (db.users[userId].scanCount || 0) + 1;
    if (!db.users[userId].scansHistory) db.users[userId].scansHistory = [];
    db.users[userId].scansHistory.push(scanId);
  }

  writeDb(db);
  return record;
}

/**
 * Récupère l'historique complet des scans d'un utilisateur
 */
export function getUserScans(userId) {
  const db = readDb();
  const user = db.users[userId];
  if (!user || !user.scansHistory) return [];
  return user.scansHistory.map(id => db.scans[id]).filter(Boolean);
}
