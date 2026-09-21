'use client'

import type { PopupId } from "@/app/types/popup";

type MenuEsquerdoProps = {
    onOpenPopup: (popupId: PopupId) => void;
};

export default function MenuEsquerdo({ onOpenPopup }: MenuEsquerdoProps) {

    return (
        <menu className="border-b border-r h-[80%] w-[30%] min-w-[160px] max-w-[350px] flex flex-col items-left justify-around
            lg:h-[95%]
        ">
            <div><button className="border w-[150px] h-13 rounded-r-xl lg:w-[300px] h-16" onClick={() => onOpenPopup("projetosSemIa")}>
                Projetos sem IA
                </button></div>

            <div><button className="border w-[150px] h-13 rounded-r-xl lg:w-[300px] h-16" onClick={() => onOpenPopup("projetosComIa")}>Projetos Com IA</button></div>
            <div><button className="border w-[150px] h-13 rounded-r-xl lg:w-[300px] h-16" onClick={() => onOpenPopup("contratar")}>Contratar</button></div>
            <div><button className="border w-[150px] h-13 rounded-r-xl lg:w-[300px] h-16" onClick={() => onOpenPopup("certificados")}>Certificados</button></div>
            <div><button className="border w-[150px] h-13 rounded-r-xl lg:w-[300px] h-16" onClick={() => onOpenPopup("missao")}>Missão</button></div>
        </menu>
    )
}