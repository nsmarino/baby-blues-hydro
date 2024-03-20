import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import Marquee from "react-fast-marquee";

// export async function loader({context}) {
//     console.log("Context provided in route loader". context)
//     const {storefront} = context;
//     const data = await storefront.query(CONTACT_PAGE_QUERY);
//     return data
// }

export default function Hours() {
    // const data = useLoaderData()
    // console.log("Contact page data in component", data)
    return (
        <>
            <div className='w-1/2 absolute left-1/2 top-1/3 -translate-x-1/2'>
            <Marquee style={{}}>
                <div>THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!! THIS IS WHAT THE RESTAURANT LOOKS LIKE!!!!!!! WOW!!!!!! NICE!!!!!!!! IT IS REALLY BLUE!!!!!!&nbsp;</div>
            </Marquee>
            </div>
            <div className='h-full flex justify-center items-center gap-8'>
                <div>weekday hours</div>
                <div>image gallery</div>
                <div>weekend hours</div>
            </div>
        </>
    )
}