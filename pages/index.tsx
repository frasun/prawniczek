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
    forms: string[]
}

type Categories = [Category]

const Home: React.FC<{ categories: Categories }> = ({ categories }) => (
    <>
        <Header>{MESSAGES.global.appName}</Header>
        <div className='max-w-xl grid grid-cols-3 gap-5'>
            {categories.map(({ id, name, forms }) => (
                <Link
                    href={`/forms/${id}`}
                    key={`item-${id}`}>
                    <button
                        className='btn btn-sm truncate'
                        disabled={forms.length === 0}>
                        {name} ({forms.length})
                    </button>
                </Link>
            ))}
        </div>
        <Link href='/forms'>
            <button className='btn btn-primary mt-6'>
                {MESSAGES.index.showAll}
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
