export const fetchUrlPreview = async (url: string) => {
  const response = await fetch(`https://api.linkpreview.net/?key=YOUR_API_KEY&q=${encodeURIComponent(url)}`);
  const data = await response.json();
  return {
    url,
    title: data.title,
    description: data.description,
    image: data.image,
    siteName: data.site_name
  };
};
