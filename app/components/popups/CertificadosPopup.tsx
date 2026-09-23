import PortfolioList from "@/app/components/portfolio/PortfolioList";

export default function CertificadosPopup() {
  return (
    <section className="mx-auto flex max-h-[80dvh] max-w-3xl flex-col space-y-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Certificados</h1>
      <PortfolioList category="certificados" emptyMessage="Nenhum certificado cadastrado ainda." />
    </section>
  );
}
