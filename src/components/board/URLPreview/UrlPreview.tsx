import { useState, useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface UrlPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

interface UrlPreviewProps {
  url: string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  backendUrl?: string;
}

const UrlPreview: React.FC<UrlPreviewProps> = ({ 
  url, 
  onRemove, 
  showRemoveButton = false,
  backendUrl = 'http://localhost:9000'
}) => {
  const [previewData, setPreviewData] = useState<UrlPreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUrlPreview(url);
  }, [url]);

  const fetchUrlPreview = async (targetUrl: string) => {
    try {
      setIsLoading(true);
      setError(false);
      
      const preview = await fetchUrlPreviewFromBackend(targetUrl);
      console.log(preview);
      
      setPreviewData(preview);
    } catch (err) {
      setError(true);
      console.error('Failed to fetch URL preview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUrlPreviewFromBackend = async (url: string): Promise<UrlPreviewData> => {
    try {
      const response = await fetch(
        `${backendUrl}/api/url-preview?url=${encodeURIComponent(url)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both successful response and error response from backend
      if (data.error) {
        throw new Error(data.message || 'Backend error');
      }
      
      return {
        url: data.url,
        title: data.title || 'No title available',
        description: data.description || '',
        image: data.image || '',
        siteName: data.siteName || new URL(url).hostname,
        favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
      };
    } catch (error) {
      console.error('Backend fetch failed:', error);
      // Fallback to basic info if backend fails
      return {
        url,
        title: new URL(url).hostname,
        description: 'Click to visit this website',
        siteName: new URL(url).hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`
      };
    }
  };

  if (isLoading) {
    return (
      <div className="border border-[#394B59] rounded-lg p-3 bg-[#22272B] animate-pulse">
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-[#394B59] rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#394B59] rounded w-3/4"></div>
            <div className="h-3 bg-[#394B59] rounded w-full"></div>
            <div className="h-3 bg-[#394B59] rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="border border-[#394B59] rounded-lg p-3 bg-[#22272B] relative">
        {showRemoveButton && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
          >
            <X size={16} />
          </button>
        )}
        <div className="flex items-center gap-2 text-[#B6C2CF]">
          <ExternalLink size={16} />
          <span className="text-sm truncate">{url}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#394B59] rounded-lg overflow-hidden bg-[#22272B] hover:border-[#4A90E2] transition-colors cursor-pointer relative group">
      {showRemoveButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="absolute top-2 right-2 z-10 text-gray-400 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded p-1"
        >
          <X size={14} />
        </button>
      )}
      
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {previewData.image && (
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={previewData.image} 
              alt={previewData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="p-3">
          {previewData.siteName && (
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              {previewData.favicon && (
                <img src={previewData.favicon} alt="" className="w-4 h-4" />
              )}
              <span>{previewData.siteName}</span>
            </div>
          )}
          
          {previewData.title && (
            <h3 className="text-[#B6C2CF] font-medium text-sm mb-1 line-clamp-2">
              {previewData.title}
            </h3>
          )}
          
          {previewData.description && (
            <p className="text-gray-400 text-xs line-clamp-2">
              {previewData.description}
            </p>
          )}
          
          <div className="flex items-center gap-1 text-xs text-blue-400 mt-2">
            <ExternalLink size={12} />
            <span className="truncate">{new URL(url).hostname}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default UrlPreview;