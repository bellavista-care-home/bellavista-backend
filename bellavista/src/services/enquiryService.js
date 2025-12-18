import emailjs from '@emailjs/browser';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function sendEnquiryEmail(enquiry) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_CARE_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return false;

  const emailData = {
    from_name: enquiry.name,
    from_email: enquiry.email,
    phone: enquiry.phone,
    enquiry_type: enquiry.enquiryType,
    location: enquiry.location,
    message: enquiry.message,
  };

  const promises = [];

  // 1. Send to Global Admin
  promises.push(
    emailjs.send(serviceId, templateId, { ...emailData, to_email: 'bellavistacarehomegit@gmail.com' }, publicKey)
  );

  // 2. Determine Location Admin
  let locationEmail = 'anwing4umuthe@gmail.com';
  const loc = (enquiry.location || '').toLowerCase();
  
  if (loc.includes('barry')) {
    locationEmail = 'anwinws@gmail.com';
  }

  // 3. Send to Location Admin (if different from global)
  if (locationEmail !== 'bellavistacarehomegit@gmail.com') {
    promises.push(
      emailjs.send(serviceId, templateId, { ...emailData, to_email: locationEmail }, publicKey)
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

export function saveEnquiryLocal(enquiry) {
  const key = 'care_enquiries';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  localStorage.setItem(key, JSON.stringify([enquiry, ...existing]));
}

export async function saveEnquiryToAPI(enquiry) {
  if (!API_BASE) return null;
  const res = await fetch(`${API_BASE}/care-enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry)
  });
  if (!res.ok) throw new Error('API error');
  return await res.json();
}

export async function fetchCareEnquiries() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/care-enquiries`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
