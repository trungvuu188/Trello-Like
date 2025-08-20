import type { ApiResponse } from '@/types';
import type { WorkSpace } from '@/types/workspace';
import axiosClients from './axiosClient';

const baseUrl = '/workspaces';

const getWorkspaces = async (): Promise<ApiResponse<WorkSpace[]>> => {
    return axiosClients.get(`${baseUrl}`);
};

const deleteWorkspace = async (id: number): Promise<ApiResponse<String>> => {
    return axiosClients.delete(`${baseUrl}/${id}`);
};

export { getWorkspaces, deleteWorkspace };
