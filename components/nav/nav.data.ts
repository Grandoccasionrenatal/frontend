import { routeTypes } from '@/constant';

export type NavTitlesTypes = 'Home' | 'Products' | 'About' | 'FAQ';

export const navItems: { title: NavTitlesTypes; link: routeTypes }[] = [
  { title: 'Home', link: '' },
  { title: 'Products', link: 'products' },
  { title: 'About', link: 'about' },
  { title: 'FAQ', link: 'faq' }
];
