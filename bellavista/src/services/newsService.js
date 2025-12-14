
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function dataURItoBlob(dataURI) {
  if (!dataURI || typeof dataURI !== 'string' || !dataURI.startsWith('data:')) return null;
  try {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  } catch (e) {
    console.error("Error converting data URI to blob", e);
    return null;
  }
}

export async function fetchNewsItems() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error('Failed to fetch news');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createNewsItem(item) {
  if (!API_BASE) return null;
  
  const formData = new FormData();
  
  // Append fields
  Object.keys(item).forEach(key => {
    if (key === 'image' || key === 'gallery') return; // Handle separately
    formData.append(key, item[key]);
  });

  // Handle Main Image
  const mainImageBlob = dataURItoBlob(item.image);
  if (mainImageBlob) {
    formData.append('image', mainImageBlob, 'main-image.jpg');
  } else if (item.image && item.image.startsWith('http')) {
    formData.append('image', item.image);
  }

  // Handle Gallery
  if (Array.isArray(item.gallery)) {
    item.gallery.forEach((img, idx) => {
      const blob = dataURItoBlob(img);
      if (blob) {
        formData.append(`gallery_${idx}`, blob, `gallery-${idx}.jpg`);
      } else {
         // If it's a URL, we might need to send it as a separate JSON field or append to a list
         // The backend looks for files starting with 'gallery'
         // But for URLs, it looks at `gallery` field in body which is JSON string
      }
    });
    // Send existing URLs as JSON
    const existingUrls = item.gallery.filter(g => g && !g.startsWith('data:'));
    formData.append('gallery', JSON.stringify(existingUrls));
  }

  const res = await fetch(`${API_BASE}/news`, {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) throw new Error('Failed to save news');
  return await res.json();
}

export async function fetchNewsItemById(id) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/news/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteNewsItem(id) {
    if (!API_BASE) return false;
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function updateNewsItem(item) {
  if (!API_BASE) return null;
  
  const formData = new FormData();
  Object.keys(item).forEach(key => {
    if (key === 'image' || key === 'gallery') return;
    formData.append(key, item[key]);
  });
  
  const mainImageBlob = dataURItoBlob(item.image);
  if (mainImageBlob) {
    formData.append('image', mainImageBlob, 'main-image.jpg');
  } else {
     formData.append('image', item.image);
  }
  
  // Gallery logic similar to create
  if (Array.isArray(item.gallery)) {
    item.gallery.forEach((img, idx) => {
      const blob = dataURItoBlob(img);
      if (blob) {
        formData.append(`gallery_${idx}`, blob, `gallery-${idx}.jpg`);
      }
    });
    const existingUrls = item.gallery.filter(g => g && !g.startsWith('data:'));
    formData.append('gallery', JSON.stringify(existingUrls));
  }

  const res = await fetch(`${API_BASE}/news/${item.id}`, {
    method: 'PUT',
    body: formData
  });
  
  if (!res.ok) throw new Error('Failed to update news');
  return await res.json();
}

// Deprecated sync functions for backward compatibility until refactor is complete
export function loadNewsItems() { return []; } 
export function saveNewsItem(item) { return []; } 
