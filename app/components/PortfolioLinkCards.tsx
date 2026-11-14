
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
          className="mt-3 min-h-[250px] w-[90%] rounded-2xl bg-sub-bg p-3 
          md:min-h-[400px] md:text-2xl lg:min-h-[420px] xl:min-h-[450px]"
        >
          <div className="grid grid-cols-2 items-center">
            <h2 className="py-2 font-open-sans">{item.name}</h2>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mx-auto w-[100px] rounded border font-belleza hover:border-black hover:bg-roxo-escuro hover:text-branco
              md:w-[150px] md:text-2xl"
            >
              Ver projeto
            </a>
          </div>

          <div className="flex min-h-[210px] flex-row items-center justify-around gap-4 md:min-h-[500px]">

            <div className="relative h-[260px] w-[140px] shrink-0 overflow-hidden rounded-sm border md:h-[460px] md:w-[230px]">
              <iframe
                src={item.url}
                title={`Prévia mobile: ${item.name}`}
                className="absolute left-0 top-0 border-0"
                style={{
                  width: '430px',
                  height: '900px',
                  transform: 'scale(0.53)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}
              />
            </div>

           
            <div className="relative h-[180px] w-[180px] overflow-hidden border sm:h-[220px] sm:w-[300px] md:h-[300px] md:w-[500px] lg:h-[350px] lg:w-[650px] xl:h-[400px] xl:w-[750px]">
              <iframe
                src={item.url}
                title={`Prévia desktop: ${item.name}`}
                className="absolute left-0 top-0 border-0"
                style={{
                  width: '1440px',
                  height: '900px',
                  transform: 'scale(0.52)',
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
