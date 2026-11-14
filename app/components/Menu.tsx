'use client'

type MenuProps = {
    onClose: () => void
    onQuemSou: () => void
    onProjetos: () => void
    onContatos: () => void
    onCertificados: () => void
    onExtensao: () => void
}

export default function Menu ({
    onClose,
    onQuemSou,
    onProjetos,
    onContatos,
    onCertificados,
    onExtensao,
}: MenuProps) {
    
    return (
        <menu id="menu-opcoes" className="menu-botoes fixed top-1/3 left-1/2 z-50 grid w-[80vw] -translate-x-1/2 grid-cols-1 gap-10">
            <button type="button" className="botao-voltar" onClick={onClose}>Voltar</button>
            <button type="button" onClick={onQuemSou}>QUEM SOU</button>
            <button type="button" onClick={onProjetos}>PROJETOS</button>
            <button type="button" onClick={onContatos}>CONTATO</button>
            <button type="button" onClick={onCertificados}>CERTIFICADOS</button>
            <button type="button" onClick={onExtensao}>EXTENSÃO</button>
        </menu>
    )
}