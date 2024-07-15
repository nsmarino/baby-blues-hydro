import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import AsteriskBorder from '~/components/AsteriskBorder';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Baby Blues | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {storefront} = context;
  const settingsQu = await storefront.query(SETTINGS_QUERY);
  const settingsObj = settingsQu.metaobjects.nodes[0].fields.reduce(
    (accumulator, currentValue) => {
        accumulator[currentValue.key] = {...currentValue}
        return accumulator
      },
    {},
  )

  return { settings: settingsObj }
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const { settings } = useLoaderData()

  // PRINTS VALUE FOR TEXT-SHADOW CSS RULE TO CONSOLE:
  const color = "#0057FF" /* blue outline */
  const r = 1 /* width of outline in pixels */
  const n = Math.ceil(2*Math.PI*r) /* number of shadows */
  var str = ''
  for(var i = 0;i<n;i++) /* append shadows in n evenly distributed directions */
  {
    const theta = 2*Math.PI*i/n
    str += (r*Math.cos(theta))+"px "+(r*Math.sin(theta))+"px 0 "+color+(i==n-1?"":",")
  }

  return (
    <>
    <div className="home h-[75vh] mx-[20px] md:h-full flex flex-col justify-center items-center">
      <div className="relative w-full md:w-[810px] px-24 py-24 ast-border mt-auto md:mt-0">
          <h1>
            
            <img src={settings.homepage_logo.reference.image.url} alt="" className='w-full max-h-[150px]' />

          </h1>
      </div>
      <div className='w-full md:w-[810px] flex justify-between font-sans uppercase italic p-2 text-lg md:text-xl'>
        <span>97 Montrose Ave</span>
        <span>Brooklyn, <span className='inline md:hidden'>NY</span><span className='hidden md:inline'>New York</span></span>
      </div> 
    </div>
    <p className='hidden md:block absolute bottom-[20%] w-full text-center uppercase footer-note'>{settings.homepage_announcement.value}</p>
    </>
  );
}

const SETTINGS_QUERY = `#graphql
query {
    metaobjects(type: "settings", first: 1) {
      nodes {
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                width
                id
                height
                altText
              }
            }
          }
        }
      }
    }
  }`;