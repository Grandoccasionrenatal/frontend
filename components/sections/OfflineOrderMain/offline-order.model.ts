import { z } from 'zod';

export const offlineOrderFormSchema = z.object({
  customer_name: z.string().min(2, { message: 'Please enter your full name' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone_number: z.string().min(7, { message: 'Please enter a valid phone number' }),
  eircode: z.string().optional(),
  event_date: z.string().min(1, { message: 'Please enter your event date' }),
  user_location: z.number({ description: 'Please select a delivery address' }),
  more_order_details: z.string().optional()
});

export type offlineOrderFormSchemaInterface = z.infer<typeof offlineOrderFormSchema>;
