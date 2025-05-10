export default async function getURL() {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL_V1;
    console.log(`URL on geturl: ${url}`);
    if (!url) {
      throw new Error("API URL is not defined in environment variables");
    }
    return url;
  } catch (error) {
    console.error("Error fetching URL:", error);
    throw new Error("Failed to fetch URL");
  }
}
