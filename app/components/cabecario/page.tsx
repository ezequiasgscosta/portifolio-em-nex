
export default function cabecario() {
    return (
        <header className="flex flex-col w-full h-[10dvh] 
            border 
            lg:flex-row  text-center items-center 
        "> 


            <section className="flex flex-row justify-between items-center w-full h-1/2 
                border border-preto  text-[1.5em] 
                lg:h-[100%] border-y-transparent lg:border-l-transparent
            ">
                    <div className="flex items-center justify-around border border-preto w-[25%]  h-[90%]
                        lg:h-[60%]
                    ">
                        foto
                        <h1>perfil</h1>
                    </div>

                <div><p>313</p></div>
                <div><p>13</p></div>
                <div>cartao</div>
                <div>baixar</div>
                <div className='mr-[5%]'>menu</div>
            </section>



            <section className="w-full h-1/2 
                 font-mono text-[1.5em]
                lg:font-mono text-[2em]
            ">
                <h1>Ezequias gabriel souza da costa</h1>
            </section>

        </header>
    )
}