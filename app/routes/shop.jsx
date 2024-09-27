/* eslint-disable prettier/prettier */
import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import AsteriskBorder from "~/components/AsteriskBorder"
import WillBounce from "~/components/WillBounce"

export async function loader({context}) {
    const {storefront} = context;
    const {products} = await storefront.query(PRODUCTS_QUERY);
    const allWysiwyg = await storefront.query(ALL_WYSIWYG_QUERY);

    const settingsQu = await storefront.query(SETTINGS_QUERY);
    const settings = settingsQu.metaobjects.nodes[0].fields.reduce(
      (accumulator, currentValue) => {
          accumulator[currentValue.key] = {...currentValue}
          return accumulator
        },
      {},
    )

    return defer({products, allWysiwyg, settings});
}

export default function Shop() {
    const {products, allWysiwyg, settings} = useLoaderData()
    return (
        <Products products={products} wys={allWysiwyg} settings={settings} />
    )
}
function Products({products, wys, settings}) {
  console.log(products)
  return (
    <div className="mx-[20px]  mt-[140px]">
      <div className="flex flex-col max-w-[500px] mx-auto my-24 gap-4 md:gap-12">
        {products.nodes.map((product) => (
          <Link
            key={product.id}
            className={`recommended-product gap-4 flex flex-col will-bounce relative ${product.images.nodes.length > 1 && "rollover"}`}
            to={`/products/${product.handle}`}
          >
            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
            />
            <Image
              data={product.images.nodes[1]}
              aspectRatio="1/1"
              className="absolute top-0 left-0 opacity-0"
              sizes="(min-width: 45em) 20vw, 50vw"
            />
            <h2 className="uppercase sans-font text-center">
              <span><WillBounce text={product.title} /></span>
              <div className="uppercase italic text-center">
                <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros/>
              </div>                  
            </h2>

          </Link>
        ))}
      </div>
      <br />

      <div className='relative pb-8 pt-16 text-center uppercase ast-border top-only'>
          <div className='flex flex-col md:flex-row gap-6 md:gap-0 w-full justify-around'>
            {wys.metaobjects.nodes.map(node => 
              <a className="h2 !text-[20px] will-bounce" key={node.handle} href={`/policies/${node.handle}`}><WillBounce text={node.field.value} /></a>
            )}
          </div>
      </div>
      <div className='gap-8 w-full justify-between hidden md:flex'>
        <div className='relative p-24 basis-full text-center uppercase font-serif font-bold justify-stretch pb-32 ast-border top-and-right'>
            <div className='flex flex-col h-full'>
              <div className='flex h2 !text-[20px]'><span>IG:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>@babybluesny</span></div>
              <div className='flex h2 !text-[20px]'><span>E:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>info@babyblues.nyc</span></div>
              <div className='relative py-8'><div className="dot-line"></div></div>
              <div className='h2 !text-[20px] mt-auto mb-4'>No reservations - walk ins only</div>
            </div>
          
        </div>          
        <div className='relative p-24 basis-full text-center uppercase font-serif font-bold justify-stretch pb-32 ast-border top-and-left'>
            <div className='flex flex-col h-full'>
              <div className='flex h2 !text-[20px]'><span>Monday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekday_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Tuesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekday_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Wednesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekday_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Thursday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekday_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Friday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekday_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Saturday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekend_hours.value}</span></div>
              <div className='flex h2 !text-[20px]'><span>Sunday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>{settings.weekend_hours.value}</span></div>
            </div>
          
        </div>        
      </div>
    </div>
  );
}

const ALL_WYSIWYG_QUERY = `#graphql
  query {
    metaobjects(type: "wysiwyg", first: 10) {
      nodes {
        handle
        field(key: "title") {
          value
        }
      }
    }
  }
`

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
    products(first: 20, sortKey: UPDATED_AT, reverse: false) {
      nodes {
        ...ProductData
      }
    }
  }
`;

const SETTINGS_QUERY = `#graphql
query {
    metaobjects(type: "settings", first: 1) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }`;