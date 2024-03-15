import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
// export async function loader({context}) {
//   const {storefront} = context;
//   const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
//   const featuredCollection = collections.nodes[0];
//   const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

//   return defer({featuredCollection, recommendedProducts});
// }

export default function Homepage() {
  /** @type {LoaderReturnData} */
  // const data = useLoaderData();
  return (
    <div className="home">
      HOMEPAGE
      {/* <RecommendedProducts products={data.recommendedProducts} /> */}
    </div>
  );
}