export type ContactItem = {
  id: string
  label: string
  url: string
}

export type PortfolioLink = {
  id: string
  name: string
  url: string
}

export type CertificateItem = {
  id: string
  name: string
  storagePath: string
  mimeType: string
}

export type PortfolioData = {
  siteName: string
  heroBackgroundUrl: string
  bio: {
    facts: string[]
    imageUrl: string
  }
  contacts: ContactItem[]
  projects: PortfolioLink[]
  certificates: CertificateItem[]
  extension: PortfolioLink[]
}

export const defaultPortfolioData: PortfolioData = {
  siteName: 'Ezequias Gs Costa',
  heroBackgroundUrl: '/eren.png',
  bio: {
    facts: ['27 Anos', 'Casado', 'Casa Propria', 'Veiculo', 'Musico', 'Gamer'],
    imageUrl: '/eren.png',
  },
  contacts: [
    { id: 'email', label: 'EMAIL', url: '' },
    { id: 'github', label: 'GITHUB', url: '' },
    { id: 'whatsapp', label: 'WHATSAPP', url: '' },
    { id: 'linkedin', label: 'LINKEDIN', url: '' },
    { id: 'instagram', label: 'INSTAGRAM', url: '' },
  ],
  projects: [
    {
      id: 'projeto-inicial',
      name: 'Projeto 1',
      url: 'https://cantinhodavih.vercel.app/',
    },
  ],
  certificates: [],
  extension: [
    {
      id: 'extensao-inicial',
      name: 'Projeto 1',
      url: 'https://cantinhodavih.vercel.app/',
    },
  ],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isContactItem(value: unknown): value is ContactItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.label === 'string'
    && typeof value.url === 'string'
}

function isPortfolioLink(value: unknown): value is PortfolioLink {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.url === 'string'
}

function isCertificateItem(value: unknown): value is CertificateItem {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.storagePath === 'string'
    && typeof value.mimeType === 'string'
}

export function isPortfolioData(value: unknown): value is PortfolioData {
  if (!isRecord(value) || !isRecord(value.bio)) {
    return false
  }

  return typeof value.siteName === 'string'
    && typeof value.heroBackgroundUrl === 'string'
    && Array.isArray(value.bio.facts)
    && value.bio.facts.every((fact) => typeof fact === 'string')
    && typeof value.bio.imageUrl === 'string'
    && Array.isArray(value.contacts)
    && value.contacts.every(isContactItem)
    && Array.isArray(value.projects)
    && value.projects.every(isPortfolioLink)
    && Array.isArray(value.certificates)
    && value.certificates.every(isCertificateItem)
    && Array.isArray(value.extension)
    && value.extension.every(isPortfolioLink)
}
