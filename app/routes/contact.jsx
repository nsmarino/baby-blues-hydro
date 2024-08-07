import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';

export async function loader({context}) {
    console.log("Context provided in route loader". context)
    const {storefront} = context;
    const data = await storefront.query(CONTACT_PAGE_QUERY);
    return data
}

export default function Contact() {
    const data = useLoaderData()

    return (
      <div className='relative h-full flex flex-col md:flex-row mt-32 md:mt-0 justify-center items-center gap-8 [&>*]:basis-full max-w-[80%] mx-auto'>
        <div>
          <p className='info uppercase mb-8 !text-[14px]'>Some things to note:</p>
          <p className='info'>We are walk ins only.</p>
          <p className='info'>We don't take reservations.</p>
          <p className='info'>We get very busy.</p>
          <p className='info'>We don’t have a phone. </p>
          <p className='info'>We only have a few tables.</p>
          <p className='info'>We have a small kitchen.</p>
          <p className='info'>We are humans not robots.</p>
          <p className='info'>We are a small business.</p>
          <p className='info'>We greatly appreciate your patience and kindness.</p>
          <p className='info'>We hope you enjoy your meal *</p>

          <p className='info-sm mt-8'>* if you don’t, please consider if it is worth your time to complain about it on the internet.</p>
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
          <p className='info uppercase'><a href="/press">PRESS</a></p>
        </div>
      </div>
    )
}

const CONTACT_PAGE_QUERY = `#graphql
query {
    metaobjects(type: "test_data", first: 10) {
      nodes {
        handle
        id
        type
        fields {
          type
          value
        }
      }
    }
  }`;