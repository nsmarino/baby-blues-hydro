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
                  <h2 className="uppercase sans-font text-center">
                    <span>{product.title}</span>
                    <span className="uppercase italic text-center">
                      <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros/>
                    </span>                  
                  </h2>

                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
      <br />

      {/* Shop Footer */}

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
            <div className='relative p-12 basis-full text-center uppercase font-serif font-bold justify-stretch'>
              <AsteriskBorder top={true} right={true} />
                <div className='flex flex-col h-full'>
                  <div className='flex h2'><span>IG:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>@babybluesny</span></div>
                  <div className='flex h2'><span>E:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>info@babyblues.nyc</span></div>
                  <div className='relative py-8'><div className="dot-line"></div></div>
                  <div className='h2 mt-auto mb-4'>No reservations - walk ins only</div>
                </div>
              
            </div>          
            <div className='relative p-12 basis-full text-center uppercase font-serif font-bold justify-stretch'>
              <AsteriskBorder top={true} left={true} />
                <div className='flex flex-col h-full'>
                  <div className='flex h2'><span>Monday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Tuesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Wednesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Thursday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Friday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Saturday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 3.30</span></div>
                  <div className='flex h2'><span>Sunday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 3.30</span></div>
                </div>
              
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