import { routeTypes } from '@/constant';

export type NavTitlesTypes = 'Home' | 'Products' | 'About' | 'FAQ' | 'Blog' | 'Get a Quote';

export const navItems: { title: NavTitlesTypes; link: routeTypes }[] = [
  { title: 'Home', link: '' },
  { title: 'Products', link: 'products' },
  { title: 'Blog', link: 'blog' },
  { title: 'FAQ', link: 'faq' },
  { title: 'Get a Quote', link: 'get-a-quote' }
];
