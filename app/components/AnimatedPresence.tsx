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
    const [lastChildren, setLastChildren] = useState(children)

    if (!mounted && !isOpen) {
        return null
    }

    function handleAnimationEnd (event: AnimationEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget && !isOpen) {
            setMounted(false)
            setLastChildren(null)
        }
    }

    return (
        <div
            aria-hidden={!isOpen}
            inert={!isOpen}
            data-animation={animation}
            data-state={isOpen ? 'open' : 'closing'}
            className={`animated-presence ${className}`}
            onAnimationStart={() => {
                if (isOpen) {
                    setMounted(true)
                    setLastChildren(children)
                }
            }}
            onAnimationEnd={handleAnimationEnd}
        >
            {isOpen ? children : lastChildren}
        </div>
    )
}
