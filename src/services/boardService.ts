import type { UrlPreviewData } from "@/types";
import axiosClients from "./axiosClient";

const baseUrl = '/url-preview'

const fetchUrlPreview = async (url: string): Promise<UrlPreviewData> => {
  return axiosClients.get(`${baseUrl}`, {
    params: {
      url
    }
  })
};

export { fetchUrlPreview }