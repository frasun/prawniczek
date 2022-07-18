import { useRef, useEffect, useState, MutableRefObject } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    children: React.ReactNode
    selector: string
}

export default function Modal({ children, selector }: ModalProps) {
    const ref: MutableRefObject<Element | DocumentFragment | null> =
        useRef(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        ref.current = document.querySelector(selector)
        setMounted(true)
    }, [selector])

    return mounted && ref.current ? createPortal(children, ref.current) : null
}
