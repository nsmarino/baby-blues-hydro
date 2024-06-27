import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import MenuNav from "~/components/Menu/MenuNav"
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'
import AsteriskBorder from "~/components/AsteriskBorder"
import Marquee from "react-fast-marquee";

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
        <div className='mx-[20px] flex flex-col'>
          <MenuNav sections={sections} />
          <MenuSections sections={sections} />
          <div className='relative pb-8 pt-12 text-center uppercase mono-font-bold '>
            <AsteriskBorder top={true}>
              <h3>*20% gratuity will be added to parties of six or more</h3>
            </AsteriskBorder>
          </div>
          <div className='relative pb-8 pt-12 text-center uppercase sans-font font-bold'>
            <AsteriskBorder top={true}>
              <p className='announcement'>!!!!!!!!!!!!!!!!! PLEASE ADVISE US OF ANY FOOD ALLERGIES !!!!!!!!!!!!!!!!!</p>
            </AsteriskBorder>
          </div>
          <div className='relative pb-8 pt-12 text-center uppercase mono-font-bold'>
            <AsteriskBorder top={true}>
              <div className='flex w-full justify-around flex-col md:flex-row'>
                <p className='h3'>(GF) - GLUTEN FREE</p>
                <p className='h3'>(N) - CONTAINS NUTS</p>
                <p className='h3'>(V) - VEGAN</p>
              </div>
            </AsteriskBorder>
          </div>
          <div className='gap-8 flex-col md:flex-row w-full justify-between flex'>
            <div className='relative py-12 md:px-12 md:pb-32 basis-full text-center uppercase font-serif font-bold justify-stretch ast-border md:top-and-right hidden md:block'>
                <div className='flex flex-col h-full'>
                  <div className='flex h2'><span>IG:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>@babybluesny</span></div>
                  <div className='flex h2'><span>E:</span><div className='relative basis-full ml-4 mr-2'><div className="dot-line"></div></div><span>info@babyblues.nyc</span></div>
                  <div className='relative py-8'><div className="dot-line"></div></div>
                  <div className='h2 mt-auto mb-4'>No reservations - walk ins only</div>
                </div>
              
            </div>          
            <div className='relative py-12 md:px-12 md:pb-32 basis-full text-center uppercase font-serif font-bold justify-stretch ast-border top-only md:top-and-left'>
                <div className='flex flex-col h-full'>
                  <div className='flex h2'><span>Monday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Tuesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Wednesday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Thursday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Friday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 2.30</span></div>
                  <div className='flex h2'><span>Saturday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 3.30</span></div>
                  <div className='flex h2'><span>Sunday</span><div className='relative basis-full mx-4'><div className="dot-line"></div></div><span className='whitespace-nowrap'>9 - 3.30</span></div>
                </div>
              
            </div>        
          </div>
        </div>
    )
}

const MenuSections = ({sections}) => {

  return (
    <div className='my-24 flex justify-center items-center flex-col gap-[50px] text-blue mono-font w-full mx-auto'>
      {sections.map(section => {
        if (section.handle === "specials") {
          return (
          <div key={section.id} className="w-full flex flex-col gap-8 relative py-12 my-12">
            <AsteriskBorder bottom={true} top={true}>
              <Marquee style={{}}>
                <h2 className="announcement uppercase">SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPECIALS!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h2>
              </Marquee>  
            </AsteriskBorder>
            <p className='footer-note text-center uppercase py-[40px]'>Ask your server for etc...</p>
            <div className='flex flex-col w-full max-w-[1300px] justify-center mx-auto gap-8 pb-[100px]'>   
              {
                section.fields.items.references.nodes.map(menuItem => <MenuItem item={menuItem} key={menuItem.id} />)
              }
            </div>
          </div>
        )} else return (
          <div key={section.id} className='w-full flex flex-col gap-[50px] max-w-[1300px]'>
            <div className='w-full relative'>
              <div className={`${section.handle !== "drinks" ? "hidden md:block dot-bg" : ""}`}></div>
              <h2 className='relative w-fit md:mx-auto md:border-2 md:py-4 md:px-12 rounded-[100%] bg-[#FFFFFF] mono-font md:mono-font-bold uppercase -mb-[30px] md:mb-0'>{section.fields.title.value}</h2>
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
    <div className='flex flex-wrap md:flex-nowrap md:flex-row w-full justify-between'>
      <div className='w-full md:basis-1/3 md:text-right md:pr-8 uppercase'>
        <h3 className='flex flex-row-reverse md:flex-row justify-end gap-4'>{(fieldsReduced.gluten_free && fieldsReduced.gluten_free.value==='true')  && <span>(G.F.)</span>}<span className='serif-font-bold md:mono-font-bold '>{fieldsReduced.title.value}</span></h3>
        <p className='subtitle'>{fieldsReduced.subtitle && fieldsReduced.subtitle.value}</p>
      </div>

      <div className='w-full md:basis-full relative'>
        {
        fieldsReduced.content ? 
          (<div className="html [&>p]:serif-font md:[&>p]:mono-font" dangerouslySetInnerHTML={{__html: convertSchemaToHtml(fieldsReduced.content.value)}} />)
        : 
        (
          fieldsReduced.variations ? "" : <div className="dot-line hidden md:block"></div>  
        )
        }
        {fieldsReduced.price && <div className='h3 md:hidden'>${fieldsReduced.price.value}</div>}

        {/* Variation Titles: */}
        {fieldsReduced.variations && <>{fieldsReduced.variations.references.nodes.map(variation => <MenuItemVariation variation={variation} key={variation.id} />)}</> }
      </div>

      <div className='md:text-right md:mono-font-bold  md:pl-8 flex flex-col'>
        {/* Item Price: */}
        {fieldsReduced.price && <div className='hidden md:block h3'>${fieldsReduced.price.value}</div>}

        {/* Variation Prices: */}
        <div className='mt-auto'>
          {fieldsReduced.variations && 
            fieldsReduced.variations.references.nodes.map(node => {
              const reducedVariationFields = node.fields.reduce(
                (accumulator, currentValue) => {
                  accumulator[currentValue.key] = {...currentValue}
                  return accumulator
                },
                {},
              );
              return (
                <div className='hidden md:block h3' key={reducedVariationFields.price.value+reducedVariationFields.title.value}>${reducedVariationFields.price.value}</div>
              )
            })
          }          
        </div>

      </div>

    </div>
    {fieldsReduced.footer_note && <p className='!text-[12px] md:!text-[20px] md:text-center uppercase footer-note italic'>{fieldsReduced.footer_note.value}</p>}
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
    <p className="text-[16px] md:text-[28px] md:whitespace-nowrap">{fieldsReduced.title.value}</p>
    <p className='ml-auto md:hidden'>${fieldsReduced.price.value}</p>
    <div className="relative md:basis-full"><div className="dot-line hidden md:block"></div></div>
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