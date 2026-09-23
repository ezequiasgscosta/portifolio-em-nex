"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { PortfolioCategory, PortfolioItem } from "@/lib/portfolio";

type PortfolioListProps = {
  category: PortfolioCategory;
  emptyMessage?: string;
};

export default function PortfolioList({ category, emptyMessage = "Nenhum item cadastrado ainda." }: PortfolioListProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadItems() {
      const { data, error: queryError } = await supabase
        .from("portfolio_items")
        .select("id, category, title, description, technologies, image_url, image_data, site_url, github_url, sort_order")
        .eq("category", category)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!active) return;
      if (queryError) setError("Não foi possível carregar os itens agora.");
      else setItems((data ?? []) as PortfolioItem[]);
      setLoading(false);
    }

    void loadItems();
    return () => {
      active = false;
    };
  }, [category]);

  if (loading) return <p className="p-8 text-center">Carregando...</p>;
  if (error) return <p className="p-8 text-center text-red-700">{error}</p>;
  if (items.length === 0) return <p className="p-8 text-center">{emptyMessage}</p>;

  return (
    <div className="flex-1 w-full space-y-4 overflow-y-auto px-4 pb-4">
      {items.map((item) => {
        const imageSource = item.image_data || item.image_url;
        return (
          <article key={item.id} className="flex flex-col gap-2 border-y py-4 text-left">
            <h2 className="text-xl font-bold">{item.title}</h2>
            {item.technologies && <p className="font-semibold">{item.technologies}</p>}
            {item.description && <p>{item.description}</p>}
            {imageSource && (
              <img src={imageSource} alt={item.title} className="max-h-96 w-full object-contain" />
            )}
            <div className="flex flex-wrap gap-2">
              {item.site_url && <a className="border px-3 py-1" href={item.site_url} target="_blank" rel="noreferrer">Ver site</a>}
              {item.github_url && <a className="border px-3 py-1" href={item.github_url} target="_blank" rel="noreferrer">Ver GitHub</a>}
            </div>
          </article>
        );
      })}
    </div>
  );
}
