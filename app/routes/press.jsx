/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable prettier/prettier */
import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import MenuNav from "~/components/Menu/MenuNav"
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'
import Marquee from "react-fast-marquee";
import {
    Image,
  } from '@shopify/hydrogen';
import HashBorder from '~/components/HashBorder';
export async function loader({context}) {
    const {storefront} = context;
    const {metaobjects: { nodes }} = await storefront.query(PRESS_QUERY); 
    const articles = nodes.map(article => {
        const artReduced = {
            ...article,
            fields: article.fields.reduce(
                (accumulator, currentValue) => {
                    accumulator[currentValue.key] = {...currentValue}
                    return accumulator
                },
                {},
            )
        }
        return artReduced
    })   
      return articles
}

export default function Press() {
    const articles = useLoaderData()
    console.log(articles)

    return (
        <>
        <header className='h2 uppercase hidden md:block'>
            {/* left side */}
            <div className='absolute top-[200px] left-[300px] -rotate-[6deg]'>Press</div>
            <div className='absolute top-[500px] left-[200px] -rotate-[10deg]'>Press</div>
            <div className='absolute top-[800px] left-[200px] -rotate-[25deg]'>Press</div>

            {/* above content */}
            <div className='absolute top-24 left-1/2 -translate-x-1/2 -rotate-[6deg]'>Press</div>

            {/* right side */}
            <div className='absolute top-[200px] right-[300px] rotate-[6deg]'>Press</div>
            <div className='absolute top-[500px] right-[200px] rotate-[10deg]'>Press</div>
            <div className='absolute top-[800px] right-[200px] rotate-[25deg]'>Press</div>
        </header>
        <div className='md:max-w-[50vw] mx-auto flex flex-col mt-32 md:mt-[300px] bg-[var(--bg)] relative p-4 md:p-12 m-4 hash-border dk-only'>
            <HashBorder top={true} />
            {articles.map(article => {
                return (
                    <article key={article.id} className='mb-12'>
                        <h2 className='uppercase'>
                          {article.fields.link ? 
                            <a href={article.fields.link.value} target="_blank">{article.fields.title.value}</a> 
                            : 
                            article.fields.title.value}
                          </h2>
                        <p className="sans-font uppercase text-[20px]">{article.fields.subtitle.value}</p>
                        {article.fields.image &&
                        <Image
                            alt={article.fields.subtitle.value}
                            aspectRatio="4/3"
                            data={article.fields.image.reference.image}
                            sizes="(min-width: 45em) 50vw, 100vw"
                        />}
                        <div className=" mt-8 richtext" dangerouslySetInnerHTML={{__html: convertSchemaToHtml(article.fields.content.value)}} />
                    </article>
                )
            })}            
        </div>

        </>
    )
}

const PRESS_QUERY = `#graphql
query {
    metaobjects(type: "press_article", first: 10) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              id
              image {
                altText
                height
                url
                width
              }
            }
          }
        }
      }
    }
  }`