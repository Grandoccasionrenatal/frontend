export const COMMON_HEADER: RequestInit = {
  headers: {
    Authorization: `bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`
  },
  cache: 'no-cache'
};

// next: { revalidate: 0 },
export const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
