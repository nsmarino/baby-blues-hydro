import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import AsteriskBorder from "~/components/AsteriskBorder"

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
  return (
    <div className="mx-[20px]">
      <div className="flex flex-col max-w-[500px] mx-auto my-24 gap-4 md:gap-12">
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
      <br />

      <div className='relative py-8 text-center uppercase'>
        <AsteriskBorder top={true}>
          <div className='flex w-full justify-around'>
            {wys.metaobjects.nodes.map(node => 
              <a className="h2 !text-[20px]" key={node.handle} href={`/policies/${node.handle}`}>{node.field.value}</a>
            )}
          </div>
        </AsteriskBorder>
      </div>
      <div className='gap-8 w-full justify-between hidden md:flex'>
        <div className='relative p-12 basis-full text-center uppercase font-serif font-bold justify-stretch pb-32'>
          <AsteriskBorder top={true} right={true} />
            <div className='flex flex-col h-full'>
              <div className='flex h2 !text-[20px]'><span>IG:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>@babybluesny</span></div>
              <div className='flex h2 !text-[20px]'><span>E:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>info@babyblues.nyc</span></div>
              <div className='relative py-8'><div className="dot-line"></div></div>
              <div className='h2 !text-[20px] mt-auto mb-4'>No reservations - walk ins only</div>
            </div>
          
        </div>          
        <div className='relative p-12 basis-full text-center uppercase font-serif font-bold justify-stretch pb-32'>
          <AsteriskBorder top={true} left={true} />
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
    products(first: 4, sortKey: UPDATED_AT, reverse: false) {
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