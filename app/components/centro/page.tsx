'use client'

import MenuEsquerdo from "../menuEsquerdo/page";
import MenuDireita from "../menudireita/page";
import Image from 'next/image'
import perfilGrande from '@/public/perfilGrande.png'
import type { PopupId } from "@/app/types/popup";

type CentroProps = {
    onOpenPopup: (popupId: PopupId) => void;
};

export default function Centro({ onOpenPopup }: CentroProps) {
    return (
        <section className=" flex flex-row w-ful h-[60dvh] justify-between">
            <MenuEsquerdo onOpenPopup={onOpenPopup} />
            <div><Image
            src={perfilGrande}
            alt="Perfil"
            className="w-[100%] h-auto mt-[5%]"
            />
            </div>
            <MenuDireita />
        </section>
    );
}