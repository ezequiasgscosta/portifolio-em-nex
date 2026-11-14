'use client'
import { useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import Cabecario from './components/Cabecario'
import Menu from './components/Menu'
import QuemSou from './components/QuemSou'
import AnimatedPresence from './components/AnimatedPresence'
import Projetos from './components/Projetos'
import Contatos  from './components/Contatos'
import Certificados from './components/Certificados'
import Extensao from './components/Extensao'
import { defaultPortfolioData, isPortfolioData } from './types/portfolio'
import type { PortfolioData } from './types/portfolio'
import { getSupabaseClient } from '../lib/supabase/client'

export default function HOME () {
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolioData)
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [pagina, setPagina] = useState<'inicio' | 'quem-sou'>('inicio')
  const [contatosAbertos, setContatosAbertos] = useState(false)
  const [popupAberto, setPopupAberto] = useState<'projetos' | 'certificados' | 'extensao' | null>(null)

  useEffect(() => {
    let active = true

    async function loadPortfolio() {
      try {
        const client = getSupabaseClient()
        if (active) {
          setSupabaseClient(client)
        }

        const { data, error } = await client
          .from('portfolio_content')
          .select('data')
          .eq('id', 'main')
          .maybeSingle()

        if (error) {
          throw new Error(`Não foi possível carregar os dados do portfólio: ${error.message}`)
        }
        if (!data || !isPortfolioData(data.data)) {
          throw new Error('Os dados do portfólio não foram configurados corretamente no Supabase.')
        }

        if (active) {
          setPortfolio(data.data)
          setPortfolioError(null)
        }
      } catch (error) {
        if (active) {
          setPortfolioError(
            error instanceof Error ? error.message : 'Erro inesperado ao carregar o portfólio.',
          )
        }
      }
    }

    void loadPortfolio()
    return () => {
      active = false
    }
  }, [])

  const certificados = portfolio.certificates.map((certificate) => ({
    ...certificate,
    url: certificate.storagePath && supabaseClient
      ? supabaseClient.storage.from('portfolio-media').getPublicUrl(certificate.storagePath).data.publicUrl
      : '',
  }))

  return (
    <main className="text-center">
      {portfolioError && (
        <p role="alert" className="mx-auto mt-3 max-w-3xl rounded bg-red-100 p-3 text-red-900">
          {portfolioError} O conteúdo inicial está sendo exibido até a configuração ser corrigida.
        </p>
      )}
      <Cabecario nome={portfolio.siteName}/>
      <section
        className="h-[80dvh] flex items-center justify-center bg-[size:100%] bg-top bg-no-repeat"
        style={{
          backgroundImage: pagina === 'inicio'
            ? `url(${JSON.stringify(portfolio.heroBackgroundUrl)})`
            : 'none',
        }}
      >
        <AnimatedPresence
          isOpen={pagina === 'quem-sou'}
          animation="panel"
          className="flex h-full w-full items-center justify-center"
        >
          <QuemSou fatos={portfolio.bio.facts} imagem={portfolio.bio.imageUrl}/>
        </AnimatedPresence>
      </section>

      <AnimatedPresence
        isOpen={menuAberto}
        animation="panel"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <Menu
          onClose={() => {
            setMenuAberto(false)
            setPagina('inicio')
          }}
          onQuemSou={() => {
            setPagina('quem-sou')
            setMenuAberto(false)
          }}
          onProjetos={() => {
            setPagina('inicio')
            setPopupAberto('projetos')
            setMenuAberto(false)
          }}
          onContatos={() => {
            setPagina('inicio')
            setContatosAbertos(true)
            setMenuAberto(false)
          }}
          onCertificados={() => {
            setPagina('inicio')
            setPopupAberto('certificados')
            setMenuAberto(false)
          }}
          onExtensao={() => {
            setPagina('inicio')
            setPopupAberto('extensao')
            setMenuAberto(false)
          }}
        />
      </AnimatedPresence>
      <AnimatedPresence
        isOpen={contatosAbertos}
        animation="panel"
        className="pointer-events-none fixed inset-0 z-50"
      >
        <Contatos
          items={portfolio.contacts}
          onClose={() => {
            setContatosAbertos(false)
            setMenuAberto(true)
          }}
        />
      </AnimatedPresence>
      <AnimatedPresence
        isOpen={popupAberto !== null}
        animation="overlay"
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      >
        {popupAberto === 'projetos' ? (
          <Projetos items={portfolio.projects} onClose={() => setPopupAberto(null)} />
        ) : popupAberto === 'certificados' ? (
          <Certificados items={certificados} onClose={() => setPopupAberto(null)} />
        ) : popupAberto === 'extensao' ? (
          <Extensao items={portfolio.extension} onClose={() => setPopupAberto(null)} />
        ) : null}
      </AnimatedPresence>
      {!contatosAbertos && !popupAberto && (
        <button
          type="button"
          aria-expanded={menuAberto}
          aria-controls="menu-opcoes"
          aria-haspopup="menu"
          onClick={() => {
            if (pagina === 'quem-sou') {
              setPagina('inicio')
              setMenuAberto(false)
              return
            }
            setMenuAberto((aberto) => !aberto)
          }}
        >
          OPÇÕES
        </button>
      )}
    </main>
  )

}