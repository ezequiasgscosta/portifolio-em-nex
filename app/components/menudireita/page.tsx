import Image from 'next/image'
import whats from '@/public/whats.png'
import github from '@/public/github.png'
import linkdim from '@/public/linkdim.png'
import instagram from '@/public/instagram.png'
import email from '@/public/email.png'

export default function MenuDireita() {
    
    const redesSociais = [
        { src: whats, alt: 'whats' },
        { src: github, alt: 'github' },
        { src: linkdim, alt: 'linkdim' },
        { src: instagram, alt: 'instagram' },
        { src: email, alt: 'email' },
    ];

    return (
        <section className="border w-1/5 max-w-[200px] h-[60%] flex flex-col justify-around items-center text-center text-[1em]
            border-t-transparent
        ">
          
            {redesSociais.map((rede, index) => (
                <div key={index} className="mx-2 transition-transform hover:scale-110">
                    <Image
                        src={rede.src}
                        alt={rede.alt}
                        width={60}
                        height={60} 
                        className="rounded-lg object-contain w-8 h-8 lg:w-12 lg:h-12 " 
                       
                    />
                </div>
            ))}
        </section>
    );
}
