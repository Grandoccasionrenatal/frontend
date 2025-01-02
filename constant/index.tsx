import { z } from 'zod';

const routeEnums = z.enum([
  '',
  'about',
  'products',
  'faq',
  'order',
  'payment',
  'reset-password',
  'forgot-password',
  'offline-order',
  'privacy-policy',
  'delivery-policy',
  'returns-policy',
  'terms-of-service'
]);

export type routeTypes = z.infer<typeof routeEnums>;

const ROUTES = routeEnums.Enum;

const CURRENCY = '€';

export const productTypeSchema = z.enum(['hire', 'sale']);

const PRODUCT_TYPES = productTypeSchema.Enum;

const CONSTANTS = { ROUTES, CURRENCY, PRODUCT_TYPES };

export default CONSTANTS;
