import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const cronSecret = process.env.CRON_SECRET;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Variáveis do Supabase ausentes." },
      { status: 500 },
    );
  }

  if (
    cronSecret &&
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    cache: "no-store",
  });

  return NextResponse.json(
    { ok: response.ok, status: response.status },
    { status: response.ok ? 200 : 503 },
  );
}