import {json} from '@shopify/remix-oxygen';
import {Link, useLoaderData} from '@remix-run/react';
import {defer, redirect} from '@shopify/remix-oxygen';
import AsteriskBorder from "~/components/AsteriskBorder"
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {

  return [{title: `Baby Blues | ${data.wys.fields.title.value}`}];
};

export async function loader({params, context}) {
  const {handle} = params;

  const {storefront} = context;
  const wys = await storefront.query(WYSIWYG_QUERY, {
    variables: {handle},
  });
  const wysReduced = {
      ...wys,
      fields: wys.metaobject.fields.reduce(
          (accumulator, currentValue) => {
              accumulator[currentValue.key] = {...currentValue}
              return accumulator
          },
          {},
      )
  }  

  const allWysiwyg = await storefront.query(ALL_WYSIWYG_QUERY);

  return defer({wys: wysReduced, allWysiwyg})
}

export default function Policy() {
  const { wys, allWysiwyg} = useLoaderData();

  return (
    <div className='relative md:max-w-[50vw] mx-auto'>
        <div className='flex flex-col md:flex-row w-full justify-center items-center gap-4 md:justify-around mt-32 p-8 '>
          {allWysiwyg.metaobjects.nodes.map(node => 
            <a key={node.handle} href={`/policies/${node.handle}`}>{node.field.value}</a>
          )}
        </div>
      <div className='md:max-w-[50vw] mx-auto flex flex-col md:my-[100px] px-4'>
        <div className="richtext" dangerouslySetInnerHTML={{__html: convertSchemaToHtml(wys.fields.content.value)}} />
      </div>
    </div>
  );
}

const WYSIWYG_QUERY = `#graphql
  query Wysiwyg($handle: String!) {
    metaobject(handle: {handle: $handle, type: "wysiwyg"}) {
      fields {
        key
        value
      }
    }
  }
`

const ALL_WYSIWYG_QUERY = `#graphql
  query {
    metaobjects(type: "wysiwyg", first: 10) {
      nodes {
        handle
        field(key: "title") {
          value
        }
      }
    }
  }
`