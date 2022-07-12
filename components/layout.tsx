import React, { FC } from 'react'
import Navbar from './navbar'

const Layout: FC<any> = ({ children }) => (
    <>
        <Navbar />
        <main className='hero flex-auto'>
            <div className='hero-content flex-col items-start w-full md:w-6/12'>
                {children}
            </div>
        </main>
    </>
)

export default Layout
