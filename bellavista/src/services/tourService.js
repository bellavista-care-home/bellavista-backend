import emailjs from '@emailjs/browser';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function sendBookingEmail(booking) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return false;

  // Prepare base data
  const baseData = {
    from_name: booking.name,
    from_email: booking.email,
    phone: booking.phone,
    tour_date: booking.preferredDate,
    tour_time: booking.preferredTime,
    location: booking.location,
    notes: booking.message || 'No additional notes',
  };

  const promises = [];

  // 1. Send to Global Admin
  promises.push(
    emailjs.send(serviceId, templateId, { ...baseData, to_email: 'bellavistacarehomegit@gmail.com' }, publicKey)
  );

  // 2. Determine Location Admin
  // Barry -> anwinws@gmail.com
  // Others -> anwing4umuthe@gmail.com
  let locationEmail = 'anwing4umuthe@gmail.com';
  const loc = (booking.location || '').toLowerCase();
  
  if (loc.includes('barry')) {
    locationEmail = 'anwinws@gmail.com';
  }

  // 3. Send to Location Admin (if different from global)
  // (Assuming global is not one of these, but checking just in case)
  if (locationEmail !== 'bellavistacarehomegit@gmail.com') {
    promises.push(
      emailjs.send(serviceId, templateId, { ...baseData, to_email: locationEmail }, publicKey)
    );
  }

  try {
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('EmailJS Error:', error);
    return false;
  }
}

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
