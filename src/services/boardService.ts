import type { ApiResponse, UrlPreviewData } from '@/types';
import axiosClients from './axiosClient';

const previewUrl = '/url-preview';
const projectUrl = '/projects'


const fetchUrlPreview = async (url: string): Promise<UrlPreviewData> => {
    return axiosClients.get(`${previewUrl}`, {
        params: {
            url,
        },
    });
};

const createBoard = async (
    name: string,
    workspaceId: number,
    visibility?: string
): Promise<ApiResponse<null>> => {
    return axiosClients.post(`${projectUrl}`, {
        name,
        workspaceId,
        visibility
    });
};

export { fetchUrlPreview, createBoard };
