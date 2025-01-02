import { productTypeSchemaInterface } from '@/types';

type productTypeLabels = 'Hire (Rental)' | 'Sales' | 'All';

export const productTypeLabelsMap: Record<productTypeSchemaInterface | 'all', productTypeLabels> = {
  hire: 'Hire (Rental)',
  sale: 'Sales',
  all: 'All'
};
