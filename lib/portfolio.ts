export type PortfolioCategory =
  | "projetosComIa"
  | "projetosSemIa"
  | "certificados";

export type PortfolioItem = {
  id: number;
  category: PortfolioCategory;
  title: string;
  description: string;
  technologies: string;
  image_url: string | null;
  image_data: string | null;
  site_url: string | null;
  github_url: string | null;
  sort_order: number;
};

export const categoryLabels: Record<PortfolioCategory, string> = {
  projetosComIa: "Projetos com IA",
  projetosSemIa: "Projetos sem IA",
  certificados: "Certificados",
};
