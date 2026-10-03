/**
 * Utility functions for YouTube video ID extraction, thumbnail generation, embed URL creation, and metadata fetching.
 */

export const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return (match && match[1]) ? match[1] : null;
};

export const getYouTubeThumbnail = (url, fallback = '') => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return fallback;
};

export const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&cc_load_policy=1&rel=0`;
  }
  if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&cc_load_policy=1&rel=0';
  return url;
};

/**
 * Fetch video metadata (Title, Author, Thumbnail) from YouTube public oEmbed endpoint.
 * Requires NO API key.
 */
export const fetchYouTubeMetadata = async (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  try {
    const oembedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(oembedUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        return {
          title: data.title,
          description: `${data.title} - Official Episode stream. Featuring guest performances and high-energy comedy.`,
          author: data.author_name || '',
          thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch YouTube oEmbed metadata automatically:", err);
  }

  return {
    title: '',
    description: '',
    thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  };
};
