/**
 * Helper to resolve media URLs (images, videos) properly whether they are relative, 
 * uploaded (/storage/...), or local assets (/assets/...).
 */
export const getMediaUrl = (url, fallback = '/assets/images/jp-yadav-show-logo.png') => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // If already full URL or blob
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('blob:')) {
    return cleanUrl;
  }

  // If storage path e.g. /storage/... or storage/...
  if (cleanUrl.startsWith('/storage/') || cleanUrl.startsWith('storage/')) {
    return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
  }

  // Relative public asset
  return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
};
