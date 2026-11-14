'use client'

import { useState, type AnimationEvent, type ReactNode } from 'react'

type AnimatedPresenceProps = {
    isOpen: boolean
    animation: 'panel' | 'overlay'
    className?: string
    children: ReactNode
}

export default function AnimatedPresence ({
    isOpen,
    animation,
    className = '',
    children,
}: AnimatedPresenceProps) {
    const [mounted, setMounted] = useState(isOpen)

    if (!mounted) {
        if (!isOpen) {
            return null
        }
    }

    function handleAnimationEnd (event: AnimationEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget && !isOpen) {
            setMounted(false)
        }
    }

    return (
        <div
            aria-hidden={!isOpen}
            inert={!isOpen}
            data-animation={animation}
            data-state={isOpen ? 'open' : 'closing'}
            className={`animated-presence ${className}`}
            onAnimationStart={() => setMounted(true)}
            onAnimationEnd={handleAnimationEnd}
        >
            {children}
        </div>
    )
}
