
export default function cabecario() {
    return (
        <header className="flex flex-col w-full h-[10dvh] 
            border 
            lg:flex-row  text-center items-center 
        "> 


            <section className="flex flex-row justify-between items-center w-full h-1/2 
                border border-preto  text-[5dvw] 
                lg:h-[100%]   border-y-transparent lg:border-l-transparent
            ">
                    <div className="flex items-center justify-around border border-preto w-[25%]  h-[90%]
                        lg:h-[60%] text-[.5em]
                    ">
                        foto
                        <h1>perfil</h1>
                    </div>

                <div className="text-[.5em]"><p>313</p></div>
                <div className="text-[.5em]"><p>13</p></div>
                <div className="text-[.5em]">cartao</div>
                <div className="text-[.5em]">baixar</div>
                <div className='mr-[5%] text-[.5em]'>menu</div>
            </section>



            <section className="w-full h-1/2 
                 font-mono text-[5dvw]
                md:text-[1.5em]
            ">
                <h1>Ezequias gabriel souza da costa</h1>
            </section>

        </header>
    )
}