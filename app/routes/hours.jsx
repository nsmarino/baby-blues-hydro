import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import Marquee from "react-fast-marquee";
import { useState } from 'react';
import Carousel from "react-simply-carousel";
import {Image} from '@shopify/hydrogen';

export const meta = ({data}) => {
  return [{title: `Baby Blues | Hours`}];
};

export async function loader({context}) {
    const {storefront} = context;
    const { metaobjects: {nodes} } = await storefront.query(IMAGE_GALLERY_QUERY);
    const settingsQu = await storefront.query(SETTINGS_QUERY);
    const settingsObj = settingsQu.metaobjects.nodes[0].fields.reduce(
      (accumulator, currentValue) => {
          accumulator[currentValue.key] = {...currentValue}
          return accumulator
        },
      {},
    )

    const images = nodes.map(node => node.fields[0].reference.image)
    return { images, settings: settingsObj }
}

export default function Hours() {
    const {images, settings} = useLoaderData()

    return (
        <>
          <div className='hoursGrid h-full flex flex-col md:grid justify-center items-center gap-12 md:gap-16 mb-12 md:mb-0'>
            <div className='marquee-in-grid'>
              <Marquee>
                  <p className='announcement !text-[20px]'>{settings.hours_announcement.value}&nbsp;</p>
              </Marquee>                 
            </div>
            
            <div className='hours-1-in-grid flex flex-col justify-center items-center gap-4 hash-border top-and-bottom-hash w-[222px] h-[160px] order-2 md:order-1' style={{ borderImageWidth: "22px 0;"}}>
                <p className='info-light uppercase'>Monday - Friday:</p>
                <p className='info-light uppercase'>{settings.weekday_hours.value}</p>
            </div>

            <div className='images-in-grid w-full md:w-[40vw] order-1 md:order-2'>
                <SimpleCarousel images={images} />
                
            </div>

            <div className='hours-2-in-grid order-3 flex flex-col justify-center items-center gap-4 hash-border top-and-bottom-hash w-[222px] h-[160px]' style={{ borderImageWidth: "22px 0;"}}>
                <p className='info-light uppercase'>Saturday - Sunday:</p>
                <p className='info-light uppercase'>{settings.weekend_hours.value}</p>
            </div>
          </div>
        </>
    )
}

const CarouselButton = ({dir}) => {
    const renderSwitch = () => {
      switch(dir) {
        case 'forward':
          return <div className='info'>
            →
          </div>;
        default:
          return <div className='info'>
            ←
          </div>;
      }
    }
    return (
      <>
        {renderSwitch()}
      </>
    )
}

function SimpleCarousel({images}) {
const [activeSlide, setActiveSlide] = useState(0);

return (
  <div className='relative pb-[80px]'>
    <Carousel
      containerProps={{
      }}
      preventScrollOnSwipe
      swipeTreshold={60}
      activeSlideIndex={activeSlide}
      activeSlideProps={{
      }}
      onRequestChange={setActiveSlide}
      forwardBtnProps={{
          children: <CarouselButton dir="forward" />,
          style: {
          width: 60,
          height: 60,
          minWidth: 60,
          position: "absolute",
          bottom: 0,
          right: "15%"
          }
      }}
      backwardBtnProps={{
          children: <CarouselButton  dir="back" />,
          style: {
          width: 60,
          height: 60,
          minWidth: 60,
          position: "absolute",
          bottom: 0,
          left: "15%"
          }
      }}
      dotsNav={{
          show: false,
      }}
      itemsToShow={1}
      speed={400}
    >
    {images.map((item, index) => (
        <div className="w-screen md:w-[33vw]" key={index}>
          <CarouselImage image={item} />
        </div>
    ))}

    </Carousel>
    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-[60px] flex items-center justify-center info'>
    (&nbsp;{activeSlide+1}&nbsp; /&nbsp; {images.length}&nbsp; )
    </div>
  </div>
)
}

function CarouselImage({image}) {
if (!image) {
    return <div className="product-image" />;
}
return (
    <div className="product-image pointer-events-none">
    <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="4/3"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
    />
    </div>
);
}

const IMAGE_GALLERY_QUERY = `#graphql
query {
    metaobjects(type: "gallery_image", first: 10) {
      nodes {
        fields {
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

const SETTINGS_QUERY = `#graphql
query {
    metaobjects(type: "settings", first: 1) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }`;