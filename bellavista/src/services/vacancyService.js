const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function fetchVacancies() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/vacancies`);
    if (!res.ok) throw new Error('Failed to fetch vacancies');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createVacancy(formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/vacancies`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to create vacancy');
  return await res.json();
}

export async function updateVacancy(id, formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/vacancies/${id}`, {
    method: 'PUT',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to update vacancy');
  return await res.json();
}

export async function deleteVacancy(id) {
  if (!API_BASE) return false;
  const res = await fetch(`${API_BASE}/vacancies/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function fetchApplications() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/applications`);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function applyForJob(formData) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/apply`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}
