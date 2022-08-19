import { FC, ReactElement } from 'react'

const LayoutBasic: FC<{ children: ReactElement }> = ({ children }) => (
    <main className='hero flex-auto'>
        <div className='hero-content flex-col items-start w-full md:w-6/12'>
            {children}
        </div>
    </main>
)

export default LayoutBasic
