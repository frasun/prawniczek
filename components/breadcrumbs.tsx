import { FC } from 'react'

interface BreadcrumbsProps {
    items: [string]
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => (
    <nav className='text-sm breadcrumbs'>
        <ul>
            {items.map((item) => (
                <li key={item}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        className='w-4 h-4 mr-2 stroke-current'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                    </svg>
                    {item}
                </li>
            ))}
        </ul>
    </nav>
)

export default Breadcrumbs
