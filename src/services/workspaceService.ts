import type { ApiResponse } from "@/types";
import axiosClients from "./axiosClient";

const baseURL = '/workspaces';

const workspaceService = {
    // Create a new workspace
    createWorkspace(
        name: string,
        description: string
    ): Promise<ApiResponse<{ message: string }>> {
        return axiosClients.post(`${baseURL}`, {
            name,
            description
        });
    },
}

export default workspaceService;