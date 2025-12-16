
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchHomes() {
  try {
    const res = await fetch(`${API_URL}/homes`);
    if (!res.ok) throw new Error('Failed to fetch homes');
    return await res.json();
  } catch (error) {
    console.error('Error fetching homes:', error);
    return [];
  }
}

export async function fetchHome(id) {
  try {
    const res = await fetch(`${API_URL}/homes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch home');
    return await res.json();
  } catch (error) {
    console.error('Error fetching home:', error);
    return null;
  }
}

export async function createHome(data) {
  const res = await fetch(`${API_URL}/homes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create home');
  return await res.json();
}

export async function updateHome(id, data) {
  const res = await fetch(`${API_URL}/homes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update home');
  return await res.json();
}

export async function deleteHome(id) {
  const res = await fetch(`${API_URL}/homes/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete home');
  return await res.json();
}
