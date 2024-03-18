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
    console.log("Contact page data in component", data)
    return (
      <div className='h-full flex justify-center items-center gap-8'>
        <div>notes</div>
          <div>image that says opa</div>
          <div>contact info</div>
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