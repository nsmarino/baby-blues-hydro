import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {useVariantUrl} from '~/lib/variants';
import AsteriskBorder from './AsteriskBorder';

export function CartMain({layout, cart}) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  console.log("linesCount", linesCount)
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${linesCount ? '' : ' flex items-center justify-center'} ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails hidden={!linesCount} cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({hidden, layout, cart}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details w-full p-32" hidden={hidden}>

      <header className='relative pb-12'>      
        <AsteriskBorder bottom={true}>
        <div className='flex justify-between body-sm font-bold !tracking-normal'>
          <div>Item</div>
          <div>Details</div>
          <div>Quantity</div>
          <div>Total</div>          
        </div>

        </AsteriskBorder>
      </header>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout} itemCount={cart.totalQuantity}>
          {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({lines, layout}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  
  return (
    <li key={id} className="cart-line">
      <div className='flex gap-12 items-center'>
        <CartLineRemoveButton lineIds={[line.id]} />
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={100}
            loading="lazy"
            width={100}
          />
        )}        
      </div>


      <div>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              // close the drawer
              window.location.href = lineItemUrl;
            }
          }}
        >
          <div className='sans-font uppercase text-[2rem]'>
            {product.title}
          </div>
        </Link>
      </div>        
      <CartLineQuantity line={line} />
      <CartLinePrice line={line} as="span" />
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div className='w-[600px] mx-auto fixed bottom-48 left-1/2 -translate-x-1/2'>
      <a href={checkoutUrl} target="_self" className='atc-btn block'>
        Check Out
      </a>
      <br />
    </div>
  );
}

export function CartSummary({cost, layout, children = null, itemCount=0}) {

  return (
    <>
      <div aria-labelledby="cart-summary" className='relative py-12'>
        <AsteriskBorder top={true} bottom={true}>
          <div className="flex w-full justify-between relative pl-24 uppercase">
            <div>Total:</div>
            <div>{itemCount} items</div>
            <div className='text-[2rem] sans-font'>{cost?.subtotalAmount?.amount ? (
                  <Money data={cost?.subtotalAmount} withoutTrailingZeros />
                ) : (
                  '-'
                )}
              </div>
          </div>
        </AsteriskBorder>
      </div>

      {children}
    </>
  );
}

function CartLineRemoveButton({lineIds}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit">
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="path-1-outside-1_707_1425" maskUnits="userSpaceOnUse" x="-1" y="0" width="22" height="23" fill="black">
<rect fill="white" x="-1" width="22" height="23"/>
<path d="M0 22L7.33887 10.7939L0.688477 0.525391H5.75684L10.0635 7.4248L14.2822 0.525391H19.3066L12.627 10.9551L19.9658 22H14.7363L9.97559 14.5732L5.2002 22H0Z"/>
</mask>
<path d="M0 22L7.33887 10.7939L0.688477 0.525391H5.75684L10.0635 7.4248L14.2822 0.525391H19.3066L12.627 10.9551L19.9658 22H14.7363L9.97559 14.5732L5.2002 22H0Z" fill="#0057FF"/>
<path d="M0 22L-0.418282 21.7261C-0.518906 21.8797 -0.527193 22.0762 -0.439868 22.2377C-0.352542 22.3993 -0.183663 22.5 0 22.5L0 22ZM7.33887 10.7939L7.75715 11.0679C7.8656 10.9023 7.86615 10.6883 7.75854 10.5221L7.33887 10.7939ZM0.688477 0.525391V0.0253906C0.50527 0.0253906 0.336734 0.125588 0.249216 0.286539C0.161698 0.44749 0.169213 0.643416 0.268804 0.79719L0.688477 0.525391ZM5.75684 0.525391L6.18099 0.260634C6.08965 0.114305 5.92933 0.0253906 5.75684 0.0253906V0.525391ZM10.0635 7.4248L9.63933 7.68956C9.7311 7.83659 9.89247 7.9256 10.0658 7.9248C10.2391 7.924 10.3996 7.8335 10.4901 7.68564L10.0635 7.4248ZM14.2822 0.525391V0.0253906C14.1081 0.0253906 13.9465 0.115991 13.8557 0.264556L14.2822 0.525391ZM19.3066 0.525391L19.7277 0.795052C19.8263 0.641157 19.833 0.44575 19.7453 0.285422C19.6576 0.125095 19.4894 0.0253906 19.3066 0.0253906V0.525391ZM12.627 10.9551L12.2059 10.6854C12.099 10.8524 12.1008 11.0667 12.2105 11.2318L12.627 10.9551ZM19.9658 22V22.5C20.1501 22.5 20.3194 22.3987 20.4065 22.2363C20.4935 22.0739 20.4842 21.8768 20.3823 21.7233L19.9658 22ZM14.7363 22L14.3154 22.2698C14.4073 22.4133 14.566 22.5 14.7363 22.5V22ZM9.97559 14.5732L10.3965 14.3034C10.3047 14.1601 10.1462 14.0734 9.97593 14.0732C9.8057 14.0731 9.6471 14.1596 9.55502 14.3028L9.97559 14.5732ZM5.2002 22V22.5C5.37031 22.5 5.52875 22.4135 5.62076 22.2704L5.2002 22ZM0.418282 22.2739L7.75715 11.0679L6.92058 10.52L-0.418282 21.7261L0.418282 22.2739ZM7.75854 10.5221L1.10815 0.253591L0.268804 0.79719L6.91919 11.0657L7.75854 10.5221ZM0.688477 1.02539H5.75684V0.0253906H0.688477V1.02539ZM5.33268 0.790147L9.63933 7.68956L10.4876 7.16005L6.18099 0.260634L5.33268 0.790147ZM10.4901 7.68564L14.7088 0.786226L13.8557 0.264556L9.6369 7.16397L10.4901 7.68564ZM14.2822 1.02539H19.3066V0.0253906H14.2822V1.02539ZM18.8856 0.255729L12.2059 10.6854L13.048 11.2247L19.7277 0.795052L18.8856 0.255729ZM12.2105 11.2318L19.5494 22.2767L20.3823 21.7233L13.0434 10.6784L12.2105 11.2318ZM19.9658 21.5H14.7363V22.5H19.9658V21.5ZM15.1573 21.7302L10.3965 14.3034L9.55465 14.8431L14.3154 22.2698L15.1573 21.7302ZM9.55502 14.3028L4.77963 21.7296L5.62076 22.2704L10.3961 14.8437L9.55502 14.3028ZM5.2002 21.5H0V22.5H5.2002V21.5Z" fill="white" mask="url(#path-1-outside-1_707_1425)"/>
</svg>

      </button>
    </CartForm>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
        >
          -
        </button>
      </CartLineUpdateButton>
        <div>{quantity}</div>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
        >
          <span>+</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLinePrice({line, priceType = 'regular', ...passthroughProps}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className='text-[2rem] sans-font'>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({hidden = false, layout = 'aside'}) {
  return (
    <div hidden={hidden}>
      <div className='flex flex-col items-center justify-center gap-24 md:min-w-[600px]'>
            <h2 className='uppercase -rotate-[2deg] scale-[1.25]'>Your cart is empty !!!</h2>
            
            <div>
              <svg width="157" height="172" viewBox="0 0 157 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M72.2192 8.62935C71.8797 8.77044 70.3096 9.03802 68.7299 9.22398C66.5489 9.48091 65.8493 9.62051 65.8219 9.8037C65.8022 9.93649 65.702 10.0563 65.5995 10.0699C65.4968 10.0837 65.2543 10.3073 65.0605 10.567C64.4262 11.4174 64.4435 12.3125 65.2018 17.8552C65.5845 20.6524 65.9628 23.029 66.0425 23.1365C66.3413 23.5391 67.7185 32.1344 72.4999 95.371C72.6845 96.9075 72.932 98.5889 73.05 99.1073C73.2403 99.9445 73.2274 100.089 72.9343 100.4C72.3997 100.967 71.8671 100.918 71.0612 100.229C70.6573 99.8829 70.1058 99.3143 69.8356 98.965C69.5655 98.6156 69.07 98.0545 68.7344 97.7182C68.3987 97.3818 68.1125 97.0176 68.0981 96.9092C68.0837 96.8006 67.7844 96.4764 67.4328 96.1886C67.0813 95.9008 66.7823 95.5792 66.7683 95.4738C66.7544 95.3683 66.6658 95.2922 66.5716 95.3047C66.3241 95.3375 65.8786 94.9023 65.8369 94.5871C65.8172 94.4387 65.5714 94.2419 65.2906 94.1499C64.9915 94.0518 64.7617 93.8442 64.7357 93.6485C64.7103 93.4566 64.4738 93.237 64.1789 93.1316C63.89 93.0283 63.6473 92.8056 63.6229 92.6216C63.5991 92.442 63.4717 92.3094 63.3397 92.3269C63.2077 92.3444 63.0889 92.2772 63.0757 92.1776C63.0625 92.0781 62.6778 91.663 62.2209 91.2552C61.7639 90.8474 61.3783 90.4251 61.364 90.3166C61.3298 90.0584 60.1079 88.9706 59.8852 89.0001C59.7903 89.0127 59.5113 88.8434 59.2654 88.6239C59.0193 88.4043 58.6647 88.1901 58.477 88.1478C58.2893 88.1055 58.1147 87.9095 58.0885 87.7117C58.0585 87.4856 57.9308 87.3668 57.7441 87.3915C57.5809 87.4132 57.2432 87.2155 56.9939 86.952C56.7446 86.6887 56.3378 86.4438 56.0899 86.4076C55.8421 86.3716 55.4324 86.1573 55.1796 85.9318C54.9267 85.706 54.5833 85.5396 54.4164 85.5617C54.2494 85.5838 53.8536 85.3808 53.5366 85.1106C53.2198 84.8403 52.8839 84.6294 52.7903 84.6418C52.6967 84.6542 52.1781 84.4778 51.638 84.25C51.0979 84.0222 50.4252 83.7533 50.1432 83.6524C49.8613 83.5516 49.4689 83.3545 49.2712 83.2142C49.0736 83.0741 48.5467 82.9032 48.1005 82.8344C47.6541 82.7658 47.087 82.5686 46.8402 82.3964C46.5932 82.2244 46.166 82.1133 45.8906 82.1498C45.6152 82.1863 44.9715 82.0918 44.4602 81.9398C42.9583 81.4933 41.9277 81.3165 40.7659 81.3056C40.1662 81.3 39.5347 81.2333 39.3624 81.1571C38.7769 80.8984 36.3103 80.9589 33.8096 81.2934C30.5077 81.7351 28.5722 82.2487 27.5217 82.9617C27.0608 83.2748 26.4087 83.6225 26.0729 83.7347C25.7369 83.8469 25.2603 84.1718 25.0135 84.4567C24.7668 84.7416 24.4957 84.9838 24.4112 84.9949C24.3268 85.0061 23.9504 85.3114 23.5748 85.6734C23.1991 86.0354 22.8146 86.3417 22.7204 86.3542C22.6261 86.3667 22.3182 86.6503 22.0362 86.9843C21.7542 87.3185 21.3352 87.6728 21.1053 87.772C20.8753 87.8709 20.5355 88.1841 20.3502 88.4677C20.1648 88.7514 19.8298 89.0077 19.6058 89.0374C19.3172 89.0756 19.2118 89.1908 19.2439 89.4333C19.2856 89.7478 18.7627 90.2844 18.3631 90.3373C18.2706 90.3496 18.0263 90.6374 17.8204 90.9769C17.6144 91.3164 17.3849 91.6032 17.3104 91.6142C17.0619 91.6507 15.8701 93.4604 15.9077 93.744C15.928 93.8974 15.8466 94.0834 15.7266 94.1572C15.6068 94.2308 15.4257 94.5723 15.3243 94.9161C15.2229 95.2597 14.9489 95.8468 14.7153 96.2206C13.732 97.794 13.5651 98.1819 13.6369 98.7245C13.6774 99.0297 13.6467 99.2877 13.569 99.298C13.4912 99.3083 13.3329 99.8189 13.217 100.433C13.1012 101.046 12.9366 101.777 12.8511 102.056C12.6257 102.793 12.4513 104.113 12.4143 105.364C12.3963 105.965 12.3677 106.905 12.3504 107.454C12.2669 110.095 12.5693 113.656 13.1852 117.279C13.8143 120.98 14.2892 122.721 15.0772 124.217C15.3038 124.646 15.5089 125.147 15.533 125.329C15.5571 125.512 15.7363 125.843 15.9311 126.065C16.126 126.288 16.3727 126.789 16.4793 127.18C16.5859 127.571 16.8986 128.187 17.1741 128.55C17.4497 128.913 17.6968 129.374 17.7234 129.575C17.75 129.776 17.8506 129.982 17.947 130.034C18.0433 130.085 18.1437 130.29 18.17 130.488C18.1963 130.687 18.2898 130.84 18.3778 130.828C18.4658 130.817 18.5544 130.933 18.5747 131.086C18.5951 131.239 18.6837 131.355 18.7717 131.344C18.8597 131.332 18.9491 131.454 18.9703 131.614C18.9916 131.775 19.2555 132.23 19.5569 132.625C19.8582 133.02 20.2343 133.559 20.3928 133.822C20.5511 134.086 20.8351 134.449 21.0238 134.629C21.2125 134.81 21.3839 135.087 21.4048 135.244C21.4257 135.402 21.5148 135.522 21.6028 135.51C21.6908 135.498 21.7743 135.576 21.7885 135.683C21.8027 135.79 22.0159 136.057 22.2624 136.277C22.509 136.497 22.873 136.914 23.0713 137.202C23.2697 137.491 23.4884 137.72 23.5575 137.711C23.6265 137.702 23.6999 137.822 23.7207 137.979C23.7697 138.349 24.9654 139.417 25.2839 139.374C25.4188 139.356 25.5466 139.473 25.5679 139.634C25.6133 139.977 26.053 140.408 26.3213 140.372C26.4243 140.359 26.7437 140.572 27.0309 140.846C27.318 141.12 27.6323 141.334 27.7289 141.321C27.8257 141.308 27.9141 141.369 27.9256 141.455C27.9644 141.749 28.6485 142.335 28.9112 142.3C29.0658 142.279 29.1926 142.417 29.2217 142.637C29.2488 142.842 29.3632 142.997 29.4756 142.982C29.5883 142.967 29.8094 143.116 29.9672 143.313C30.5089 143.989 30.8658 144.311 31.0459 144.288C31.1451 144.274 31.6495 144.633 32.1665 145.085C32.6837 145.537 33.1784 145.897 33.2663 145.886C33.3541 145.874 33.6473 146.069 33.9178 146.32C34.1884 146.57 34.6379 146.872 34.9167 146.992C35.1956 147.111 35.6035 147.355 35.8231 147.534C36.7777 148.312 37.1198 148.547 37.6917 148.814C38.0257 148.97 38.4902 149.222 38.7238 149.373C38.9574 149.524 39.3449 149.622 39.5853 149.59C39.8256 149.558 40.2396 149.684 40.5056 149.869C40.7716 150.055 41.6394 150.309 42.434 150.435C43.2287 150.56 44.1118 150.762 44.3964 150.883C44.6812 151.005 45.3241 151.158 45.8253 151.224C46.3265 151.289 47.0203 151.462 47.3671 151.607C47.7139 151.753 48.3171 151.882 48.7075 151.894C49.6621 151.924 50.5015 152.112 50.5265 152.3C50.5533 152.503 52.0084 152.863 52.5342 152.797C52.7608 152.769 53.288 152.838 53.706 152.952C54.8262 153.257 60.985 152.461 61.6352 151.927C61.8806 151.726 63.0834 151.249 64.3083 150.868C65.533 150.487 66.8233 150.017 67.1757 149.824C67.5279 149.632 68.1067 149.342 68.4618 149.18C68.8169 149.018 69.1896 148.76 69.2901 148.607C69.3903 148.453 69.8353 148.184 70.2786 148.009C70.7218 147.834 71.4802 147.383 71.9638 147.006C72.4473 146.628 72.9479 146.306 73.0761 146.289C73.2042 146.272 73.3899 146.136 73.4885 145.987C73.587 145.838 73.8981 145.52 74.1798 145.281C74.4615 145.041 74.7824 144.699 74.8931 144.52C75.0037 144.342 75.3124 144.046 75.5793 143.863C75.846 143.68 76.0562 143.468 76.0462 143.393C76.0362 143.317 76.1781 143 76.3614 142.688C76.9212 141.735 77.5265 139.82 77.4502 139.244C77.3741 138.67 77.586 137.763 77.9842 136.957C78.1156 136.691 78.2022 136.318 78.177 136.127C78.1517 135.936 78.1921 135.772 78.2667 135.762C78.4945 135.732 78.7294 134.357 78.7546 132.907C78.7679 132.15 78.8349 131.524 78.9038 131.515C78.9728 131.506 79.0076 131.336 78.9813 131.137C78.955 130.939 78.9893 130.724 79.0578 130.66C79.1262 130.595 79.1632 130.011 79.14 129.36C79.02 125.989 79.0079 125.23 79.0511 123.832C79.108 121.995 78.5033 115.069 78.2286 114.409C78.1205 114.15 77.8702 113.066 77.6721 111.999C77.4741 110.933 77.141 109.317 76.9318 108.408C76.3409 105.84 75.6223 101.909 74.618 95.7527C74.1112 92.6457 69.5037 32.1571 69.3641 31.4731C69.194 30.6396 69.1675 30.2219 69.2839 30.2065C69.3795 30.1938 69.4294 29.9709 69.395 29.7111C69.2377 28.5236 70.2623 26.4126 71.1623 26.07C72.7977 25.4473 95.4639 23.0114 96.1276 23.3871C96.3164 23.494 96.8759 23.4812 100.94 23.2777C101.786 23.2354 102.555 23.2666 102.651 23.3469C102.747 23.4273 102.991 23.471 103.193 23.4442C103.395 23.4174 103.57 23.4676 103.582 23.5556C103.603 23.7146 104.068 23.7297 107.343 23.6774C109.056 23.65 110.107 23.5581 111.286 23.3327C112.52 23.0968 114.281 23.0358 114.416 23.2243C114.545 23.4045 115.165 23.4245 117.757 23.3323C118.359 23.3109 118.861 23.3702 118.873 23.4641C118.886 23.558 119.148 23.6014 119.456 23.5606C119.764 23.5198 120.027 23.5701 120.041 23.6724C120.054 23.7747 120.317 23.825 120.625 23.7842C120.933 23.7434 121.196 23.7937 121.21 23.896C121.223 23.9983 121.559 24.039 121.955 23.9866C122.35 23.9341 122.686 23.9749 122.699 24.0772C122.713 24.1794 122.904 24.2393 123.124 24.2101C123.344 24.181 123.535 24.2408 123.548 24.3431C123.563 24.4558 124.266 24.4372 125.333 24.2959C126.4 24.1546 127.103 24.1361 127.118 24.2488C127.132 24.3572 127.675 24.3641 128.422 24.2652C129.126 24.1719 129.712 24.1702 129.724 24.2613C129.751 24.4685 130.632 24.5418 132.152 24.4631C132.797 24.4299 133.333 24.4692 133.344 24.5506C133.355 24.6321 133.577 24.7193 133.838 24.7447C134.1 24.7701 134.442 24.9056 134.599 25.046C134.757 25.1864 134.97 25.2901 135.073 25.2764C135.353 25.2394 140.588 83.7137 140.634 84.0564C140.655 84.22 140.745 84.3444 140.833 84.3327C140.921 84.3211 141.011 84.4482 141.033 84.6152C141.055 84.7822 141.225 85.0363 141.411 85.1801C141.924 85.5769 142.133 86.4869 142.881 91.6045C143.606 96.5557 143.626 97.3973 143.023 97.4772C142.868 97.4977 142.753 97.5981 142.766 97.7004C142.78 97.8026 142.503 97.9245 142.151 97.9711C141.799 98.0177 141.5 97.9722 141.486 97.8699C141.473 97.7676 141.351 97.6986 141.217 97.7165C141.082 97.7343 140.68 97.4895 140.325 97.1723C139.97 96.8551 139.609 96.6048 139.524 96.6161C139.439 96.6274 139.359 96.5542 139.345 96.4534C139.307 96.1613 137.632 94.7787 136.969 94.4914C136.636 94.3473 136.182 94.0758 135.96 93.888C135.737 93.7003 135.483 93.5562 135.396 93.5678C135.309 93.5793 135.165 93.4832 135.076 93.354C134.987 93.2247 134.72 93.0338 134.483 92.9294C134.245 92.8252 133.941 92.6046 133.807 92.4391C133.674 92.2739 133.269 91.9822 132.908 91.7912C132.546 91.6003 132.145 91.3517 132.015 91.2389C131.885 91.1261 131.519 90.9869 131.202 90.9296C130.885 90.872 130.403 90.6727 130.131 90.4863C128.674 89.487 128.231 89.2184 128.069 89.236C127.971 89.2467 127.543 89.1189 127.118 88.952C126.033 88.5256 125.209 88.3008 124.878 88.3411C124.723 88.3601 124.27 88.2541 123.87 88.1057C122.988 87.7774 121.955 87.5927 121.402 87.6645C121.177 87.6938 120.678 87.5921 120.294 87.4386C119.845 87.2596 118.934 87.1724 117.748 87.1953C116.732 87.215 115.67 87.1822 115.387 87.1228C114.664 86.9707 108.06 87.8677 107.532 88.1896C107.299 88.3319 106.321 88.5892 105.359 88.7615C103.419 89.1088 102.312 89.4417 101.053 90.0555C100.591 90.2812 99.9742 90.4984 99.6833 90.538C99.0656 90.6225 97.8171 91.1135 97.4505 91.4162C97.3104 91.532 97.0867 91.6411 96.9535 91.6588C96.8203 91.6764 96.7224 91.7745 96.7359 91.8768C96.7495 91.9791 96.5987 92.0855 96.401 92.1132C95.9496 92.1766 95.0947 92.6682 94.6234 93.1351C94.4255 93.3313 94.038 93.579 93.762 93.686C93.4862 93.7927 93.2284 93.9663 93.189 94.0718C93.1497 94.1773 92.8663 94.5047 92.5592 94.7993C91.8642 95.4662 88.9081 100.001 88.8396 100.505C88.8118 100.71 88.7271 100.885 88.6511 100.895C88.5752 100.905 88.3346 101.597 88.1164 102.432C87.8982 103.268 87.5825 104.452 87.4147 105.065C87.2471 105.678 87.0787 106.637 87.0404 107.196C87.0024 107.755 86.8885 108.522 86.7876 108.9C86.6869 109.277 86.561 109.975 86.5079 110.451C86.4549 110.926 86.3266 111.667 86.2229 112.097C86.119 112.527 86.0395 113.559 86.046 114.391C86.0525 115.222 86.0395 116.076 86.0168 116.287C85.8627 117.728 86.5221 125.051 86.8575 125.622C86.9754 125.822 87.1526 126.316 87.2512 126.719C87.4147 127.387 87.5697 127.92 88.1915 129.954C88.3061 130.329 88.4469 130.629 88.5042 130.622C88.5613 130.614 88.7513 130.993 88.9264 131.465C89.1015 131.936 89.348 132.569 89.4741 132.872C89.6002 133.175 89.7275 133.605 89.757 133.828C89.7865 134.051 89.8739 134.225 89.9513 134.214C90.1152 134.193 90.4162 134.812 90.857 136.079C91.0296 136.575 91.2854 137.094 91.4252 137.233C91.5651 137.372 91.8576 137.846 92.0754 138.285C92.2931 138.725 92.5774 139.18 92.7071 139.298C92.8369 139.415 93.1363 139.844 93.3723 140.25C93.6084 140.657 94.2396 141.57 94.7751 142.279C95.3107 142.989 95.7683 143.683 95.7922 143.822C95.816 143.961 96.0499 144.271 96.3118 144.51C97.4114 145.516 98.8138 146.894 98.8253 146.98C98.8501 147.168 101.524 149.461 101.81 149.54C101.973 149.585 102.122 149.745 102.142 149.895C102.162 150.045 102.444 150.24 102.768 150.329C103.093 150.417 103.418 150.631 103.491 150.803C103.563 150.976 103.77 151.15 103.95 151.19C104.13 151.231 104.289 151.353 104.303 151.462C104.342 151.757 105.062 152.263 105.548 152.337C105.782 152.373 106.196 152.614 106.468 152.872C106.74 153.131 107.077 153.328 107.218 153.309C107.367 153.289 107.494 153.43 107.523 153.647C107.556 153.895 107.679 154.005 107.892 153.976C108.068 153.953 108.223 154.018 108.237 154.12C108.25 154.222 108.401 154.288 108.571 154.265C108.741 154.243 108.948 154.385 109.031 154.583C109.143 154.849 109.322 154.922 109.731 154.868C110.033 154.828 110.291 154.879 110.304 154.981C110.318 155.084 110.508 155.144 110.728 155.115C110.953 155.085 111.235 155.212 111.375 155.407C111.512 155.597 111.715 155.741 111.826 155.726C111.937 155.711 112.039 155.783 112.052 155.885C112.066 155.988 112.293 156.043 112.557 156.008C112.821 155.973 113.048 156.028 113.061 156.13C113.075 156.232 113.226 156.297 113.397 156.275C113.568 156.252 113.763 156.311 113.831 156.407C113.899 156.502 114.095 156.561 114.267 156.538C114.658 156.486 115.273 156.774 115.607 157.165C115.747 157.328 116.033 157.439 116.243 157.412C116.452 157.384 116.68 157.439 116.748 157.534C116.816 157.629 117.223 157.66 117.652 157.603C118.082 157.546 118.483 157.569 118.543 157.653C118.747 157.938 119.725 157.939 123.195 157.657C127.265 157.326 128.246 157.198 132.805 156.403C135.561 155.922 136.304 155.734 136.591 155.448C136.788 155.252 137.264 155.005 137.65 154.899C138.781 154.588 139.626 154.201 140.012 153.817C140.21 153.62 140.519 153.439 140.698 153.415C140.877 153.392 141.013 153.289 140.999 153.186C140.986 153.084 141.105 152.983 141.264 152.962C141.424 152.941 141.676 152.75 141.825 152.539C142.079 152.179 142.396 151.994 143.43 151.602C143.661 151.515 143.873 151.279 143.9 151.078C143.927 150.878 144.089 150.696 144.259 150.673C144.429 150.651 144.557 150.548 144.543 150.446C144.53 150.344 144.647 150.243 144.803 150.223C144.96 150.202 145.17 150.004 145.27 149.782C145.369 149.561 145.548 149.367 145.667 149.351C145.926 149.317 146.281 148.811 146.243 148.529C146.228 148.418 146.703 147.579 147.298 146.664C147.894 145.749 148.365 144.879 148.345 144.73C148.325 144.582 148.381 144.451 148.469 144.439C148.557 144.427 148.607 144.25 148.58 144.046C148.553 143.841 148.59 143.666 148.663 143.656C148.737 143.647 148.846 143.44 148.908 143.198C149.32 141.566 149.531 140.892 149.633 140.879C149.77 140.861 149.805 139.884 149.724 138.36C149.692 137.765 149.724 137.272 149.795 137.262C150.09 137.223 150.138 135.587 149.924 132.875C149.879 132.298 149.876 131.734 149.919 131.62C150.091 131.159 150.018 128.641 149.751 125.82C149.455 122.69 149.458 121.716 149.77 120.671C149.909 120.205 149.894 119.539 149.712 118.124C149.576 117.07 149.478 115.827 149.493 115.362C149.534 114.094 147.239 99.3133 146.64 96.998C146.367 95.9415 146.006 94.5419 145.837 93.8878C145.494 92.5599 139.699 25.0778 139.666 24.1949C139.655 23.8843 139.275 20.8266 138.823 17.4001C138.111 11.9956 137.946 11.0322 137.579 10.1288C137.347 9.55616 137.124 8.86186 137.085 8.58591C137.003 8.00928 136.761 7.70935 136.017 7.25733C135.228 6.77849 134.912 6.71629 133.747 6.81005C133.163 6.85694 132.312 6.79181 131.855 6.66512C131.32 6.51643 130.283 6.48476 128.928 6.57588C126.705 6.72495 125.342 6.69207 124.945 6.47926C124.812 6.40813 124.151 6.39406 123.476 6.44807C121.604 6.59768 118.654 6.68005 117.375 6.61878C115.32 6.52007 113.966 6.49381 112.478 6.52395C110.245 6.56942 109.302 6.51472 109.279 6.33899C109.267 6.25085 109.02 6.21036 108.73 6.24882C108.439 6.28729 108.123 6.25122 108.027 6.16856C107.867 6.03051 107.017 6.05813 103.01 6.33207C102.211 6.38658 101.366 6.36255 101.131 6.27863C100.896 6.19471 100.54 6.06544 100.341 5.99141C100.141 5.91754 98.4368 6.04664 96.5529 6.27839C94.6693 6.5103 93.0287 6.64549 92.9076 6.57903C92.7865 6.51258 91.0672 6.66917 89.0871 6.92691C87.1071 7.18483 85.4784 7.33094 85.4679 7.25172C85.4256 6.93262 73.2593 8.19772 72.2192 8.62935Z" fill="#0057FF"/>
                <path d="M36.1582 101.506C36.3919 101.852 41.5779 108.629 42.4607 105.539C43.1227 103.222 40.0729 100.373 38.8809 98.7832" stroke="black" stroke-width="3" stroke-linecap="round"/>
                <path d="M25.4836 100.001C12.1633 103.575 27.2987 108.379 27.2987 104.74C27.2987 101.916 23.0548 100.321 21.8534 102.724" stroke="black" stroke-width="3" stroke-linecap="round"/>
                <path d="M34 136.001C36.5487 143.497 38.7047 144.169 46.252 144.169C48.7665 144.169 52.1511 142.538 52.1511 139.631" stroke="black" stroke-width="3" stroke-linecap="round"/>
                <path d="M111.509 110.169C110.117 110.169 109.308 109.772 108.891 109.129C107.678 108.806 107.843 107.94 108.558 107.077C109.736 105.654 112.409 104.24 112.871 105.278C113.99 107.797 114.677 110.169 111.509 110.169Z" fill="#0057FF"/>
                <path d="M110.148 102.001C108.944 105.237 106.602 110.169 111.509 110.169C114.677 110.169 113.99 107.797 112.871 105.278C112.056 103.444 104.342 109.261 110.148 109.261" stroke="black" stroke-width="3" stroke-linecap="round"/>
                <path d="M99.5378 103.001C96.8687 105.086 95 106.066 95 109.354C95 112.315 97.9148 111.188 98.8319 109.354C100.57 105.879 97.863 102.72 95.9076 106.631" stroke="black" stroke-width="3" stroke-linecap="round"/>
                <path d="M100 134.001C101.623 140.347 105.686 144.614 112.202 145.598C116.928 146.311 131.099 143.077 126.319 143.077" stroke="black" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </div>
            
            <Link
              to="/shop"
              className='atc-btn'
              onClick={() => {
                if (layout === 'aside') {
                  window.location.href = '/collections';
                }
              }}
            >
              Go Shopping
            </Link>  
      </div>
    </div>
  );
}

function CartDiscounts({discountCodes}) {
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}