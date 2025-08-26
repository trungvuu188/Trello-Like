import type { UrlPreviewData } from '@/types';
import axiosClients from './axiosClient';

const previewUrl = '/url-preview';

const fetchUrlPreview = async (url: string): Promise<UrlPreviewData> => {
    return axiosClients.get(`${previewUrl}`, {
        params: {
            url,
        },
    });
};

export { fetchUrlPreview };
