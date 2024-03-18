import {Await} from '@remix-run/react';
import {Suspense, useEffect} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import useWindowDimensions from '~/lib/hooks';

/**
 * @param {LayoutProps}
 */
export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  const windowDimensions = useWindowDimensions()

  // useEffect(() => {
  //   console.log("Use effect runs.")
  //   const leftSeeds = document.querySelectorAll(".asterisks-left")
  //   const topSeeds = document.querySelectorAll(".asterisks-top")
  //   const rightSeeds = document.querySelectorAll(".asterisks-right")
  //   const bottomSeeds = document.querySelectorAll(".asterisks-bottom")

  //   topSeeds.forEach(seed => {
  //     const container = seed.parentElement
  //     const rowBorder = document.createElement("span")
  //     rowBorder.classList.add("border-top")
  //     const charactersNeededToFillRow = container.offsetWidth / seed.offsetWidth
  //     for (let i = 0; i < charactersNeededToFillRow - 1; i++) {
  //       rowBorder.innerText += " *"
  //     }
  //     container.appendChild(rowBorder)
  //   })
  //   leftSeeds.forEach(seed => {
  //     const container = seed.parentElement
  //     const columnBorder = document.createElement("span")
  //     columnBorder.classList.add("border-left")
  //     const charactersNeededToFillColumn = container.offsetHeight / seed.offsetHeight
  //     console.log("Characters needed:", charactersNeededToFillColumn, "Offset Height", container.offsetHeight, "Seed offsetwidth", seed.offsetHeight)
  //     for (let i = 0; i < charactersNeededToFillColumn; i++) {
  //       columnBorder.innerHTML += "<span>*</span>"
  //     }
  //       container.appendChild(columnBorder)
  //   })

  //   // bottomSeeds.forEach(seed => {
  //   //   const container = seed.parentElement
  //   //   const rowBorder = document.createElement("span")
  //   //   rowBorder.classList.add("border-bottom")
  //   //   const charactersNeededToFillRow = container.offsetWidth / seed.offsetWidth
  //   //   for (let i = 0; i < charactersNeededToFillRow; i++) {
  //   //     rowBorder.innerText += " *"
  //   //   }
  //   //   container.appendChild(rowBorder)
  //   // })

  //   // rightSeeds.forEach(seed => {
  //   //   const container = seed.parentElement
  //   //   const columnBorder = document.createElement("span")
  //   //   columnBorder.classList.add("border-right")
  //   //   const charactersNeededToFillColumn = container.offsetHeight / seed.offsetWidth
  //   //     for (let i = 0; i < charactersNeededToFillColumn; i++) {
  //   //     columnBorder.innerHTML += "<span>*</span>"
  //   //   }
  //   //     container.appendChild(columnBorder)
  //   // })


  // }, [])

  return (
    <>
      <CartAside cart={cart} />
      <MobileMenuAside menu={header?.menu} shop={header?.shop} />
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />}
      <main className='h-full'>
        {children}
      </main>
      {/* <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
        </Await>
      </Suspense> */}
    </>
  );
}

/**
 * @param {{cart: LayoutProps['cart']}}
 */
function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button
                onClick={() => {
                  window.location.href = inputRef?.current?.value
                    ? `/search?q=${inputRef.current.value}`
                    : `/search`;
                }}
              >
                Search
              </button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

/**
 * @param {{
 *   menu: HeaderQuery['menu'];
 *   shop: HeaderQuery['shop'];
 * }}
 */
function MobileMenuAside({menu, shop}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Aside id="mobile-menu-aside" heading="MENU">
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
      </Aside>
    )
  );
}

/**
 * @typedef {{
 *   cart: Promise<CartApiQueryFragment | null>;
 *   children?: React.ReactNode;
 *   footer: Promise<FooterQuery>;
 *   header: HeaderQuery;
 *   isLoggedIn: Promise<boolean>;
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
