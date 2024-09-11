/* eslint-disable prettier/prettier */
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
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    console.log("Scroll??", hash)

    document.querySelector(".overflow-y-scroll").scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Optional if you want to skip the scrolling animation
    });
  }, [pathname]);

  return null;
}
/**
 * @param {LayoutProps}
 */
export function Layout({cart, children = null, footer, header, settings, isLoggedIn}) {
  const windowDimensions = useWindowDimensions()

  return (
    <>
      {/* <CartAside cart={cart} /> */}
      <MobileMenuAside menu={header?.menu} shop={header?.shop} />
      {header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} settings={settings} />}
      <main className='h-full overflow-y-scroll'>
        <ScrollToTop />
        {children}
      </main>
      <MobileFooter />
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
      <Aside id="mobile-menu-aside" heading={<MobileLogo />}>
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
        <div className="mt-auto">
          <h3 className='uppercase'>For Private Events:</h3>
          <a className="uppercase h2 underline" href="mailto:info@babyblues.nyc">info@babyblues.nyc</a>   
          <div className='flex items-end my-8 justify-between mx-4'>
            <div>
              <p className='h3 leading-none text-left'><a  href="https://maps.app.goo.gl/BJhhWQ3buH4231rr5" target='_blank'>97 Montrose Avenu</a>e</p>
              <p className='h3 leading-none text-left'><a  href="https://maps.app.goo.gl/BJhhWQ3buH4231rr5" target='_blank'>Brooklyn, NY 11221</a></p>
            </div>
            <div><a className='h3 uppercase' href="https://www.instagram.com/babybluesny/" target="_blank">Instagram</a></div>
          </div>                 
        </div>

      </Aside>
    )
  );
}

function MobileLogo() {
  return (
    <span>
      <svg className="w-full" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 237.46 51.62">
        <polygon fill="#0057FF" points="92.24 3.3 92.23 3.3 92 4.68 92.24 3.3"/>
        <polygon fill="#0057FF" points="92.24 3.3 92.23 3.3 92 4.68 92.24 3.3"/>
        <g>
          <path fill="#0057FF" d="M39.57,28.16h-2.3c-.66,0-1.23.46-1.37,1.11l1.37.29h0s-1.37-.29-1.37-.29l-1.98,9.46h0s1.36.28,1.36.28h.02s-1.37-.28-1.37-.28c-.34,1.68-.71,2.75-1.03,3.34-.31.56-.72.95-1.23,1.23-.54.29-1.13.43-1.78.43-.85,0-1.45-.21-1.89-.55-.38-.3-.55-.63-.55-1.12,0-.27.06-.8.24-1.66l2.2-10.56-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-2.3c-.66,0-1.23.47-1.37,1.11l-1.96,9.38h0c-.32,1.46-.51,2.62-.51,3.39,0,1.2.3,2.32.91,3.31h0s0,0,0,0c.64,1.02,1.58,1.79,2.74,2.31l.58-1.27h0,0s-.58,1.27-.58,1.27h0c1.17.53,2.5.77,3.95.77,1.58,0,3.04-.35,4.32-1.09h0s0,0,0,0l-.71-1.2h0s.71,1.2.71,1.2c1.24-.73,2.23-1.7,2.94-2.91h0s0,0,0,0l-1.2-.7h0s1.21.7,1.21.7c.69-1.19,1.2-2.71,1.58-4.51l-1.35-.28h.06s1.28.28,1.28.28h0s2.1-10.08,2.1-10.08c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM26.31,40.12h0s0,0,0,0h0ZM24.26,38.94h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M235.58,28.68c-.27-.33-.66-.52-1.09-.52h-12.4c-.66,0-1.23.46-1.37,1.11l-3.6,17.18c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h13.11c.66,0,1.23-.46,1.37-1.11l-1.37-.29h0l1.37.29.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-9.09l.66-3.18h8.7c.66,0,1.23-.46,1.37-1.11l.41-1.96-1.37-.29h0l1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-8.12l.54-2.54h8.97c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17ZM223.98,31.52h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M216.35,28.16h-13.52c-.66,0-1.23.46-1.37,1.11l-.41,1.96c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h3.91l-2.82,13.54,1.37.29h0s-1.37-.29-1.37-.29c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h2.3c.66,0,1.23-.47,1.37-1.11l2.94-14.11h4.45c.66,0,1.23-.46,1.37-1.11l.41-1.96-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM210.35,31.52h0,0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M120.19,28.16h-12.4c-.66,0-1.23.46-1.37,1.11l1.37.29h0s-1.37-.29-1.37-.29l-3.6,17.18c-.09.41.02.84.28,1.17s.67.52,1.09.52h13.11c.66,0,1.23-.46,1.37-1.11l.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-9.09l.66-3.18h8.7c.66,0,1.23-.46,1.37-1.11l.41-1.96-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-8.12l.54-2.54h8.97c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM109.68,31.52h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M160.61,28.16h-2.24c-.66,0-1.23.46-1.37,1.11l-1.97,9.43c-.41-.98-.88-2.07-1.42-3.27h0s-2.89-6.45-2.89-6.45l-1.28.57h0s1.28-.57,1.28-.57c-.23-.5-.73-.83-1.28-.83h-2.23c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-3.6,17.18,1.37.29h0s-1.37-.29-1.37-.29c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h2.24c.66,0,1.23-.46,1.37-1.11l2-9.59,4.24,9.86c.22.51.73.85,1.29.85h2.27c.66,0,1.23-.46,1.37-1.11l3.59-17.18c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52ZM156.16,39.64l.1.02-.92-.19h0s.82.17.82.17ZM154.59,40.91l-.12.04h0s.12-.04.12-.04h0ZM150.48,36.82h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M18.37,43.4h-7.2l2.82-13.55c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-2.3c-.66,0-1.23.47-1.37,1.11l1.37.29h0l-1.37-.29-3.59,17.18,1.37.29h0l-1.37-.29c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h11.21c.66,0,1.23-.46,1.37-1.11l-1.37-.29h0l1.37.29.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52Z"/>
          <path fill="#0057FF" d="M138.97,30.4s0,0,0,0c0,0,0,0,0,0h0c-1.64-1.7-3.75-2.52-6.23-2.52-2.92,0-5.44,1.12-7.47,3.29h0s.29.27.29.27l.73.68-1.02-.96c-2.05,2.2-3.03,5.04-3.03,8.39,0,1.54.34,3,1.01,4.38h0c.71,1.42,1.75,2.54,3.11,3.34l.71-1.21-.06.11-.64,1.1h0c1.36.79,2.85,1.18,4.46,1.18,1.52,0,2.97-.33,4.33-.98h0s0,0,0,0c0,0,0,0,0,0h0c1.04-.5,2-1.19,2.87-2.07l-.99-.99h0s.98.99.98.99h0c.89-.91,1.62-1.96,2.19-3.17h0c.77-1.63,1.15-3.39,1.15-5.25,0-2.62-.77-4.87-2.42-6.57h0ZM135.82,39.58c-.31.94-.73,1.7-1.23,2.29h0s1.04.88,1.04.88l.03.03s0,0,0,0l-1.07-.9c-.52.61-1.09,1.08-1.71,1.41-.6.31-1.22.46-1.87.46s-1.29-.17-1.91-.53c-.59-.34-1.02-.8-1.32-1.39-.31-.64-.48-1.35-.48-2.16,0-2.33.61-4.03,1.7-5.24h0s-.94-.84-.94-.84h0s.95.84.95.84c1.15-1.29,2.38-1.84,3.71-1.84,1.02,0,1.83.35,2.52,1.08h0s1.01-.95,1.01-.95h0s-1.01.95-1.01.95c.66.7,1.06,1.69,1.06,3.13,0,.89-.16,1.81-.48,2.78h0s1.31.44,1.31.44h.01s0,0,0,0l-1.33-.44ZM133.53,44.52l-.03-.05.03.05h0s0,0,0,0ZM126.52,42.44h0s0,0,0,0ZM134.56,46.19h0s0,0,0,0ZM138.96,41.62s0,0,0,0l.28.13-.28-.13Z"/>
          <path fill="#0057FF" d="M60.29,28.16h-2.24c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-1.97,9.43c-.41-.98-.88-2.07-1.42-3.27h0s-2.89-6.45-2.89-6.45l-1.28.57h0s1.28-.57,1.28-.57c-.23-.5-.73-.83-1.28-.83h-2.23c-.66,0-1.23.46-1.37,1.11l1.37.29h0s-1.37-.29-1.37-.29l-3.6,17.18c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h2.24c.66,0,1.23-.46,1.37-1.11l2-9.59,4.24,9.86c.22.51.73.85,1.29.85h2.27c.66,0,1.24-.46,1.37-1.11l-1.37-.29h0l1.37.29,3.59-17.18-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM54.28,40.91l-.16.06.16-.06h0s-.16.06-.16.06h0s.16-.06.16-.06h0ZM47.72,36.3h0l.78.16h0l-.78-.16.78.16h0s-.78-.16-.78-.16h0ZM55.94,39.66h-.07s-.85-.19-.85-.19c0,0,0,0,0,0l.92.19Z"/>
          <path fill="#0057FF" d="M79.27,29.68h0s0,0,0,0c0,0,0,0,0,0h0c-1.43-1.24-3.25-1.8-5.33-1.8-2.85,0-5.28,1.07-7.21,3.16h0s0,0,0,0h0c-2.13,2.32-3.16,5.23-3.16,8.62,0,2.61.67,4.83,2.22,6.44l1.01-.97h0l-1.01.97h0c1.54,1.6,3.58,2.34,5.98,2.34,2.01,0,3.84-.6,5.46-1.8,1.64-1.21,2.83-2.97,3.63-5.15l-1.32-.48h0s1.32.48,1.32.48c.14-.4.1-.84-.12-1.2-.22-.36-.59-.61-1.01-.66l-2.27-.32-.19,1.39h0l.19-1.39c-.68-.09-1.33.32-1.53.97-.37,1.2-.93,2.04-1.64,2.6-.72.58-1.49.85-2.34.85-1.04,0-1.79-.33-2.36-.95-.54-.58-.92-1.54-.92-3.09,0-1.96.49-3.58,1.43-4.93h0s-1.14-.79-1.14-.79h-.01s0,0,0,0l1.15.8c1.06-1.53,2.35-2.2,3.95-2.2.85,0,1.41.23,1.81.58l.92-1.05h0s-.92,1.05-.92,1.05c0,0,0,0,.01.01.39.34.75.93.94,1.97.13.71.78,1.21,1.51,1.14l2.14-.2c.37-.03.72-.22.95-.51s.35-.66.31-1.04c-.21-1.96-1.01-3.61-2.44-4.84ZM78.35,30.73h0s0,0,0,0l.02-.02-.02.02ZM67.76,31.98h0s-.02-.02-.02-.02l.02.02Z"/>
          <path fill="#0057FF" d="M180.18,28.16h-12.4c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-3.6,17.18,1.37.29h0s-1.37-.29-1.37-.29c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h13.11c.66,0,1.23-.46,1.37-1.11l.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-9.1l.66-3.18h8.7c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-8.12l.54-2.54h8.96c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM169.67,31.52h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M101.55,28.16h-2.3c-.66,0-1.24.47-1.37,1.11l-1.26,6.02h-6.05l1.14-5.45c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-2.29c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-3.6,17.18,1.37.29h0l-1.37-.29c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h2.3c.66,0,1.23-.46,1.37-1.11l-1.37-.29h0l1.37.29,1.47-6.99h6.04l-1.34,6.41c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h2.3c.66,0,1.23-.46,1.37-1.11l-1.37-.29h0l1.37.29,3.59-17.18-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52ZM88.46,38.64h0s0,0,0,0Z"/>
          <path fill="#0057FF" d="M198.38,28.18l-13.52-.03c-.66,0-1.24.46-1.37,1.11l-.41,1.96c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h3.91s-2.86,13.54-2.86,13.54l1.37.29h0s-1.37-.29-1.37-.29c-.09.41.02.84.28,1.17.27.33.66.52,1.08.52h2.3c.66,0,1.24-.46,1.37-1.1l-1.37-.29h0s1.37.29,1.37.29l2.98-14.1h4.45c.66.01,1.24-.45,1.37-1.1l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52ZM192.38,31.52h0s0,0,0,0h0Z"/>
        </g>
        <polygon fill="#0057FF" points="120.33 22.68 120.33 22.68 120.91 21.4 120.33 22.68"/>
        <polygon fill="#0057FF" points="91.67 18.14 91.67 18.15 92.57 19.22 91.67 18.14"/>
        <g>
          <g>
            <path fill="#0057FF" d="M77.24,3.16h-2.74c-.43,0-.83.19-1.09.53l-4.03,5.05,1.09.87h0s-1.09-.87-1.09-.87h0c-.38.48-.73.95-1.06,1.41-.19-.41-.38-.82-.58-1.2h0s0,0,0,0h0l-2.53-5.01-1.25.63h0l1.25-.63c-.24-.47-.72-.77-1.25-.77h-2.46c-.49,0-.94.25-1.19.66s-.28.93-.06,1.36l5.07,10.1-1.28,6.17,1.37.29h0l-1.37-.29c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h2.3c.66,0,1.24-.47,1.37-1.11l1.28-6.16,8.01-10.46c.32-.42.38-.99.14-1.47-.24-.48-.72-.78-1.26-.78ZM66.49,9.57h-.01s.01,0,.01,0Z"/>
            <path fill="#0057FF" d="M37.38,4.33c-.11-.68-.7-1.17-1.38-1.17h-2.71c-.5,0-.97.27-1.22.71l-9.74,17.18,1.22.69h0s-1.22-.69-1.22-.69c-.25.43-.24.96,0,1.4.25.43.71.7,1.21.7h2.52c.51,0,.98-.28,1.22-.72l-1.22-.68h0l1.22.68,2.35-4.23h4.94l.64,3.78,1.38-.23h0l-1.38.23c.11.67.7,1.17,1.38,1.17h2.23c.41,0,.8-.18,1.07-.49.27-.31.38-.73.31-1.13l-2.84-17.18ZM33.36,10.34l-.64-.36-.04-.02.68.38h0ZM33.83,9.57l.63,4.06h-2.88l2.25-4.06Z"/>
            <path fill="#0057FF" d="M58.89,6.12s0,0,0,0c0,0,0,0,0,0h0c-.4-.79-.98-1.44-1.72-1.9h0s0,0-.01,0c0,0,0,0,0,0h0c-.71-.45-1.53-.74-2.43-.89l-.24,1.38h0l.23-1.38c-.59-.1-1.4-.14-2.39-.14h-5.32c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-3.6,17.18c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h8.32c1.31,0,2.53-.28,3.64-.86l-.65-1.24h0s.65,1.24.65,1.24h0c1.12-.59,2.02-1.44,2.68-2.51h0s0,0,0,0c0,0,0,0,0,0h0c.67-1.07,1.03-2.23,1.03-3.46,0-1.1-.32-2.11-.97-2.98h0s0,0,0,0c0,0,0,0,0,0h0c-.14-.19-.3-.36-.47-.52.28-.25.55-.52.78-.84h0s0,0,0,0c0,0,0,0,0,0h0c.7-.97,1.05-2.09,1.05-3.31,0-.89-.19-1.74-.58-2.52h0ZM52.12,19.69h0l-.27-1.37c-.21.04-.77.08-1.83.08h-2.19l.66-3.14h3.22c.65,0,1.13.05,1.48.13.36.08.48.17.49.18,0,0,.01.01.02.02l.88-1.08h0s-.88,1.08-.88,1.08c.11.09.25.25.25.74,0,.31-.07.6-.23.9-.15.29-.35.51-.6.68-.25.16-.64.32-1.23.42l.24,1.38h0ZM54.67,6.77h0s-.56,1.28-.56,1.28c.01,0,.02,0,.03.01.11.05.19.11.27.22.06.09.12.24.12.5,0,.63-.2.95-.52,1.19l.82,1.13h0s-.81-1.13-.81-1.13h0c-.36.26-1.17.53-2.76.53h-1.76l.54-2.58h2.52c.49,0,.87.02,1.16.05.3.04.41.08.41.08l.56-1.28h0ZM47.35,13.85h0ZM56.41,5.38h0s0,0,0,0h0ZM56.99,14.16h0s0,0,0,0h0ZM57.29,11.14h0s0,0,0,0ZM57.64,6.74h0s0,0,0,0Z"/>
            <path fill="#0057FF" d="M21.46,13.32h0s0,0,0,0,0,0,0,0h0c-.14-.19-.3-.36-.47-.52.28-.25.55-.52.78-.84h0s0,0,0,0c0,0,0,0,0,0h0c.71-.97,1.05-2.09,1.05-3.31,0-.89-.19-1.74-.58-2.52h0s0,0,0,0c0,0,0,0,0,0h0c-.4-.79-.98-1.44-1.72-1.9h0s0,0-.01,0c0,0,0,0,0,0h0c-.71-.45-1.53-.74-2.43-.89l-.24,1.38h0l.23-1.38c-.59-.1-1.4-.14-2.39-.14h-5.32c-.66,0-1.23.46-1.37,1.11l1.37.29h0l-1.37-.29-3.6,17.18,1.37.29h0l-1.37-.29c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h8.32c1.31,0,2.53-.28,3.64-.86h0s-.65-1.23-.65-1.23h0s.66,1.23.66,1.23c1.12-.59,2.02-1.43,2.68-2.51h0s0,0,0,0c0,0,0,0,0,0h0c.67-1.07,1.03-2.23,1.03-3.46,0-1.1-.32-2.11-.97-2.98ZM15.46,19.69l-.27-1.37c-.21.04-.77.08-1.83.08h-2.19l.66-3.14h3.22c.65,0,1.13.05,1.48.13.36.08.48.17.49.18,0,0,.01.01.02.02.11.09.25.25.25.74,0,.31-.07.6-.23.9-.15.29-.35.51-.6.68-.25.16-.64.32-1.23.42-.01,0-.02,0-.03,0l.27,1.37h0ZM13.37,7.92h2.52c.49,0,.87.02,1.16.05.3.04.41.08.41.08l.56-1.28h0s-.56,1.28-.56,1.28c.01,0,.02,0,.03.01.11.05.19.11.27.22.06.09.12.24.12.5,0,.63-.2.95-.52,1.19l.82,1.13h0s-.82-1.13-.82-1.13h0c-.36.26-1.17.53-2.76.53h-1.76l.54-2.58ZM10.69,13.85h0ZM18.25,12.78h0ZM20.99,6.74h0s0,0,0,0h0ZM19.75,5.38h0s0,0,0,0h0ZM20.21,19.02h0Z"/>
          </g>
          <g>
            <path fill="#0057FF" d="M177.72,17c0-.96-.22-1.87-.69-2.69h0s0,0,0,0c0,0,0,0,0,0h0c-.45-.8-1.09-1.46-1.88-1.98h0c-.58-.39-1.53-.86-2.76-1.4h0c-1.54-.68-2.43-1.1-2.77-1.29h0c-.48-.27-.65-.46-.7-.52-.06-.09-.1-.2-.1-.37,0-.31.09-.47.28-.62h0s-.08-.1-.08-.1l-.8-.99.88,1.09c.36-.29.98-.53,2.04-.53.58,0,1.06.08,1.45.22,0,0,.01,0,.02,0,.44.15.68.31.82.45.16.16.29.37.38.65.02.08.06.29.06.71,0,.39.16.76.45,1.03s.67.4,1.06.37l2.21-.18-.11-1.4h0l.11,1.4c.7-.06,1.25-.63,1.29-1.33,0-.16.01-.31.01-.42,0-1-.31-1.98-.83-2.91h0s0,0,0,0c0,0,0,0,0,0h0c-.6-1.08-1.53-1.88-2.69-2.45-1.2-.59-2.6-.84-4.15-.84-1.32,0-2.56.21-3.68.66h0c-1.14.46-2.09,1.16-2.76,2.14-.65.95-.97,2.02-.97,3.18,0,1,.24,1.94.76,2.78h0c.5.82,1.24,1.51,2.13,2.09,0,0,.01,0,.02.01l.74-1.16v-.02h.01l-.75,1.18c.6.38,1.61.87,2.96,1.45l.56-1.28h0s0,0,0,0l-.55,1.29c.85.37,1.5.68,1.98.95.24.13.42.24.55.34.06.05.11.08.14.11.02.02.03.02.03.03.18.21.23.38.23.55,0,.27-.1.58-.58.98l.89,1.08h0s0,0,0,0l-.9-1.07c-.37.31-1.05.58-2.24.58-.83,0-1.47-.13-1.96-.33-.48-.21-.71-.45-.84-.67-.18-.33-.28-.71-.28-1.14l.02-.55c.02-.4-.14-.79-.44-1.07-.29-.28-.69-.42-1.09-.38l.13,1.39h0s-.13-1.39-.13-1.39l-2.25.21c-.72.07-1.27.67-1.27,1.4,0,2.43.7,4.51,2.45,5.73h0s.75-1.1.75-1.1l.04-.05-.79,1.15c1.53,1.04,3.42,1.51,5.56,1.51,1.45,0,2.78-.24,3.99-.76,1.2-.52,2.2-1.27,2.93-2.28h0c.73-1.02,1.12-2.16,1.12-3.4ZM167.74,9.87h0s0,0,0,0h0ZM167.26,19.68h0s0,0,0,0h0ZM165.75,18.4s0,0,0,0l.04-.02-.04.02ZM175.46,19.57h.01s-.01,0-.01,0h0ZM176.84,6.85h0s0,0,0,0h0Z"/>
            <path fill="#0057FF" d="M158.33,10.46h-8.12l.54-2.54h8.97c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-12.4c-.66,0-1.23.46-1.37,1.11l-3.6,17.18c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h13.11c.66,0,1.23-.46,1.37-1.11l.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-9.1l.66-3.18h8.7c.66,0,1.23-.46,1.37-1.11l.41-1.96c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52Z"/>
            <path fill="#0057FF" d="M101.73,21.04h0s.65,1.24.65,1.24h0c1.12-.59,2.02-1.44,2.68-2.51h0c.67-1.07,1.04-2.23,1.04-3.46,0-1.1-.32-2.11-.97-2.98h0s0,0,0,0c0,0,0,0,0,0h0c-.14-.19-.3-.36-.47-.52.28-.25.55-.52.78-.84h0s0,0,0,0c0,0,0,0,0,0h0c.7-.97,1.05-2.09,1.05-3.31,0-.89-.19-1.74-.58-2.52h0s0,0,0,0c0,0,0,0,0,0h0c-.4-.79-.97-1.44-1.72-1.9h0s0,0-.01,0c0,0,0,0,0,0h0c-.71-.45-1.53-.74-2.43-.89l-.24,1.38h0l.23-1.38c-.59-.1-1.4-.14-2.39-.14h-5.32c-.66,0-1.23.46-1.37,1.11l-3.6,17.18c-.09.41.02.84.28,1.17.27.33.67.52,1.09.52h8.32c1.31,0,2.53-.28,3.64-.86l-.65-1.24ZM99.14,19.69v-.02s-.24-1.36-.24-1.36c0,0-.02,0-.03,0-.21.04-.77.08-1.83.08h-2.19l.66-3.14h3.22c.65,0,1.13.05,1.48.13.36.08.48.17.49.18,0,0,.01.01.02.02l.87-1.07.02-.02h0l-.88,1.08c.11.09.25.25.25.74,0,.31-.07.6-.23.9-.15.29-.35.51-.6.68-.25.16-.64.32-1.23.42l.24,1.38h0ZM97.04,7.92h2.52c.49,0,.87.02,1.16.05.3.04.41.08.41.08l.56-1.28h0s-.56,1.28-.56,1.28c.01,0,.02,0,.03.01.11.05.19.11.27.22.06.09.12.24.12.5,0,.63-.2.95-.52,1.19l.82,1.13h0l-.04-.06-.78-1.08h0c-.36.26-1.17.53-2.76.53h-1.76l.54-2.58ZM95.91,6.52h0ZM101.93,12.78h0ZM104.02,14.16h0s0,0,0,0ZM103.43,5.38h0s0,0,0,0Z"/>
            <path fill="#0057FF" d="M122.25,22.03l.41-1.95c.09-.41-.02-.84-.28-1.17-.27-.33-.67-.52-1.09-.52h-7.2l2.82-13.55c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-2.3c-.66,0-1.23.47-1.37,1.11l-3.59,17.18,1.37.29h0s-1.37-.29-1.37-.29c-.09.41.02.84.28,1.17.27.33.66.52,1.09.52h11.21c.66,0,1.23-.46,1.37-1.11Z"/>
            <path fill="#0057FF" d="M139.43,14.65l.15.03,1.19.25h0s2.1-10.08,2.1-10.08c.09-.41-.02-.84-.29-1.17-.26-.33-.66-.52-1.09-.52h-2.3c-.66,0-1.23.46-1.37,1.11l-1.98,9.46h0s1.36.29,1.36.29h0s-1.37-.28-1.37-.28c-.34,1.68-.71,2.75-1.03,3.34-.31.56-.72.96-1.23,1.23-.54.29-1.13.43-1.78.43-.85,0-1.45-.21-1.89-.55-.38-.3-.55-.63-.55-1.12,0-.27.06-.8.24-1.66h0l2.2-10.55-1.37-.29h0s1.37.29,1.37.29c.09-.41-.02-.84-.28-1.17-.27-.33-.66-.52-1.09-.52h-2.3c-.66,0-1.23.46-1.37,1.11l1.37.29h0s-1.37-.29-1.37-.29l-1.96,9.38h0c-.32,1.46-.51,2.62-.51,3.39,0,1.2.3,2.32.91,3.31h0c.64,1.03,1.58,1.79,2.74,2.32l.58-1.27h0s0,0,0,0l-.58,1.28c1.17.53,2.5.77,3.95.77,1.58,0,3.04-.35,4.32-1.09h0s0,0,0,0c1.24-.73,2.23-1.7,2.94-2.91h0s0,0,0,0c.69-1.19,1.2-2.71,1.58-4.51l-1.34-.28ZM128.24,15.12h0s0,0,0,0Z"/>
          </g>
        </g>
        <path fill="#0057FF" d="M91.98,18.32l.27,1.37-.24-1.38s-.02,0-.03,0Z"/>
      </svg>
    </span>
  )
}

function MobileFooter() {
  const { pathname } = useLocation();

  return (
    <footer className={`${(pathname !== "/") && 'ast-border top-only pb-[40px]'} md:hidden mx-[20px] pt-[40px] ${pathname==='/cart' && 'hidden'}`}>
      <h3 className='uppercase'>For Private Events:</h3>
      <a className="uppercase h2 underline" href="mailto:info@babyblues.nyc">info@babyblues.nyc</a>
      <div className='flex items-end mt-8'>
        <a href="https://maps.app.goo.gl/BJhhWQ3buH4231rr5" target='_blank'>
          <p className='h3 leading-none text-left'>Baby Blues Luncheonette</p>
          <p className='h3 leading-none text-left'>97 Montrose Avenue</p>
          <p className='h3 leading-none text-left'>Brooklyn, NY 11221</p>
        </a>
        <div><a className='h3 uppercase' href="https://www.instagram.com/babybluesny/" target="_blank">Instagram</a></div>
      </div>
    </footer>
  )
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
