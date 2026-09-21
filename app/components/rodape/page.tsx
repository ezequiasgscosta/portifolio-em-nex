"use client"

import type { PopupId } from "@/app/types/popup";

type RodapeProps = {
    onOpenPopup: (popupId: PopupId) => void;
};

export default function Rodape({ onOpenPopup }: RodapeProps) {
    return (
        <footer className="w-full h-[150px] border fixed bottom-0 inset-x-0
            flex flex-col justify-around items-center
            lg:h-[20dvh]
        ">
            <section className="w-[90%] h-1/4 border-2 rounded-md 
                flex flex-row justify-around items-center
            ">
                <div><button onClick={() => onOpenPopup("softSkills")}>soft skils |</button></div>

                <div><button onClick={() => onOpenPopup("hardSkills")}>Hard skils |</button></div>

                <div><button onClick={() => onOpenPopup("hobbies")}>Hobies |</button></div>

                <div><button onClick={() => onOpenPopup("lazer")}>Lazer |</button></div>
            </section>

            <section className="w-[90%] h-2/4 border rounded-lg text-2xl 
             flex items-center justify-center">
                <button className="">Contatar</button>
            </section>

        </footer>


    )
}