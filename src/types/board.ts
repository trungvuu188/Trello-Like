export interface UrlPreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    favicon?: string;
}

export interface Item {
    id: number;
    content: string;
    urlPreview?: UrlPreviewData;
}

export interface Column {
    id: number;
    name: string;
    tasks: Item[];
}
