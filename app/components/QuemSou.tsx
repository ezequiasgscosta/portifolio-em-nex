type QuemSouProps = {
    fatos: string[]
    imagem: string
}

export default function QuemSou ({ fatos, imagem }: QuemSouProps) {
    return (
        <section className="flex  items-center justify-center">
            <div className='quemsou md:ml-10 md:text-3xl 
            md:mr-10 md:text-3xl!'>
                {fatos.map((fato, index) => <h1 key={`${index}-${fato}`}>{fato}</h1>)}
            </div>

            <div>
                <img
                    src={imagem}
                    alt="Foto do perfil"
                    className="h-[300px] w-[200px] rounded-2xl object-cover pt-[20px] 
                    md:h-[380px] md:w-[100%] md:p-[0px]"
                    />
            </div>
        </section>
    )
}