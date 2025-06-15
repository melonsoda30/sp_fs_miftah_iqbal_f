export const fetcher = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return json;
  } catch (e) {
    console.error(e);
  }
};
