import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import AsteriskBorder from "~/components/AsteriskBorder"

export async function loader({context}) {
    console.log("Context provided in route loader". context)
    const {storefront} = context;
    const products = storefront.query(PRODUCTS_QUERY);
    return products
}

export default function Shop() {
    const products = useLoaderData()

    return (
      <>
        <Products products={products} />
      </>
    )
}
function Products({products}) {
  return (
    <div className="mx-[20px]">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="flex flex-col max-w-[500px] mx-auto my-24 gap-24">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product gap-4 flex flex-col"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                  />
                  <h2 className="uppercase font-sans text-center font-bold text-xl">{product.title}</h2>
                  <p className="uppercase font-sans italic text-center font-bold text-xl">
                    <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros/>
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
      <div className='relative py-8 text-center uppercase font-serif font-bold'>
            <AsteriskBorder top={true}>
              <p>!!!!!!!!!!!!!!!!! PLEASE ADVISE US OF ANY FOOD ALLERGIES !!!!!!!!!!!!!!!!!</p>
            </AsteriskBorder>
          </div>
          <div className='relative py-8 text-center uppercase font-serif font-bold'>
            <AsteriskBorder top={true}>
              <div className='flex w-full justify-around'>
                <span>T&C</span>
                <span>SHIPPING</span>
                <span>PRIVACY</span>
                <span>ADA</span>
              </div>
            </AsteriskBorder>
          </div>
          <div className='flex gap-8 w-full justify-between'>
            <div className='relative p-24 basis-full text-center uppercase font-serif font-bold'>
              <AsteriskBorder top={true} right={true}>
                <div className='flex flex-col justify-around'>
                  <span>(GF) - GLUTEN FREE</span>
                  <span>(N) - CONTAINS NUTS</span>
                  <span>(V) - VEGAN</span>
                </div>
              </AsteriskBorder>
            </div>          
            <div className='relative p-24 basis-full text-center uppercase font-serif font-bold'>
              <AsteriskBorder top={true} left={true}>
                <div className='flex flex-col justify-around'>
                  <span>(GF) - GLUTEN FREE</span>
                  <span>(N) - CONTAINS NUTS</span>
                  <span>(V) - VEGAN</span>
                </div>
              </AsteriskBorder>
            </div>          
          </div>

    </div>
  );
}

const PRODUCTS_QUERY = `#graphql
  fragment ProductData on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query Products ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: false) {
      nodes {
        ...ProductData
      }
    }
  }
`;