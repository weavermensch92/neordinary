// Helper to safely extract text from Notion properties
export const getNotionText = (prop: any) => {
  if (!prop) return '';
  // Combine all text chunks
  if (prop.type === 'title' && prop.title?.length > 0) {
      return prop.title.map((t: any) => t.plain_text).join('');
  }
  if (prop.type === 'rich_text' && prop.rich_text?.length > 0) {
      return prop.rich_text.map((t: any) => t.plain_text).join('');
  }
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'multi_select') return prop.multi_select?.map((s: any) => s.name).join(', ') || '';
  if (prop.type === 'number') return prop.number?.toString() || '';
  if (prop.type === 'url') return prop.url || '';
  return '';
};

// Helper to extract image URL
export const getNotionImage = (prop: any) => {
  if (!prop) return null;
  if (prop.type === 'files' && prop.files?.length > 0) {
    const file = prop.files[0];
    return file.type === 'file' ? file.file.url : file.external.url;
  }
  return null;
};

// Helper to optimize image URL using wsrv.nl proxy
export const getOptimizedImageUrl = (url: string | null, width: number) => {
  if (!url) return null;
  // If it's a data URL or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // If it's already an Unsplash URL, just ensure it has the right width params
  if (url.includes('images.unsplash.com')) {
      // If it already has query params, just return it (assuming it's already optimized or we don't want to mess with it too much)
      // Or we could try to replace the width. For now, let's just return it to avoid double-proxying.
      return url;
  }
  
  // Use wsrv.nl for resizing and compression (WebP)
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=60&output=webp&n=-1&il=1`;
};
