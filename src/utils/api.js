// Client API pour communiquer avec le backend GLOW UP

const API_BASE = '/api';

export async function fetchUser() {
  const res = await fetch(`${API_BASE}/user/me`, {
    headers: { 'x-user-id': getStoredUserId() }
  });
  return res.json();
}

export async function loginGoogle(userData) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (data.user?.id) {
    localStorage.setItem('glowup_user_id', data.user.id);
  }
  return data;
}

export async function analyzePhoto(imageBase64, mimeType = 'image/jpeg') {
  const res = await fetch(`${API_BASE}/scan/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify({ imageBase64, mimeType })
  });
  return res.json();
}

export async function generateMaxedPreview(imageBase64) {
  const res = await fetch(`${API_BASE}/scan/generate-maxed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify({ imageBase64 })
  });
  return res.json();
}

export async function getTodayProgram() {
  const res = await fetch(`${API_BASE}/program/today`, {
    headers: { 'x-user-id': getStoredUserId() }
  });
  return res.json();
}

export async function toggleProgramTask(taskId, completed, xpValue) {
  const res = await fetch(`${API_BASE}/program/toggle-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify({ taskId, completed, xpValue })
  });
  return res.json();
}

export async function advanceNextDay() {
  const res = await fetch(`${API_BASE}/program/next-day`, {
    method: 'POST',
    headers: { 'x-user-id': getStoredUserId() }
  });
  return res.json();
}

export async function getPaymentPlans() {
  const res = await fetch(`${API_BASE}/payment/plans`);
  return res.json();
}

export async function initiatePayment(payload) {
  const res = await fetch(`${API_BASE}/payment/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function simulatePaymentSuccess(planId, transactionId) {
  const res = await fetch(`${API_BASE}/payment/simulate-success`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': getStoredUserId()
    },
    body: JSON.stringify({ planId, transactionId })
  });
  return res.json();
}

export async function getFollowupComparison() {
  const res = await fetch(`${API_BASE}/followup/compare`, {
    headers: { 'x-user-id': getStoredUserId() }
  });
  return res.json();
}

export async function getPerfumeRecipes() {
  const res = await fetch(`${API_BASE}/perfume/recipes`);
  return res.json();
}

function getStoredUserId() {
  let id = localStorage.getItem('glowup_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('glowup_user_id', id);
  }
  return id;
}
