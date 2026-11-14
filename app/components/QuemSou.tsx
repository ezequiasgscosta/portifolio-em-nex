type QuemSouProps = {
    fatos: string[]
    imagem: string
}

export default function QuemSou ({ fatos, imagem }: QuemSouProps) {
    return (
        <section className="flex  items-center justify-center">
            <div className='quemsou'>
                {fatos.map((fato, index) => <h1 key={`${index}-${fato}`}>{fato}</h1>)}
            </div>

            <div>
                <img
                    src={imagem}
                    alt="Foto do perfil"
                    className="h-[300px] w-[200px] rounded-2xl object-cover pt-[20px]"
                    />
            </div>
        </section>
    )
}