import { FC, SVGProps } from 'react'
import Link from 'next/link'

import newDocIcon from '../public/icons/icon-newdoc.svg'
import dirIcon from '../public/icons/icon-directory.svg'

type Breadcrumb = {
    name: string
    url?: string
    icon?: string | null
}

interface BreadcrumbsProps {
    items: Breadcrumb[]
}

type BreadcrumbIcon = Record<string, FC<SVGProps<SVGSVGElement>>>

const BreadcrumbIcons: BreadcrumbIcon = {
    newDocument: newDocIcon,
    directory: dirIcon,
}

function getIcon(icon = 'directory') {
    const IconComponent = BreadcrumbIcons[icon]
    return (
        <IconComponent
            width={24}
            height={24}
            stroke='black'
        />
    )
}

const renderCrumb = (name: string, icon?: string | null) => (
    <>
        {icon !== null && getIcon(icon)}
        {name}
    </>
)

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => (
    <nav className='text-sm breadcrumbs'>
        <ul>
            {items.map(({ name, icon, url }) => (
                <li key={name}>
                    {url ? (
                        <Link href={url}>
                            <a href={url}>{renderCrumb(name, icon)}</a>
                        </Link>
                    ) : (
                        renderCrumb(name, icon)
                    )}
                </li>
            ))}
        </ul>
    </nav>
)

export default Breadcrumbs
