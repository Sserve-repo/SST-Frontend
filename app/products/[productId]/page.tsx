import Link from 'next/link';
import { pathOr } from 'ramda';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
// import SectionMoreProducts from './SectionMoreProducts';
import SectionProductHeader from './SectionProductHeader';
import { products } from '@/lib/content';

type Props = {
  params: { productId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const getProductData = async (id: string) => {
  return products.find((item) => item.slug === id);
};

const SingleProductPage = async (props: Props) => {
  const selectedProduct = await getProductData(props.params.productId);

  return (
    <div className="container relative md:py-32 sm:py-28 py-24 mx-auto px-4">
      <Link href="/products" className="flex gap-1 text-sm">
          <MdArrowBack className="text-xl" />
          <p>Back to search results</p>
      </Link>

      <div className="mb-20">
        <SectionProductHeader
          images={pathOr([], ['images'], selectedProduct)}
          productName={pathOr('', ['productName'], selectedProduct)}
          price={pathOr(0, ['price'], selectedProduct)}
          reviews={pathOr(0, ['reviews'], selectedProduct)}
          description={pathOr('', ['description'], selectedProduct)}
          slug={pathOr('', ['slug'], selectedProduct)}
          rating={pathOr(0, ['rating'], selectedProduct)}
          discountedPrice={pathOr(0, ['discountedPrice'], selectedProduct)}
          discount={pathOr(0, ['discount'], selectedProduct)}
          features={pathOr([], ['features'], selectedProduct)}
          specifications={pathOr([], ['specifications'], selectedProduct)}
          seller={pathOr('', ['seller'], selectedProduct)}
          estimatedDelivery={pathOr('', ['estimatedDelivery'], selectedProduct)}
          returnPolicy={pathOr('', ['returnPolicy'], selectedProduct)}
        />
      </div>
      <div className="mb-28">
        {/* <SectionMoreProducts /> */}
      </div>
    </div>
  );
};

export default SingleProductPage;
