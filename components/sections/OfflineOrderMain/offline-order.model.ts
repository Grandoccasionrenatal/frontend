import { z } from 'zod';

export const offlineOrderFormSchema = z.object({
  customer_name: z.string().min(1, { message: 'Please enter a valid name' }),
  email: z.string().email(),
  phone_number: z.string(),
  user_location: z.number({ description: 'Please select a delivery location' }),
  more_order_details: z.string()
});

export type offlineOrderFormSchemaInterface = z.infer<typeof offlineOrderFormSchema>;
