import {Suspense, useState} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';
import Carousel from "react-simply-carousel";
import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/lib/variants';
import AsteriskBorder from "~/components/AsteriskBorder"

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.product.title ?? ''}`}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  const allProducts = storefront.query(ALL_PRODUCTS_QUERY);


  return defer({product, variants, allProducts});
}

/**
 * @param {{
 *   product: ProductFragment;
 *   request: Request;
 * }}
 */
function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  /** @type {LoaderReturnData} */
  const {product, variants, allProducts} = useLoaderData();
  const {selectedVariant} = product;
  return (
    <>
      <div className="flex flex-row-reverse w-full justify-center [&>*]:basis-full px-24 py-[160px] gap-8">
        <ProductImages images={product?.images} />
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
        />
      </div>
      <div>
        <Products products={allProducts} currentProdId={product?.id} />
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
    </>
  );
}
const CarouselButton = ({dir}) => {
  const renderSwitch = () => {
    switch(dir) {
      case 'forward':
        return <div className='serif-font'>
          →
        </div>;
      default:
        return <div className='serif-font'>
          ←
        </div>;
    }
  }
  return (
    <>
      {renderSwitch()}
    </>
  )
}
function ProductImages({images}) {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className='relative pb-[80px] self-start sticky top-24'>
    <Carousel
      containerProps={{
      }}
      preventScrollOnSwipe
      swipeTreshold={60}
      activeSlideIndex={activeSlide}
      activeSlideProps={{
      }}
      onRequestChange={setActiveSlide}
      forwardBtnProps={{
        children: <CarouselButton dir="forward" />,
        style: {
          width: 60,
          height: 60,
          minWidth: 60,
          position: "absolute",
          bottom: 0,
          right: "33%"
        }
      }}
      backwardBtnProps={{
        children: <CarouselButton  dir="back" />,
        style: {
          width: 60,
          height: 60,
          minWidth: 60,
          position: "absolute",
          bottom: 0,
          left: "33%"
        }
      }}
      dotsNav={{
        show: false,
      }}
      itemsToShow={1}
      speed={400}
    >
      {images.nodes.map((item, index) => (
        <div
          style={{
            width: "40vw",
          }}
          key={index}
        >
          <ProductImage image={item} />
        </div>
      ))}
    </Carousel>
    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-[60px] flex items-center justify-center serif-font'>
      ( {activeSlide+1} / {images.nodes.length} )
    </div>
    </div>
  )
}
/**
 * @param {{image: ProductVariantFragment['image']}}
 */
function ProductImage({image}) {

  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image pointer-events-none">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Promise<ProductVariantsQuery>;
 * }}
 */
function ProductMain({selectedVariant, product, variants}) {
  const {title, descriptionHtml} = product;
  const [activeTab, setActiveTab] = useState("")

  return (
    <div className="flex flex-col gap-[40px] items-center text-center">
      <h2 className="sans-font uppercase leading-none">{title}</h2>
      <ProductPrice selectedVariant={selectedVariant} />
      <div className="body-sm" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <div className='border-2 h-[600px]'>
        <div className='flex w-full justify-between p-12 gap-24'>
          <button className="hover:underline" onClick={()=>setActiveTab("details")}>Product Details</button>
          <button className="hover:underline" onClick={()=>setActiveTab("size-fit")}>Size & Fit</button>
          <button className="hover:underline" onClick={()=>setActiveTab("shipping")}>Shipping & Returns</button>
        </div>
        <div className='relative'>
          <div className='absolute p-12' style={activeTab==="details" ? {display: "block"} : {display: "none"}}>CONTENT _ PRODUCT DETAILS</div>
          <div className='absolute p-12' style={activeTab==="size-fit" ? {display: "block"} : {display: "none"}}>CONTENT _ Size and Fit</div>
          <div className='absolute p-12' style={activeTab==="shipping" ? {display: "block"} : {display: "none"}}>CONTENT _ Shipping and Returns</div>
        </div>   
      </div>

    </div>
  );
}

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedVariant'];
 * }}
 */
function ProductPrice({selectedVariant}) {
  return (
    <div className="h2 sans-font italic leading-none">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} withoutTrailingZeros/> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} withoutTrailingZeros/>
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} withoutTrailingZeros />
      )}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductFragment;
 *   selectedVariant: ProductFragment['selectedVariant'];
 *   variants: Array<ProductVariantFragment>;
 * }}
 */
function ProductForm({product, selectedVariant, variants}) {
  const [quantity, setQuantity] = useState(1)
  return (
    <div className="product-form flex flex-col gap-[40px] w-full justify-center">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <div>
        <div className='body-sm bold' style={{textShadow: "var(--text-stroke-medium)"}}>Quantity</div>
        <div className='flex gap-4 justify-center items-center h2 [&>*]:leading-none'>
          <button
            style={{fontSize: "60px"}}
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            name="decrease-quantity"
            onClick={() => setQuantity(Number(Math.max(0, quantity - 1).toFixed(0)))}
          >-</button>
          <span>{quantity}</span>
          <button
            style={{fontSize: "40px", textShadow: "var(--text-stroke-thick)"}}
            aria-label="Increase quantity"
            name="increase-quantity"
            onClick={() => setQuantity(Number((quantity + 1).toFixed(0)))}
          >+</button>          
        </div>

      </div>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: quantity,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

/**
 * @param {{option: VariantOption}}
 */
function ProductOptions({option}) {
  return (
    <div className="product-options mx-auto" key={option.name}>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={`h2 italic sans-font ${isActive ? "selected relative" : ""}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: CartLineInput[];
 *   onClick?: () => void;
 * }}
 */
function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
            className='atc-btn'
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function Products({products, currentProdId}) {
  return (
    <div className="mx-[20px]">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="flex flex-col max-w-[500px] mx-auto my-24 gap-24">
              {products.nodes.map((product) => {
                  if (product.id===currentProdId) return 
                  return (
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
                      <span className="italic">
                        <Money data={product.priceRange.minVariantPrice} withoutTrailingZeros/>
                      </span> 
                    </h2>
                  </Link>
                )
              })}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 10) {
      nodes {
        id
        url
        altText
        height
        width
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

const ALL_PRODUCTS_QUERY = `#graphql
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
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('@remix-run/react').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
/** @typedef {import('storefrontapi.generated').ProductVariantsQuery} ProductVariantsQuery */
/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
/** @typedef {import('@shopify/hydrogen').VariantOption} VariantOption */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineInput} CartLineInput */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').SelectedOption} SelectedOption */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
