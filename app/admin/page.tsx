'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '../../lib/supabase/client'
import {
  defaultPortfolioData,
  isPortfolioData,
} from '../types/portfolio'
import type {
  CertificateItem,
  ContactItem,
  PortfolioData,
  PortfolioLink,
} from '../types/portfolio'

const allowedCertificateTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
])

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

function messageFromError(error: unknown) {
  return error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
}

function hasHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function hasContactUrl(value: string) {
  try {
    const url = new URL(normalizeContactUrl(value))
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
  } catch {
    return false
  }
}

function normalizeContactUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return `mailto:${trimmed}`
  }
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed
  }
  if (/^[\w.-]+\.[a-z]{2,}(?::\d+)?(?:[/?#].*)?$/i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

function storagePathFromPublicUrl(value: string) {
  try {
    const marker = '/storage/v1/object/public/portfolio-media/'
    const pathname = new URL(value).pathname
    const markerIndex = pathname.indexOf(marker)
    if (markerIndex < 0) {
      return null
    }

    return decodeURIComponent(pathname.slice(markerIndex + marker.length))
  } catch {
    return null
  }
}

function updateItem<T extends { id: string }>(
  items: T[],
  id: string,
  changes: Partial<T>,
) {
  return items.map((item) => item.id === id ? { ...item, ...changes } : item)
}

function moveItem<T>(items: T[], index: number, offset: -1 | 1) {
  const destination = index + offset
  if (destination < 0 || destination >= items.length) {
    return items
  }

  const reordered = [...items]
  const current = reordered[index]
  reordered[index] = reordered[destination]
  reordered[destination] = current
  return reordered
}

type LinkListEditorProps = {
  title: string
  items: PortfolioLink[]
  onChange: (items: PortfolioLink[]) => void
}

function LinkListEditor({ title, items, onChange }: LinkListEditorProps) {
  return (
    <section className="space-y-4 rounded-xl border border-gray-300 bg-white p-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          type="button"
          className="w-auto rounded bg-roxo-meio px-4 py-2 text-white"
          onClick={() => onChange([
            ...items,
            { id: crypto.randomUUID(), name: '', url: '' },
          ])}
        >
          Adicionar link
        </button>
      </div>
      {items.length === 0 && <p>Nenhum link cadastrado.</p>}
      {items.map((item, index) => (
        <div key={item.id} className="grid gap-3 rounded border border-gray-200 p-3 md:grid-cols-[1fr_2fr_auto]">
          <label className="grid gap-1">
            Nome
            <input
              className="rounded border border-gray-400 p-2"
              value={item.name}
              onChange={(event) => onChange(updateItem(items, item.id, { name: event.target.value }))}
            />
          </label>
          <label className="grid gap-1">
            Link do projeto (usado no botão e no iframe)
            <input
              type="text"
              inputMode="url"
              placeholder="https://exemplo.com"
              className="rounded border border-gray-400 p-2"
              value={item.url}
              onChange={(event) => onChange(updateItem(items, item.id, { url: event.target.value }))}
            />
          </label>
          <div className="flex flex-wrap items-end gap-2">
            <button
              type="button"
              disabled={index === 0}
              aria-label={`Mover ${item.name || 'link'} para cima`}
              className="w-auto rounded border border-gray-500 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onChange(moveItem(items, index, -1))}
            >
              Subir
            </button>
            <button
              type="button"
              disabled={index === items.length - 1}
              aria-label={`Mover ${item.name || 'link'} para baixo`}
              className="w-auto rounded border border-gray-500 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => onChange(moveItem(items, index, 1))}
            >
              Descer
            </button>
            <button
              type="button"
              className="w-auto rounded border border-red-700 px-3 py-2 text-red-700"
              onClick={() => onChange(items.filter((current) => current.id !== item.id))}
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </section>
  )
}

export default function AdminPage() {
  const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof getSupabaseClient> | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolioData)
  const [savedPortfolio, setSavedPortfolio] = useState<PortfolioData>(defaultPortfolioData)
  const [authenticated, setAuthenticated] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const uploadedPaths = useRef<string[]>([])

  async function loadAdminPortfolio(
    client: ReturnType<typeof getSupabaseClient>,
    userId: string,
  ) {
    const { data: admin, error: adminError } = await client
      .from('portfolio_admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (adminError) {
      throw new Error(`Não foi possível verificar a permissão administrativa: ${adminError.message}`)
    }
    if (!admin) {
      throw new Error('Esta conta não tem permissão para administrar o portfólio.')
    }

    const { data: content, error: contentError } = await client
      .from('portfolio_content')
      .select('data')
      .eq('id', 'main')
      .maybeSingle()

    if (contentError) {
      throw new Error(`Não foi possível carregar os dados: ${contentError.message}`)
    }
    if (!content || !isPortfolioData(content.data)) {
      throw new Error('Os dados do portfólio não foram configurados corretamente no Supabase.')
    }

    setPortfolio(content.data)
    setSavedPortfolio(content.data)
    setAuthenticated(true)
  }

  useEffect(() => {
    let active = true

    async function initialize() {
      let client: ReturnType<typeof getSupabaseClient>

      try {
        client = getSupabaseClient()
        if (active) {
          setSupabaseClient(client)
        }
      } catch (error) {
        if (active) {
          setErrorMessage(messageFromError(error))
          setAuthReady(true)
        }
        return
      }

      const { data, error } = await client.auth.getSession()
      if (error) {
        if (active) {
          setErrorMessage(`Não foi possível verificar a sessão: ${error.message}`)
          setAuthReady(true)
        }
        return
      }

      if (!data.session) {
        const { data: content, error: contentError } = await client
          .from('portfolio_content')
          .select('id')
          .eq('id', 'main')
          .maybeSingle()

        if (contentError) {
          if (active) {
            setErrorMessage(`Não foi possível conectar ao portfólio no Supabase: ${contentError.message}`)
          }
        } else if (!content && active) {
          setErrorMessage('O registro do portfólio não foi encontrado. Execute a migration do Supabase.')
        }
        if (active) {
          setAuthReady(true)
        }
        return
      }

      try {
        await loadAdminPortfolio(client, data.session.user.id)
        if (!active) {
          return
        }
      } catch (error) {
        await client.auth.signOut()
        if (active) {
          setErrorMessage(messageFromError(error))
          setAuthenticated(false)
        }
      } finally {
        if (active) {
          setAuthReady(true)
        }
      }
    }

    void initialize()
    return () => {
      active = false
    }
  }, [])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabaseClient) {
      setErrorMessage('O cliente Supabase não está configurado.')
      return
    }

    setBusy(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password })
      if (error) {
        throw new Error(`Falha no login: ${error.message}`)
      }
      if (!data.user) {
        throw new Error('O Supabase não retornou o usuário autenticado.')
      }

      await loadAdminPortfolio(supabaseClient, data.user.id)
      setPassword('')
    } catch (error) {
      const signOutResult = await supabaseClient.auth.signOut()
      setAuthenticated(false)
      setErrorMessage(
        signOutResult.error
          ? `${messageFromError(error)} Também não foi possível encerrar a sessão: ${signOutResult.error.message}`
          : messageFromError(error),
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleLogout() {
    if (!supabaseClient) {
      setErrorMessage('O cliente Supabase não está configurado.')
      return
    }

    setBusy(true)
    const { error } = await supabaseClient.auth.signOut()
    setBusy(false)
    if (error) {
      setErrorMessage(`Não foi possível encerrar a sessão: ${error.message}`)
      return
    }

    setAuthenticated(false)
    setSuccessMessage(null)
  }

  async function handleCertificateFile(id: string, file: File | undefined) {
    if (!file || !supabaseClient) {
      return
    }
    if (!allowedCertificateTypes.has(file.type)) {
      setErrorMessage('Use uma imagem JPG, PNG, WebP ou GIF, ou um arquivo PDF.')
      return
    }

    setBusy(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const storagePath = `certificates/${id}/${crypto.randomUUID()}-${safeName}`

    try {
      const { error } = await supabaseClient.storage
        .from('portfolio-media')
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (error) {
        throw new Error(`Não foi possível enviar o certificado: ${error.message}`)
      }

      uploadedPaths.current.push(storagePath)
      setPortfolio((current) => ({
        ...current,
        certificates: updateItem(current.certificates, id, {
          storagePath,
          mimeType: file.type,
        }),
      }))
      setSuccessMessage('Arquivo enviado. Salve as alterações para publicá-lo no portfólio.')
    } catch (error) {
      setErrorMessage(messageFromError(error))
    } finally {
      setBusy(false)
    }
  }

  async function handlePortfolioImageFile(
    image: 'background' | 'profile',
    file: File | undefined,
  ) {
    if (!file || !supabaseClient) {
      return
    }
    if (!allowedImageTypes.has(file.type)) {
      setErrorMessage('Use uma imagem JPG, PNG, WebP ou GIF.')
      return
    }

    setBusy(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const storagePath = `${image}/${crypto.randomUUID()}-${safeName}`

    try {
      const { error } = await supabaseClient.storage
        .from('portfolio-media')
        .upload(storagePath, file, { contentType: file.type, upsert: false })

      if (error) {
        throw new Error(`Não foi possível enviar a imagem: ${error.message}`)
      }

      uploadedPaths.current.push(storagePath)
      const imageUrl = supabaseClient.storage
        .from('portfolio-media')
        .getPublicUrl(storagePath)
        .data.publicUrl

      setPortfolio((current) => image === 'background'
        ? { ...current, heroBackgroundUrl: imageUrl }
        : { ...current, bio: { ...current.bio, imageUrl } })
      setSuccessMessage('Imagem enviada. Salve as alterações para publicá-la no portfólio.')
    } catch (error) {
      setErrorMessage(messageFromError(error))
    } finally {
      setBusy(false)
    }
  }

  function validatePortfolio() {
    if (!portfolio.siteName.trim()) {
      return 'Informe o nome exibido no cabeçalho.'
    }
    if (!portfolio.heroBackgroundUrl || !portfolio.bio.imageUrl) {
      return 'Escolha uma imagem local para o fundo e para a foto do perfil.'
    }

    for (const [section, items] of [
      ['Projetos', portfolio.projects],
      ['Extensão', portfolio.extension],
    ] as const) {
      if (items.some((item) => !item.name.trim() || !hasHttpUrl(item.url))) {
        return `Preencha o nome e um link HTTP ou HTTPS válido em ${section}.`
      }
    }

    if (portfolio.contacts.some((item) => !item.label.trim() || (item.url && !hasContactUrl(item.url)))) {
      return 'Preencha os nomes dos contatos e use e-mail ou link HTTP, HTTPS, mailto ou tel.'
    }
    if (portfolio.certificates.some((item) => (
      !item.name.trim()
      || !item.storagePath
      || !allowedCertificateTypes.has(item.mimeType)
    ))) {
      return 'Cada certificado precisa de nome e arquivo de imagem ou PDF.'
    }

    return null
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabaseClient) {
      setErrorMessage('O cliente Supabase não está configurado.')
      return
    }

    const validationError = validatePortfolio()
    if (validationError) {
      setSuccessMessage(null)
      setErrorMessage(validationError)
      return
    }

    setBusy(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const nextPortfolio: PortfolioData = {
      ...portfolio,
      siteName: portfolio.siteName.trim(),
      bio: {
        ...portfolio.bio,
        facts: portfolio.bio.facts.map((fact) => fact.trim()).filter(Boolean),
        imageUrl: portfolio.bio.imageUrl.trim(),
      },
      contacts: portfolio.contacts.map((item) => ({
        ...item,
        label: item.label.trim(),
        url: normalizeContactUrl(item.url),
      })),
      projects: portfolio.projects.map((item) => ({
        ...item,
        name: item.name.trim(),
        url: item.url.trim(),
      })),
      certificates: portfolio.certificates.map((item) => ({
        ...item,
        name: item.name.trim(),
      })),
      extension: portfolio.extension.map((item) => ({
        ...item,
        name: item.name.trim(),
        url: item.url.trim(),
      })),
    }

    try {
      const { error } = await supabaseClient
        .from('portfolio_content')
        .upsert({ id: 'main', data: nextPortfolio, updated_at: new Date().toISOString() })

      if (error) {
        throw new Error(`Não foi possível salvar as alterações: ${error.message}`)
      }

      const retainedPaths = new Set([
        ...nextPortfolio.certificates.map((item) => item.storagePath),
        storagePathFromPublicUrl(nextPortfolio.heroBackgroundUrl),
        storagePathFromPublicUrl(nextPortfolio.bio.imageUrl),
      ].filter((path): path is string => Boolean(path)))
      const previouslyStoredPaths = [
        ...savedPortfolio.certificates.map((item) => item.storagePath),
        storagePathFromPublicUrl(savedPortfolio.heroBackgroundUrl),
        storagePathFromPublicUrl(savedPortfolio.bio.imageUrl),
      ]
      const removedPaths = previouslyStoredPaths
        .filter((path): path is string => path !== null && path !== '' && !retainedPaths.has(path))
      const unusedUploads = uploadedPaths.current.filter((path) => !retainedPaths.has(path))
      const pathsToRemove = [...new Set([...removedPaths, ...unusedUploads])]

      setPortfolio(nextPortfolio)
      setSavedPortfolio(nextPortfolio)
      uploadedPaths.current = []
      setSuccessMessage('Alterações salvas e publicadas.')

      if (pathsToRemove.length > 0) {
        const { error: removeError } = await supabaseClient.storage
          .from('portfolio-media')
          .remove(pathsToRemove)
        if (removeError) {
          setErrorMessage(`Os dados foram salvos, mas alguns arquivos removidos não puderam ser apagados: ${removeError.message}`)
        }
      }
    } catch (error) {
      setErrorMessage(messageFromError(error))
    } finally {
      setBusy(false)
    }
  }

  const updateContacts = (contacts: ContactItem[]) => {
    setPortfolio((current) => ({ ...current, contacts }))
  }

  const updateCertificates = (certificates: CertificateItem[]) => {
    setPortfolio((current) => ({ ...current, certificates }))
  }

  if (!authReady) {
    return <main className="p-8">Verificando acesso administrativo...</main>
  }

  return (
    <main className="min-h-screen bg-cinza-claro px-4 py-8 text-preto">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Administrar portfólio</h1>
          <Link href="/" className="rounded border border-gray-500 px-4 py-2">Voltar ao portfólio</Link>
        </header>

        {errorMessage && (
          <p role="alert" className="rounded border border-red-700 bg-red-100 p-3 text-red-900">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p role="status" className="rounded border border-green-700 bg-green-100 p-3 text-green-900">
            {successMessage}
          </p>
        )}

        {!authenticated ? (
          <form onSubmit={handleLogin} className="mx-auto grid max-w-lg gap-4 rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Acesso administrativo</h2>
            <label className="grid gap-1">
              E-mail
              <input
                type="email"
                required
                autoComplete="username"
                className="rounded border border-gray-400 p-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="grid gap-1">
              Senha
              <input
                type="password"
                required
                autoComplete="current-password"
                className="rounded border border-gray-400 p-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <button type="submit" disabled={busy} className="w-auto rounded bg-roxo-meio px-4 py-2 text-white disabled:opacity-60">
              {busy ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <>
            <div className="flex justify-end">
              <button type="button" disabled={busy} onClick={() => void handleLogout()} className="w-auto rounded border border-gray-500 px-4 py-2 disabled:opacity-60">
                Sair
              </button>
            </div>

            <form noValidate onSubmit={handleSave} className="space-y-5">
              <section className="grid gap-4 rounded-xl border border-gray-300 bg-white p-5 text-left">
                <h2 className="text-xl font-semibold">Início e Quem Sou</h2>
                <label className="grid gap-1">
                  Nome do cabeçalho
                  <input
                    className="rounded border border-gray-400 p-2"
                    value={portfolio.siteName}
                    onChange={(event) => setPortfolio((current) => ({ ...current, siteName: event.target.value }))}
                  />
                </label>
                <label className="grid gap-1">
                  Escolher imagem de fundo do computador
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={busy}
                    className="rounded border border-gray-400 p-2"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0]
                      event.currentTarget.value = ''
                      void handlePortfolioImageFile('background', file)
                    }}
                  />
                </label>
                <label className="grid gap-1">
                  Escolher foto do computador
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={busy}
                    className="rounded border border-gray-400 p-2"
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0]
                      event.currentTarget.value = ''
                      void handlePortfolioImageFile('profile', file)
                    }}
                  />
                </label>
                <label className="grid gap-1">
                  Dados de Quem Sou (um por linha)
                  <textarea
                    rows={6}
                    className="rounded border border-gray-400 p-2"
                    value={portfolio.bio.facts.join('\n')}
                    onChange={(event) => setPortfolio((current) => ({
                      ...current,
                      bio: { ...current.bio, facts: event.target.value.split('\n') },
                    }))}
                  />
                </label>
              </section>

              <section className="space-y-4 rounded-xl border border-gray-300 bg-white p-5 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Contatos</h2>
                  <button
                    type="button"
                    className="w-auto rounded bg-roxo-meio px-4 py-2 text-white"
                    onClick={() => updateContacts([
                      ...portfolio.contacts,
                      { id: crypto.randomUUID(), label: '', url: '' },
                    ])}
                  >
                    Adicionar contato
                  </button>
                </div>
                {portfolio.contacts.map((item) => (
                  <div key={item.id} className="grid gap-3 rounded border border-gray-200 p-3 md:grid-cols-[1fr_2fr_auto]">
                    <label className="grid gap-1">
                      Nome
                      <input
                        className="rounded border border-gray-400 p-2"
                        value={item.label}
                        onChange={(event) => updateContacts(updateItem(portfolio.contacts, item.id, { label: event.target.value }))}
                      />
                    </label>
                    <label className="grid gap-1">
                      Link (HTTP, HTTPS, mailto ou tel)
                      <input
                        className="rounded border border-gray-400 p-2"
                        value={item.url}
                        onChange={(event) => updateContacts(updateItem(portfolio.contacts, item.id, { url: event.target.value }))}
                      />
                    </label>
                    <button
                      type="button"
                      className="w-auto self-end rounded border border-red-700 px-3 py-2 text-red-700"
                      onClick={() => updateContacts(portfolio.contacts.filter((contact) => contact.id !== item.id))}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </section>

              <LinkListEditor
                title="Projetos"
                items={portfolio.projects}
                onChange={(projects) => setPortfolio((current) => ({ ...current, projects }))}
              />
              <LinkListEditor
                title="Extensão"
                items={portfolio.extension}
                onChange={(extension) => setPortfolio((current) => ({ ...current, extension }))}
              />

              <section className="space-y-4 rounded-xl border border-gray-300 bg-white p-5 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">Certificados</h2>
                  <button
                    type="button"
                    className="w-auto rounded bg-roxo-meio px-4 py-2 text-white"
                    onClick={() => updateCertificates([
                      ...portfolio.certificates,
                      { id: crypto.randomUUID(), name: '', storagePath: '', mimeType: '' },
                    ])}
                  >
                    Adicionar certificado
                  </button>
                </div>
                {portfolio.certificates.length === 0 && <p>Nenhum certificado cadastrado.</p>}
                {portfolio.certificates.map((item, index) => {
                  const previewUrl = item.storagePath && supabaseClient
                    ? supabaseClient.storage.from('portfolio-media').getPublicUrl(item.storagePath).data.publicUrl
                    : ''

                  return (
                    <div key={item.id} className="grid gap-3 rounded border border-gray-200 p-3 md:grid-cols-[1fr_2fr_auto]">
                      <label className="grid gap-1">
                        Nome
                        <input
                          className="rounded border border-gray-400 p-2"
                          value={item.name}
                          onChange={(event) => updateCertificates(updateItem(portfolio.certificates, item.id, { name: event.target.value }))}
                        />
                      </label>
                      <label className="grid gap-1">
                        Arquivo (imagem ou PDF)
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                          disabled={busy}
                          className="rounded border border-gray-400 p-2"
                          onChange={(event) => {
                            const file = event.currentTarget.files?.[0]
                            event.currentTarget.value = ''
                            void handleCertificateFile(item.id, file)
                          }}
                        />
                        {item.storagePath && (
                          <a href={previewUrl} target="_blank" rel="noreferrer" className="text-blue-800 underline">
                            Abrir arquivo atual
                          </a>
                        )}
                      </label>
                      <div className="flex flex-wrap items-end gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          aria-label={`Mover ${item.name || 'certificado'} para cima`}
                          className="w-auto rounded border border-gray-500 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateCertificates(moveItem(portfolio.certificates, index, -1))}
                        >
                          Subir
                        </button>
                        <button
                          type="button"
                          disabled={index === portfolio.certificates.length - 1}
                          aria-label={`Mover ${item.name || 'certificado'} para baixo`}
                          className="w-auto rounded border border-gray-500 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => updateCertificates(moveItem(portfolio.certificates, index, 1))}
                        >
                          Descer
                        </button>
                        <button
                          type="button"
                          className="w-auto rounded border border-red-700 px-3 py-2 text-red-700"
                          onClick={() => updateCertificates(portfolio.certificates.filter((certificate) => certificate.id !== item.id))}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  )
                })}
              </section>

              <button type="submit" disabled={busy} className="w-auto rounded bg-roxo-meio px-6 py-3 text-white disabled:opacity-60">
                {busy ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
