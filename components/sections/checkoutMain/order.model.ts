import { z } from 'zod';

export const orderFormSchema = z.object({
  return_date: z.date(),
  start_date: z.date(),
  customer_name: z.string().min(1, { message: 'Please enter a valid name' }),
  shipping: z.boolean(),
  user_location: z.number().optional(),
  deposit_acknowledged: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the non-refundable deposit to continue' })
  }).optional()
});

export const orderSchema = orderFormSchema
  .extend({
    transaction_date: z.date(),
    total_price: z.number(),
    customer_email: z.string().optional()
  })
  .omit({ user_location: true });

export type orderFormSchemaInterface = z.infer<typeof orderFormSchema>;
export type orderSchemaInterface = z.infer<typeof orderSchema>;
