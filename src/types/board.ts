export interface UrlPreviewData {
    url: string;
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    favicon?: string;
}

export interface Item {
    id: string;
    content: string;
    urlPreview?: UrlPreviewData;
}

export interface Column {
    id: string;
    title: string;
    items: Item[];
}
