
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const SERVER_URL = API_BASE ? API_BASE.replace('/api', '') : '';

function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return `${SERVER_URL}${path}`;
  return path;
}

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
    const items = await res.json();
    return items.map(item => ({
      ...item,
      image: resolveImageUrl(item.image),
      gallery: item.gallery ? item.gallery.map(resolveImageUrl) : []
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createNewsItem(item) {
  if (!API_BASE) return null;
  
  const formData = new FormData();
  Object.keys(item).forEach(key => {
    if (key === 'image' || key === 'gallery') return;
    formData.append(key, item[key]);
  });

  async function uploadBlob(blob, processType) {
    const fd = new FormData();
    fd.append('file', blob, 'upload.jpg');
    fd.append('process_type', processType);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  }

  let mainImageUrl = item.image;
  const mainImageBlob = dataURItoBlob(item.image);
  if (mainImageBlob) {
    mainImageUrl = await uploadBlob(mainImageBlob, 'resize_crop');
  }
  if (mainImageUrl) {
    formData.append('image', mainImageUrl);
  }

  const galleryUrls = [];
  if (Array.isArray(item.gallery)) {
    const isDataUrl = (u) => typeof u === 'string' && u.startsWith('data:');
    const loadDims = (u) => new Promise((resolve) => {
      const im = new Image();
      im.onload = () => resolve({ w: im.naturalWidth, h: im.naturalHeight });
      im.onerror = () => resolve({ w: 0, h: 0 });
      im.src = u;
    });
    for (const img of item.gallery) {
      if (isDataUrl(img)) {
        const dims = await loadDims(img);
        const ratio = dims.h ? dims.w / dims.h : 0;
        const target = 16/9;
        const usePad = ratio && Math.abs(ratio - target) > 0.02;
        const blob = dataURItoBlob(img);
        const processType = usePad ? 'resize_gallery_pad' : 'resize_gallery';
        const url = await uploadBlob(blob, processType);
        galleryUrls.push(url);
      } else if (img) {
        galleryUrls.push(img);
      }
    }
    formData.append('gallery', JSON.stringify(galleryUrls));
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
    const item = await res.json();
    return {
      ...item,
      image: resolveImageUrl(item.image),
      gallery: item.gallery ? item.gallery.map(resolveImageUrl) : []
    };
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
