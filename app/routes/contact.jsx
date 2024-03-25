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
      <div className='relative h-full flex justify-center items-center gap-8 [&>*]:basis-full max-w-[80%] mx-auto'>
        <div>
          <p>Some things to note:</p>
          <p>We are walk ins only.</p>
          <p>We don't take reservations.</p>
          <p>We get very busy.</p>

          <p>* if you don’t, please consider if it is worth your time to complain about it on the internet.</p>
        </div>
        <div><img src="./OPA.png" alt="" className='w-[400px]'/></div>
        <div>
          <p>For Private Events & Parties:</p>
          <p>info@babyblues.nyc</p>
          <p>Address:</p>
          <p>97 Montrose Avenue</p>
          <p>Brooklyn, NY 11221</p>
          <p>Filming:</p>
          <p>scout@babyblues.nyc</p>
        </div>
        <div className='absolute bottom-[15%] left-1/2 -translate-x-1/2'>
          <a href="/press">PRESS</a>
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