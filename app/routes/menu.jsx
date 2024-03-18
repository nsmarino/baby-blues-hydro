import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import MenuNav from "~/components/Menu/MenuNav"
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

function fieldsArrayToObj(arr) {
  const obj = arr.reduce((acc, obj) => {
    acc[obj.key] = {...obj};
    return acc;
  }, {});
  return obj
}

export async function loader({context}) {
    const {storefront} = context;
    const {metaobjects: { nodes }} = await storefront.query(MENU_QUERY); 
    const sections = nodes.map(section => {
      const sectionWithFieldsReduced = {
          ...section,
          fields: section.fields.reduce(
              (accumulator, currentValue) => {
                  accumulator[currentValue.key] = {...currentValue}
                  return accumulator
              },
              {},
          )
      }
      return sectionWithFieldsReduced
  })   
    return sections
}

export default function Menu() {
    const sections = useLoaderData()

    return (
        <div className='m-24 flex flex-col gap-24'>
          <MenuNav sections={sections} />
          <MenuSections sections={sections} />
        </div>
    )
}

const MenuSections = ({sections}) => {

  return (
    <div className='flex justify-center items-center flex-col gap-4 uppercase text-blue font-mono max-w-[1000px] mx-auto'>
      {sections.map(section => {
        return (
          <div key={section.id} className='w-full flex flex-col gap-8'>
            <div className='w-full relative'>
              <div className={`${section.handle !== "drinks" ? "dot-bg" : ""}`}></div>
              <h2 className='relative w-fit mx-auto border-2 py-4 px-12 rounded-[100%] bg-[#FFFFFF] font-bold'>{section.fields.title.value}</h2>
            </div>
            {
              section.fields.items.references.nodes.map(menuItem => <MenuItem item={menuItem} key={menuItem.id} />)
            }
          </div>
        )
      })}
    </div>
  )
}

const MenuItem = ({item}) => {
  const fieldsReduced = item.fields.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.key] = {...currentValue}
      return accumulator
    },
    {},
  );
  return (
    <>
    <div className='flex w-full justify-between'>
      <div className='basis-1/4 font-bold'>
        <div>{(fieldsReduced.gluten_free && fieldsReduced.gluten_free.value==='true')  && "(G.F.) "}{fieldsReduced.title.value}</div>
        <div>{fieldsReduced.subtitle && fieldsReduced.subtitle.value}</div>
      </div>

      <div className='basis-1/2'>
        {fieldsReduced.content && (<div
        className="html"
        dangerouslySetInnerHTML={{
          __html: convertSchemaToHtml(fieldsReduced.content.value),
          }}
         />
        )}
        {fieldsReduced.variations && <>{fieldsReduced.variations.references.nodes.map(variation => <MenuItemVariation variation={variation} key={variation.id} />)}</> }
      </div>

      <div className='basis-1/4 text-right font-bold'>
        <div>${fieldsReduced.price && fieldsReduced.price.value}</div>
      </div>

    </div>
    {fieldsReduced.footer_note && <div className='italic text-center'>{fieldsReduced.footer_note.value}</div>}
    </>
  )
}

const MenuItemVariation = ({variation}) => {
  const fieldsReduced = variation.fields.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue.key] = {...currentValue}
      return accumulator
    },
    {},
  );
  return (
  <div className='flex gap-4'>
    <div>{fieldsReduced.title.value}</div>
    <div>{fieldsReduced.price.value}</div>
  </div>
  )
}

const MENU_QUERY = `#graphql
query {
  metaobjects(type: "menu_section", first: 100) {
    nodes {
      fields {
        key
        value
        references(first: 100) {
          nodes {
            ... on Metaobject {
              id
              fields {
                key
                value
                references(first: 100) {
                  nodes {
                    ... on Metaobject {
                      id
                      fields {
                        key
                        value
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      id
      handle
    }
  }
}`;