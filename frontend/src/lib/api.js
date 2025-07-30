// src/lib/api.js
const API_BASE = 'http://localhost:5000/api'; // Change to your backend URL

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}

export async function registerUser(data) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }

  return res.json();
}
