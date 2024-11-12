import React from 'react';
// import ProductCard from '@/components/ProductCard';
// import SidebarFilters from '@/components/SideBarFilter';
// import SortBy from '@/components/SortBy';

// import SectionProductsHeader from './SectionProductsHeader';
// import { products } from '@/lib/content';

const page = () => {
  return (
    <div className="container mb-20">
      {/* <div className="mb-10">
        <SectionProductsHeader />
      </div>
      <div className="relative flex flex-col lg:flex-row" id="body">
        <div className="pr-4 lg:basis-1/3 xl:basis-1/4">
          <SidebarFilters />
        </div>
        <div className="mb-10 shrink-0 border-t lg:mx-4 lg:mb-0 lg:border-t-0" />
        <div className="relative flex-1">
          <div className="mb-5 flex items-center justify-between">
            <SortBy />
            <span className="text-sm">{products.length} items</span>
          </div>
          <div className="grid flex-1 gap-10 sm:grid-cols-2 xl:grid-cols-2 2xl:gap-12 ">
            {products.map((item) => (
              <ProductCard product={item} key={item.slug} />
            ))}
          </div>
        </div>
      </div> */}

      <h1>Product page</h1>
    </div>
  );
};

export default page;
