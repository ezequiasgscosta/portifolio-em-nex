'use client'

import type { ContactItem } from '../types/portfolio'

type ContatosProps = {
    onClose: () => void
    items: ContactItem[]
}

export default function Contatos ({ onClose, items }: ContatosProps) {
    
    return (
        <menu className="menu-botoes fixed top-1/3 left-1/2 z-50 grid w-[80vw] -translate-x-1/2 grid-cols-1 gap-6
                                            md:w-[50vw] md:gap-6 md:top-1/4 lg:gap-6 lg:top-1/4">
            <button type="button" className="botao-voltar" onClick={onClose}>Voltar</button>
            {items.map((item) => item.url ? (
                <a
                    key={item.id}
                    href={item.url}
                    target={/^https?:\/\//i.test(item.url) ? '_blank' : undefined}
                    rel={/^https?:\/\//i.test(item.url) ? 'noreferrer' : undefined}
                    className="w-full rounded-2xl bg-bg-cinza p-4 text-2xl text-branco transition-colors hover:bg-roxo-meio"
                >
                    {item.label}
                </a>
            ) : (
                <button key={item.id} type="button" disabled>
                    {item.label}
                </button>
            ))}
        </menu>
    )
}