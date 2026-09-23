import PortfolioList from "@/app/components/portfolio/PortfolioList";

export default function ProjetosComIa() {
  return (
    <section className="mx-auto my-6 flex h-[80dvh] w-[60dvw] flex-col border text-center">
      <h1 className="p-4 text-xl font-bold">Projetos com IA</h1>
      <PortfolioList category="projetosComIa" />
    </section>
  );
}
