import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
    children: React.ReactNode
    selector: string
}

export default function Modal({ children, selector }: ModalProps) {
    const ref = useRef(document.querySelector(selector))
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [selector])

    return mounted && ref.current ? createPortal(children, ref.current) : null
}
