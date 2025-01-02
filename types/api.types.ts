export interface apiInterface<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface strapiImageInterfaceimage {
  id: number;
  attributes: {
    name: string;
    alternativeText: any;
    caption: any;
    width: number;
    height: number;
    formats: {
      thumbnail: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: any;
        width: number;
        height: number;
        size: number;
        url: string;
      };
      medium: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: any;
        width: number;
        height: number;
        size: number;
        url: string;
      };
      small: {
        name: string;
        hash: string;
        ext: string;
        mime: string;
        path: any;
        width: number;
        height: number;
        size: number;
        url: string;
      };
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: any;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
  };
}

export interface strapiImageInterfaceimageSingleMedia {
  data: strapiImageInterfaceimage;
}

export interface strapiImageInterfaceimageMultiMedia {
  data: strapiImageInterfaceimage[];
}

export interface productInterface {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    details: string;
    price_per_day: number;
    is_available: boolean;
    available_units: number;
    discount?: number | null;
    for: 'hire' | 'sale';
    images?: strapiImageInterfaceimageMultiMedia;
    product_categories?: {
      data: productCategoryInterface[];
    };
    advanced_details?: string | null;
    suggestions: {
      data: productInterface[];
    };
    excl_vat: boolean;
  };
}

export interface bannerInterface {
  id: number;
  attributes: {
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
    image: strapiImageInterfaceimageSingleMedia;
  };
}

export interface heroStatInterface {
  id: number;
  attributes: {
    total: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface productCategoryInterface {
  id: number;
  attributes: {
    name: string;
    type: 'hire' | 'sale';
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: strapiImageInterfaceimageSingleMedia;
    products: {
      data: Array<any>;
    };
  };
}

export interface transactionItemsInterface {
  product: productInterface;
  units: number;
  total_price: number;
}

export interface transactionInterface {
  transaction_date: Date | string;
  return_date: Date | string;
  total_price: number;
  customer_name: string;
  shipping: boolean;
  transaction_items: transactionItemsInterface[];
  customer_email?: string;
  distance?: number;
  address: {
    country: string | null;
    state: string | null;
    city: string | null;
    line1?: string | null;
    line2?: string;
    postal_code?: string;
  };
}

export interface offlineTransactionInterface {
  customer_name: string;
  customer_email?: string;
  phone_number?: string;
  transaction_items: transactionItemsInterface[];
  details: string;
  address: string;
}

export interface userDetailsInterface {
  jwt: string;
  user: {
    blocked: boolean;
    email: string;
    username: string;
    id: number;
    first_name: string;
    last_name: string;
  };
}

export interface advertisementInterface {
  id: number;
  attributes: {
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: strapiImageInterfaceimageSingleMedia;
  };
}




export interface reviewInterface{
  id: number;
  attributes: {
    name:string;
    review:string
  }
}