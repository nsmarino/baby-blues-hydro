/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'
import WillBounce from '../components/WillBounce';
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
  return settingsObj
}

export default function Contact() {
    const data = useLoaderData();
    
    console.log(data.contact_page.value)

    return (
      <div className='relative h-full flex flex-col md:flex-row mt-32 md:mt-0 justify-center items-center gap-8 [&>*]:basis-full max-w-[80%] mx-auto'>
        <div dangerouslySetInnerHTML={{__html: convertSchemaToHtml(data.contact_page.value)}} className="contact-page">
        </div>
        <div><img src="./OPA.png" alt="" className='w-[400px]'/></div>
        <div>
          <p className='info uppercase !text-[14px]'>For Private Events & Parties:</p>
          <p className='mb-8 uppercase mono' style={{textShadow: "var(--text-stroke-medium)"}}><a href='mailto:info@babyblues.nyc' target='_blank'>info@babyblues.nyc</a></p>
          <p className='info uppercase !text-[14px]'>Address:</p>
          <p className='mono' style={{textShadow: "var(--text-stroke-medium)"}}><a href="https://maps.app.goo.gl/BJhhWQ3buH4231rr5" target='_blank'>97 Montrose Avenue</a></p>
          <p className='mb-8 mono' style={{textShadow: "var(--text-stroke-medium)"}}><a href="https://maps.app.goo.gl/BJhhWQ3buH4231rr5" target='_blank'>Brooklyn, NY 11221</a></p>
          <p className='info uppercase !text-[14px]'>Filming:</p>
          <p className='mb-8 uppercase mono' style={{textShadow: "var(--text-stroke-medium)"}}><a href='mailto:scout@babyblues.nyc' target='_blank'>scout@babyblues.nyc</a></p>
        </div>
        <div className='absolute bottom-[15%] left-1/2 -translate-x-1/2'>
          <p className='info uppercase'><a href="/press" className="hidden md:inline will-bounce"><WillBounce text="PRESS" /></a></p>
        </div>
      </div>
    )
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