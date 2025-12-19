const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function saveBookingLocal(booking) {
  // Deprecated but kept for safety
  const key = 'scheduled_tours';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  localStorage.setItem(key, JSON.stringify([booking, ...existing]));
}

export async function saveBookingToAPI(booking) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/scheduled-tours`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking)
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function fetchScheduledTours() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/scheduled-tours`);
    if (!res.ok) throw new Error('Failed to fetch tours');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function updateBookingInAPI(id, data) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/scheduled-tours/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}
