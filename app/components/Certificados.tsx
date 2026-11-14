'use client'

import type { CertificateItem } from '../types/portfolio'

type CertificatePreview = CertificateItem & {
    url: string
}

type CertificadosProps = {
    onClose: () => void
    items: CertificatePreview[]
}

export default function Certificados ({ onClose, items }: CertificadosProps){
    return (
        <section role="dialog" aria-modal="true" aria-label="Certificados" className="relative border w-[90vw] h-[86vh] bg-bg-cinza
        rounded-2xl flex flex-col items-center overflow-y-auto 
        ">
            {items.length === 0 ? (
                <p className="mt-8 text-branco">Nenhum certificado cadastrado.</p>
            ) : items.map((item) => (
                <article
                    key={item.id}
                    className="mt-3 flex min-h-[50vh] w-[90%] flex-col items-center justify-around rounded-2xl bg-sub-bg p-4"
                >
                    <h2 className="text-xl">{item.name}</h2>
                    <div className="h-[38vh] w-[80%] overflow-hidden rounded-sm border">
                        {item.mimeType === 'application/pdf' ? (
                            <iframe
                                src={item.url}
                                title={`Certificado: ${item.name}`}
                                className="h-full w-full"
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={`Certificado: ${item.name}`}
                                className="h-full w-full object-contain"
                            />
                        )}
                    </div>
                </article>
            ))}

            <button type="button" onClick={onClose} className="sticky mt-auto bottom-2 w-auto bg-sub-bg! border border-black">VOLTAR</button>

        </section>
    )
}