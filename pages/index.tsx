import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import MESSAGES from '../messages/messages'
import { getFromApi } from '../utils/api'

const Header = styled.h1.attrs({
    className: 'text-5xl font-bold',
})``

interface Category {
    name: string
    id: number
}

type Categories = [Category]

const Home: React.FC<{ categories: Categories }> = ({ categories }) => (
    <>
        <Header>{MESSAGES.global.appName}</Header>
        <div className='max-w-xl grid grid-cols-3 gap-5'>
            {categories.map(({ id, name }) => (
                <div key={`item-${id}`}>
                    <h2 className='card-title truncate block text-left'>
                        {name}
                    </h2>
                </div>
            ))}
        </div>
        <Link href='/form/c4CFmi0z'>
            <button className='btn btn-primary mt-6'>
                {MESSAGES.index.action}
            </button>
        </Link>
    </>
)

export async function getStaticProps() {
    const categories = await getFromApi<Categories>('category')

    return {
        props: {
            categories,
        },
    }
}

export default Home
