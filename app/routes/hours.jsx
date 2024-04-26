import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import Marquee from "react-fast-marquee";
import { useState } from 'react';
import Carousel from "react-simply-carousel";
import {Image} from '@shopify/hydrogen';

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
            <div className='w-1/2 absolute left-1/2 top-[15%] -translate-x-1/2'>
            <Marquee style={{}}>
                <p className='announcement !text-[20px]'>THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!! THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!!&nbsp;</p>
            </Marquee>
            </div>
            <div className='h-full flex justify-center items-center gap-8'>
                <div className='flex flex-col justify-center items-center gap-4 hash-border'>
                    <p className='info'>Monday - Friday:</p>
                    <p className='info'>9AM - 2.30PM</p>
                </div>

                <div>
                    <SimpleCarousel images={images} />
                </div>

                <div className='flex flex-col justify-center items-center gap-4 hash-border'>
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
          return <div className='serif-font'>
            →
          </div>;
        default:
          return <div className='serif-font'>
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
        right: "33%"
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
        left: "33%"
        }
    }}
    dotsNav={{
        show: false,
    }}
    itemsToShow={1}
    speed={400}
    >
    {images.map((item, index) => (
        <div
        style={{
            width: "33vw",
        }}
        key={index}
        >
        <CarouselImage image={item} />
        </div>
    ))}
    </Carousel>
    <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-[60px] flex items-center justify-center serif-font'>
    ( {activeSlide+1} / {images.length} )
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