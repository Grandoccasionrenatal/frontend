import productService from '@/adapters/products';
import CommonHero from '@/components/commonHero';
import ClientSection from '@/components/hocs/ClientSection';
import NavBottomLine from '@/components/navBottomLine';
import ProductMain from '@/components/sections/ProductMain';
import { apiInterface, productCategoryInterface, productInterface } from '@/types/api.types';
import qs from 'qs';

export const revalidate = 60;

const Product = async () => {
  const productCategoriesData: Promise<apiInterface<productCategoryInterface[]>> =
    productService.getProductCategories(
      qs.stringify({
        populate: '*'
      })
    );

  const productsData: Promise<apiInterface<productInterface[]>> = productService.getProducts(
    qs.stringify(
      {
        populate: '*',
        filters: {
          is_available: {
            $eq: true
          }
        },
        pagination: {
          page: 1,
          pageSize: 6,
          withCount: true
        }
      },
      {
        encodeValuesOnly: true
      }
    )
  );

  const [products, productCategories] = await Promise.all([productsData, productCategoriesData]);

  return (
    <main className="container h-full w-full flex flex-col">
      <NavBottomLine />
      <section className="relative w-full py-12">
        <CommonHero
          description="Suspendisse potenti. Vestibulum vel turpis sem. Sed id malesuada erat. Pellentesque faucibus varius dignissim. Cras sollicitudin lectus a ex blandit vestibulum."
          image="https://plus.unsplash.com/premium_photo-1661631018149-a0268211bbd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          linkedSection="browse"
          tag={'Elite Product Catalogue'}
          title="We have what you need"
          className=""
        />
      </section>
      <ClientSection
        id="browse"
        className="py-12 my-12 px-container-base lg:px-nav-container-lg rounded-custom"
      >
        <ProductMain categories={productCategories} initialData={products} />
      </ClientSection>
    </main>
  );
};

export default Product;
