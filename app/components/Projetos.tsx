'use client'

import PortfolioLinkCards from './PortfolioLinkCards'
import type { PortfolioLink } from '../types/portfolio'

type ProjetosProps = {
    onClose: () => void
    items: PortfolioLink[]
}

export default function Projetos ({ onClose, items }: ProjetosProps){
    return (
        <section role="dialog" aria-modal="true" aria-label="Projetos" className="relative border w-[90vw] h-[86vh] bg-bg-cinza
        rounded-2xl flex flex-col items-center overflow-y-auto
        ">
            <PortfolioLinkCards items={items} />

            <button type="button" onClick={onClose} className="sticky mt-auto bottom-2 w-auto bg-sub-bg! border border-black
            md:w-[30vw]">VOLTAR</button>

        </section>
    )
}