import AsteriskBorder from "~/components/AsteriskBorder"
import WillBounce from "~/components/WillBounce"
const MenuNav = ({sections}) => {

    return (
        <nav className="menu-nav bg-[var(--bg)] z-10 mx-auto pt-[90px] md:pt-[80px] sticky top-[0px] md:top-[0px] w-full">
            <div className="max-w-[1208px] relative mx-auto py-4">
              <AsteriskBorder bottom={true} top={true} small={true}>
                <div className='flex flex-col md:flex-row items-center gap-4 py-4 justify-center lg:justify-between uppercase text-blue font-mono px-1'>
                    {
                        sections
                            .sort((a, b) => parseInt(a.fields.order.value,10) - parseInt(b.fields.order.value,10))
                            .map(section => {
                                return (
                                    <a className="uppercase h4 will-bounce" key={section.handle} href={`#${section.handle}`}><WillBounce text={section.fields.title.value} /></a>
                                )
                            })
                    }
                </div>
            </AsteriskBorder>  
            </div>
            
        </nav>
    )
}

export default MenuNav