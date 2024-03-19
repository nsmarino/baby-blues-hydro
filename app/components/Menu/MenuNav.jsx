import AsteriskBorder from "~/components/AsteriskBorder"

const MenuNav = ({sections}) => {

    return (
        <nav className="relative mx-auto mt-24 py-4 w-full max-w-[1000px] mx-auto">
            <AsteriskBorder bottom={true} top={true} small={true}>
                <div className='flex gap-4 justify-center uppercase text-blue font-mono'>
                    {
                        sections
                            .sort((a, b) => parseInt(a.fields.order.value,10) - parseInt(b.fields.order.value,10))
                            .map(section => {
                                return (
                                    <a className="uppercase" key={section.handle} href={`#${section.handle}`}>{section.handle}</a>
                                )
                            })
                    }
                </div>
            </AsteriskBorder>
        </nav>
    )
}

export default MenuNav