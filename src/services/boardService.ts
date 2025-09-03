import type { ApiResponse, Column, UrlPreviewData } from '@/types';
import axiosClients from './axiosClient';

const previewUrl = '/url-preview';
const projectUrl = '/projects';

const fetchUrlPreview = async (url: string): Promise<UrlPreviewData> => {
    return axiosClients.get(`${previewUrl}`, {
        params: {
            url,
        },
    });
};

const fetchBoardDetail = async (id: number): Promise<ApiResponse<Column[]>> => {
    return axiosClients.get(`${projectUrl}/${id}/columns`);
};

const createNewColumn = async (id: number, title: string): Promise<ApiResponse<null>> => {
    return axiosClients.post(`${projectUrl}/${id}/columns`, {
        name: title,
        position: 2
    });
};

const updateColumn = async (id: number, boardId: number, name: string): Promise<ApiResponse<null>> => {
    return axiosClients.patch(`${projectUrl}/${id}/columns/${boardId}`, {
        name
    });
};

export { fetchUrlPreview, fetchBoardDetail, createNewColumn, updateColumn };
