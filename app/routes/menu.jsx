import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';

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
    return nodes
}

export default function Menu() {
    const sections = useLoaderData()

    return (
        <div>
          <MenuNav sections={sections} />
          <MenuSections sections={sections} />
        </div>
    )
}

const MenuNav = ({sections}) => {
  return (
    <nav className='flex gap-4 justify-center p-8 uppercase text-blue font-mono'>
      {sections.map(section => {
        return (
          <a href={`#${section.id}`} key={section.id}>{section.fields.title}</a>
        )
      })}
    </nav>
  )
}
const MenuSections = ({sections}) => {
  return (
    <div className='flex justify-center items-center p-8 flex-col gap-4 uppercase text-blue font-mono'>
      {sections.map(section => {
        const fieldsReduced = section.fields.reduce(
          (accumulator, currentValue) => {
            accumulator[currentValue.key] = {...currentValue}
            return accumulator
          },
          {},
        );
        return (
          <div key={section.id} className='border-2 w-full'>
            <h2>{fieldsReduced.title.value}</h2>
            {
              fieldsReduced.items.references.nodes.map(menuItem => <MenuItem item={menuItem} key={menuItem.id} />)
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
    <div>
      <div>
        <div>{(fieldsReduced.gluten_free && fieldsReduced.gluten_free.value==='true')  && "(G.F.) "}{fieldsReduced.title.value}</div>
        <div>{fieldsReduced.subtitle && fieldsReduced.subtitle.value}</div>
      </div>

      <div>
        <div>{fieldsReduced.description && fieldsReduced.description.value}</div>
        <div>{fieldsReduced.price && fieldsReduced.price.value}</div>

        {fieldsReduced.variations && <>{fieldsReduced.variations.references.nodes.map(variation => <MenuItemVariation variation={variation} key={variation.id} />)}</> }
      </div>
    </div>
    {fieldsReduced.footer_note && <div>{fieldsReduced.footer_note.value}</div>}
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