import React from 'react'
import styled from 'styled-components'
import MESSAGES from '../messages/messages'
import { FETCH_CATEGORIES, getFromApi } from '../utils/api'

const Header = styled.h1.attrs({
    className: 'text-5xl font-bold',
})``

interface Category {
    name: string
    id: number
}

type Categories = [Category]

const Home: React.FC<{ categories: Categories }> = ({ categories }) => (
    <div className='hero min-h-screen bg-base-200'>
        <div className='hero-content text-center flex-col'>
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
            <button className='btn btn-primary mt-6'>
                {MESSAGES.index.action}
            </button>
        </div>
    </div>
)

export async function getStaticProps() {
    const categories = await getFromApi<Categories>(FETCH_CATEGORIES)

    return {
        props: {
            categories,
        },
    }
}

export default Home
