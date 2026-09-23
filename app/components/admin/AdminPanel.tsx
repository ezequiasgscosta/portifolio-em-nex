"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { categoryLabels, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolio";

type FormState = {
  category: PortfolioCategory;
  title: string;
  description: string;
  technologies: string;
  image_url: string;
  image_data: string;
  site_url: string;
  github_url: string;
  sort_order: string;
};

const emptyForm: FormState = {
  category: "projetosComIa",
  title: "",
  description: "",
  technologies: "",
  image_url: "",
  image_data: "",
  site_url: "",
  github_url: "",
  sort_order: "0",
};

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    const { data, error: queryError } = await supabase
      .from("portfolio_items")
      .select("id, category, title, description, technologies, image_url, image_data, site_url, github_url, sort_order")
      .order("category")
      .order("sort_order", { ascending: true });
    if (queryError) setError(queryError.message);
    else setItems((data ?? []) as PortfolioItem[]);
  }

  useEffect(() => {
    async function loadSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
      if (admin) {
        setUserEmail(user.email ?? null);
        await loadItems();
      } else {
        await supabase.auth.signOut();
        setError("Este usuário não está autorizado a acessar o gerenciador.");
      }
      setLoading(false);
    }
    void loadSession();
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError || !data.user) {
      setError(loginError?.message || "Não foi possível entrar.");
      return;
    }
    const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
    if (!admin) {
      await supabase.auth.signOut();
      setError("Este usuário não está autorizado a acessar o gerenciador.");
      return;
    }
    setUserEmail(data.user.email ?? null);
    await loadItems();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUserEmail(null);
    setItems([]);
    setForm(emptyForm);
    setEditingId(null);
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("A imagem local deve ter no máximo 2 MB.");
      return;
    }
    try {
      updateField("image_data", await readImage(file));
      updateField("image_url", "");
      setError("");
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : "Erro ao ler a imagem.");
    }
  }

  function editItem(item: PortfolioItem) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      title: item.title,
      description: item.description,
      technologies: item.technologies,
      image_url: item.image_url ?? "",
      image_data: item.image_data ?? "",
      site_url: item.site_url ?? "",
      github_url: item.github_url ?? "",
      sort_order: String(item.sort_order),
    });
    setMessage("");
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sua sessão expirou. Entre novamente.");
      return;
    }
    const payload = {
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: form.technologies.trim(),
      image_url: form.image_data ? null : (form.image_url.trim() || null),
      image_data: form.image_data || null,
      site_url: form.site_url.trim() || null,
      github_url: form.github_url.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      ...(editingId === null ? { created_by: user.id } : {}),
    };
    if (!payload.title) {
      setError("Informe um título.");
      return;
    }
    const result = editingId === null
      ? await supabase.from("portfolio_items").insert(payload)
      : await supabase.from("portfolio_items").update(payload).eq("id", editingId);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    setMessage(editingId === null ? "Item adicionado." : "Item atualizado.");
    resetForm();
    await loadItems();
  }

  async function deleteItem(id: number) {
    if (!window.confirm("Excluir este item?")) return;
    const { error: deleteError } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (deleteError) setError(deleteError.message);
    else {
      setMessage("Item excluído.");
      await loadItems();
    }
  }

  if (loading) return <p className="p-8 text-center">Verificando acesso...</p>;
  if (!userEmail) {
    return (
      <section className="mx-auto max-w-md space-y-5 p-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-500">Área restrita</p>
          <h1 className="text-2xl font-bold">Gerenciador do site</h1>
          <p className="mt-2 text-gray-600">Entre com uma conta previamente autorizada.</p>
        </div>
        <form className="space-y-3" onSubmit={handleLogin}>
          <label className="block">E-mail<input className="mt-1 w-full border p-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label className="block">Senha<input className="mt-1 w-full border p-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="border px-4 py-2" type="submit">Entrar</button>
        </form>
        {error && <p className="text-red-700" role="alert">{error}</p>}
      </section>
    );
  }

  return (
    <section className="space-y-6 p-6 text-left">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <div><p className="text-sm text-gray-500">Autorizado: {userEmail}</p><h1 className="text-2xl font-bold">Gerenciador do site</h1></div>
        <button className="border px-3 py-2" type="button" onClick={handleLogout}>Sair</button>
      </header>
      <form className="grid gap-3 border p-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold md:col-span-2">{editingId === null ? "Adicionar item" : "Editar item"}</h2>
        <label>Categoria<select className="mt-1 w-full border p-2" value={form.category} onChange={(event) => updateField("category", event.target.value as PortfolioCategory)}>{Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Título<input className="mt-1 w-full border p-2" value={form.title} onChange={(event) => updateField("title", event.target.value)} required /></label>
        <label className="md:col-span-2">Descrição<textarea className="mt-1 w-full border p-2" value={form.description} onChange={(event) => updateField("description", event.target.value)} rows={3} /></label>
        <label>Tecnologias<input className="mt-1 w-full border p-2" placeholder="React, Next.js" value={form.technologies} onChange={(event) => updateField("technologies", event.target.value)} /></label>
        <label>Ordem<input className="mt-1 w-full border p-2" type="number" value={form.sort_order} onChange={(event) => updateField("sort_order", event.target.value)} /></label>
        <label>Imagem por link<input className="mt-1 w-full border p-2" type="url" value={form.image_url} onChange={(event) => updateField("image_url", event.target.value)} /></label>
        <label>Ou imagem local<input className="mt-1 w-full border p-2" type="file" accept="image/*" onChange={handleImage} /></label>
        <label>Link do site<input className="mt-1 w-full border p-2" type="url" value={form.site_url} onChange={(event) => updateField("site_url", event.target.value)} /></label>
        <label>Link do GitHub<input className="mt-1 w-full border p-2" type="url" value={form.github_url} onChange={(event) => updateField("github_url", event.target.value)} /></label>
        <div className="flex gap-2 md:col-span-2"><button className="border bg-black px-4 py-2 text-white" type="submit">{editingId === null ? "Adicionar" : "Salvar alterações"}</button>{editingId !== null && <button className="border px-4 py-2" type="button" onClick={resetForm}>Cancelar</button>}</div>
      </form>
      {message && <p className="text-green-700" role="status">{message}</p>}
      {error && <p className="text-red-700" role="alert">{error}</p>}
      <div className="space-y-3"><h2 className="text-xl font-bold">Itens cadastrados</h2>{items.length === 0 ? <p>Nenhum item cadastrado.</p> : items.map((item) => <article className="flex flex-wrap items-center justify-between gap-3 border p-3" key={item.id}><div><p className="text-sm text-gray-500">{categoryLabels[item.category]}</p><h3 className="font-bold">{item.title}</h3></div><div className="flex gap-2"><button className="border px-3 py-1" type="button" onClick={() => editItem(item)}>Editar</button><button className="border px-3 py-1 text-red-700" type="button" onClick={() => void deleteItem(item.id)}>Excluir</button></div></article>)}</div>
    </section>
  );
}
