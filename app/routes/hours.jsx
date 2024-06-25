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
    const images = nodes.map(node => node.fields[0].reference.image)
    return images
}

export default function Hours() {
    const images = useLoaderData()

    return (
        <>
            <div className='md:w-1/2 md:absolute md:left-1/2 md:top-[10%] md:-translate-x-1/2 mt-32 mb-12'>
            <Marquee style={{}}>
                <p className='announcement !text-[20px]'>THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!! THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!!&nbsp;</p>
            </Marquee>
            </div>
            <div className='h-full flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 mb-12'>
                <div className='flex flex-col justify-center items-center gap-4 hash-border w-[200px] h-[160px] order-2 md:order-1' style={{ borderImageWidth: "22px 0;"}}>
                    <p className='info'>Monday - Friday:</p>
                    <p className='info'>9AM - 2.30PM</p>
                </div>

                <div className='w-full p-4 md:w-[33vw] order-1 md:order-2'>
                    <SimpleCarousel images={images} />
                </div>

                <div className=' order-3 flex flex-col justify-center items-center gap-4 hash-border w-[200px] h-[160px]' style={{ borderImageWidth: "22px 0;"}}>
                    <p className='info'>Saturday - Sunday:</p>
                    <p className='info'>9AM - 3.30PM</p>
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