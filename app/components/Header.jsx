import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import {useRootLoaderData} from '~/root';
import AsteriskBorder from './AsteriskBorder';
import clockSvg from '~/assets/header/Clock.svg';
import knifeForkSvg from '~/assets/header/KnifeFork.svg';
import musicNoteSvg from '~/assets/header/Note.svg';
import phoneSvg from '~/assets/header/Phone.svg';
/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;

  return (
    <header className="text-xl serif-font uppercase font-bold">
      <div className='inset-0 absolute pointer-events-none z-10' style={{border: "18px solid white"}}>
        <div className="ast-border w-full h-full"></div>
      </div>
      {/* <AsteriskBorder top={true} left={true} bottom={true} right={true} fullscreen={true}> */}
        <div className='fixed inset-x-1/2 whitespace-nowrap top-[20px] -translate-x-1/2 w-fit bg-[#FFFFFF] z-20'>
          <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
            <span className='rounded-outline font-sans uppercase italic font-bold text-[30px] bg-white px-4 block -translate-y-[2px]'>Baby Blues Luncheonette</span>
          </NavLink>          
        </div>
        <div className='fixed whitespace-nowrap bottom-[20px] right-[20px] w-fit bg-[#FFFFFF] z-20'>
          <NavLink prefetch="intent" to="/contact" style={activeLinkStyle} end>
            <img src={phoneSvg} alt="" />
            Contact
          </NavLink>
        </div>
        <div className='fixed whitespace-nowrap top-[20px] right-[20px] w-fit bg-[#FFFFFF] z-20'>
          <NavLink prefetch="intent" to="/menu" style={activeLinkStyle} end>
          <img src={knifeForkSvg} alt="" />
            Menu
          </NavLink>
        </div>
        <div className='fixed whitespace-nowrap bottom-[20px] left-[20px] w-fit bg-[#FFFFFF] z-20'>
          <NavLink prefetch="intent" to="/shop" style={activeLinkStyle} end>
            <img src={musicNoteSvg} alt="" />
              Shop
          </NavLink>
        </div>
        <div className='fixed whitespace-nowrap top-[20px] left-[20px] w-fit bg-[#FFFFFF] z-20'>
          <NavLink prefetch="intent" to="/hours" style={activeLinkStyle} end>
            <img src={clockSvg} alt="" />
            Hours
          </NavLink>
        </div>
        <div className='fixed whitespace-nowrap top-1/2 -translate-y-1/2 left-[20px] w-fit bg-[#FFFFFF] z-20'>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      {/* </AsteriskBorder> */}
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 * }}
 */
export function HeaderMenu({menu, primaryDomainUrl, viewport}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      {/* <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle /> */}
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

/**
 * @param {{count: number}}
 */
function CartBadge({count}) {
  return <NavLink prefetch="intent" to="/cart" style={activeLinkStyle} end>Cart <br />({count})</NavLink>;
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'var(--baby-blue)',
  };
}

/** @typedef {Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>} HeaderProps */
/** @typedef {'desktop' | 'mobile'} Viewport */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('./Layout').LayoutProps} LayoutProps */
