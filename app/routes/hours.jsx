import {Await, useLoaderData, Link} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';

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
        <div className='h-full flex justify-center items-center gap-8'>
                <div>weekday hours</div>
                <div>image gallery</div>
                <div>weekend hours</div>
        </div>
    )
}