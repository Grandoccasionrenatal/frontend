import { BASE_URL } from '..';

const getBlogPosts = async (params?: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/blog-posts?${params ?? ''}`, { next: { revalidate: 60 } });
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const getBlogPost = async (slug: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const blogService = { getBlogPosts, getBlogPost };

export default blogService;
