import type { UrlPreviewData } from "@/types";
import * as BoardService from '@/services/boardService';

// URL detection regex
const urlRegex = /(https?:\/\/[^\s]+)/g;

export const detectUrl = (text: string): string | null => {
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
};

export const fetchUrlPreviewUtil = async (url: string): Promise<UrlPreviewData> => {
    return BoardService.fetchUrlPreview(url)
      .then(data => ({
          url: data.url,
          title: data.title || 'No title available',
          description: data.description || '',
          image: data.image || '',
          siteName: data.siteName || new URL(url).hostname,
          favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
        }))
        .catch(error => {
          console.error('Backend fetch failed:', error);
          // Fallback to basic info if backend fails
          return {
            url,
            title: new URL(url).hostname,
            description: 'Click to visit this website',
            siteName: new URL(url).hostname,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
          };
    })
};