'use client'
import { useEffect, useState } from "react"
import Rodape from "@/app/components/rodape/page";
import Centro from "./components/centro/page";
import Cabecario from "./components/cabecario/page"
import ProjetosSemIa from "./(pages)/projetosSemIa/page";
import ProjetosComIa from "./(pages)/projetosComIa/page";
import type { PopupId } from "./types/popup";
import type { ComponentType } from "react";
import PopupModal from "./components/popups/PopupModal";
import ContratarPopup from "./components/popups/ContratarPopup";
import CertificadosPopup from "./components/popups/CertificadosPopup";
import MissaoPopup from "./components/popups/MissaoPopup";
import SoftSkillsPopup from "./components/popups/SoftSkillsPopup";
import HardSkillsPopup from "./components/popups/HardSkillsPopup";
import HobbiesPopup from "./components/popups/HobbiesPopup";
import LazerPopup from "./components/popups/LazerPopup";

const popupComponents: Record<PopupId, ComponentType> = {
  projetosSemIa: ProjetosSemIa,
  projetosComIa: ProjetosComIa,
  contratar: ContratarPopup,
  certificados: CertificadosPopup,
  missao: MissaoPopup,
  softSkills: SoftSkillsPopup,
  hardSkills: HardSkillsPopup,
  hobbies: HobbiesPopup,
  lazer: LazerPopup,
};

const popupTitles: Record<PopupId, string> = {
  projetosSemIa: "Projetos sem IA",
  projetosComIa: "Projetos com IA",
  contratar: "Contratar",
  certificados: "Certificados",
  missao: "Missão",
  softSkills: "Soft skills",
  hardSkills: "Hard skills",
  hobbies: "Hobbies",
  lazer: "Lazer",
};

export default function Home() {
  const [openPopup, setOpenPopup] = useState<PopupId | null>(null);

  useEffect(() => {
    if (!openPopup) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPopup(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [openPopup]);

  return (
    <main>
      <Cabecario/>
      <Centro onOpenPopup={setOpenPopup} />
      <Rodape onOpenPopup={setOpenPopup} />
      {openPopup && (
        <PopupModal title={popupTitles[openPopup]} onClose={() => setOpenPopup(null)}>
          {(() => {
            const Popup = popupComponents[openPopup];
            return <Popup />;
          })()}
        </PopupModal>
      )}
    </main>
  );
}
