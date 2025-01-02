import { z } from 'zod';
import { productInterface } from './api.types';
import { productTypeSchema } from '@/constant';

export interface cartProductInterface {
  product: productInterface;
  quantity: number;
}

export type productTypeSchemaInterface = z.infer<typeof productTypeSchema>;
