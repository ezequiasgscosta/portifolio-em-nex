
type CabecarioProps = {
    nome: string
}

export default function Cabecario({ nome }: CabecarioProps) {
    return (
        <div className="pt-8">
            <h1 className="belleza-regular text-2xl">
                {nome}
            </h1>
        </div>
    )
}