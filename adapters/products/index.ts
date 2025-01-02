import toast from 'react-hot-toast';
import { BASE_URL, COMMON_HEADER } from '..';

const getProducts = async (params: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/products?${params}`, COMMON_HEADER);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const getProductCategories = async (params: string) => {
  try {
    const res = await fetch(`${BASE_URL}/api/product-categories?${params}`, COMMON_HEADER);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

export const getSingleProduct = async ({ id, params }: { id: string; params: string }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${id}?${params}`, COMMON_HEADER);
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const productService = {
  getProducts,
  getProductCategories,
  getSingleProduct
};

export default productService;
