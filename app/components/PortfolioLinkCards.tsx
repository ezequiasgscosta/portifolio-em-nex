import type { PortfolioLink } from '../types/portfolio'

type PortfolioLinkCardsProps = {
  items: PortfolioLink[]
}

export default function PortfolioLinkCards({ items }: PortfolioLinkCardsProps) {
  if (items.length === 0) {
    return <p className="mt-8 text-branco">Nenhum link cadastrado.</p>
  }

  return (
    <div className="flex w-full flex-col items-center">
      {items.map((item) => (
        <article
          key={item.id}
          className="mt-3 min-h-[250px] w-[90%] rounded-2xl bg-sub-bg p-3"
        >
          <div className="grid grid-cols-2 items-center">
            <h2 className="py-2 font-open-sans">{item.name}</h2>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mx-auto w-[100px] rounded border font-belleza hover:border-black hover:bg-roxo-escuro hover:text-branco"
            >
              Ver projeto
            </a>
          </div>

          <div className="flex min-h-[210px] flex-row items-center justify-around">
            <div className="relative flex h-[180px] w-[98px] justify-center overflow-hidden rounded-sm border">
              <iframe
                src={item.url}
                title={`Prévia mobile: ${item.name}`}
                className="absolute left-0 top-0 border-0"
                style={{
                  width: '500px',
                  height: '900px',
                  transform: 'scale(0.2)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <div className="relative h-[100px] w-[180px] overflow-hidden border">
              <iframe
                src={item.url}
                title={`Prévia desktop: ${item.name}`}
                className="absolute left-0 top-0 border-0"
                style={{
                  width: '900px',
                  height: '500px',
                  transform: 'scale(0.2)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
