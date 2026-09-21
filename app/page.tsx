'use client'
import { useEffect, useState } from "react"
import Rodape from "@/app/components/rodape/page";
import Centro from "./components/centro/page";
import Cabecario from "./components/cabecario/page"
import ProjetosSemIa from "./(pages)/projetosSemIa/page";
import ProjetosComIa from "./(pages)/projetosComIa/page";
import type { PopupId } from "./types/popup";

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

function InformativePopup({ popupId }: { popupId: PopupId }) {
  const content: Record<Exclude<PopupId, "projetosSemIa" | "projetosComIa">, string> = {
    contratar: "Entre em contato para conversarmos sobre seu projeto e encontrarmos a melhor solução.",
    certificados: "Certificados e formações profissionais serão apresentados aqui.",
    missao: "Criar experiências digitais úteis, acessíveis e alinhadas aos objetivos de cada projeto.",
    softSkills: "Comunicação, organização, colaboração, pensamento crítico e capacidade de resolver problemas.",
    hardSkills: "HTML, CSS, JavaScript, TypeScript, React, Next.js e integração com APIs.",
    hobbies: "Aprender novas tecnologias, criar projetos pessoais e explorar ideias criativas.",
    lazer: "Música, filmes, jogos e momentos tranquilos para recarregar as energias.",
  };

  return (
    <section className="mx-auto my-6 max-w-3xl space-y-4 p-8 text-center">
      <h1 className="text-2xl font-bold">{popupTitles[popupId]}</h1>
      <p className="text-lg leading-relaxed">{content[popupId as Exclude<PopupId, "projetosSemIa" | "projetosComIa">]}</p>
    </section>
  );
}

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

  const renderPopupContent = () => {
    if (openPopup === "projetosSemIa") {
      return <ProjetosSemIa />;
    }

    if (openPopup === "projetosComIa") {
      return <ProjetosComIa />;
    }

    return openPopup ? <InformativePopup popupId={openPopup} /> : null;
  };

  return (
    <main >
      <Cabecario/>
      <Centro onOpenPopup={setOpenPopup} />
      <Rodape onOpenPopup={setOpenPopup} />
      {openPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpenPopup(null);
            }
          }}
        >
          <div
            className="relative max-h-[90dvh] w-full max-w-5xl overflow-auto bg-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 border bg-white px-3 py-1 text-xl"
              aria-label={`Fechar ${popupTitles[openPopup]}`}
              onClick={() => setOpenPopup(null)}
            >
              ×
            </button>
            <div id="popup-title">
              {renderPopupContent()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
