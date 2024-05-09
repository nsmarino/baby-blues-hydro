import AsteriskBorder from "~/components/AsteriskBorder"

const MenuNav = ({sections}) => {

    return (
        <nav className="bg-[#FFFFFF] z-10 relative mx-auto mt-[100px] sticky top-[100px] py-4 w-full max-w-[1600px] mx-auto">
            <AsteriskBorder bottom={true} top={true} small={true}>
                <div className='flex justify-between justify-center uppercase text-blue font-mono px-1'>
                    {
                        sections
                            .sort((a, b) => parseInt(a.fields.order.value,10) - parseInt(b.fields.order.value,10))
                            .map(section => {
                                return (
                                    <a className="uppercase h4" key={section.handle} href={`#${section.handle}`}>{section.handle}</a>
                                )
                            })
                    }
                </div>
            </AsteriskBorder>
        </nav>
    )
}

export default MenuNav