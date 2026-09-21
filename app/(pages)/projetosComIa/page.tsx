import Image from "next/image"; 
import site from '@/public/site.png' 

export default function ProjetosComIa () { 
  return ( 
    <section className="w-[60dvw] h-[80dvh] m-auto text-center border my-6 flex flex-col
            
    "> 
      <h1 className="p-4 text-xl font-bold">Projetos Com IA</h1> 
      
      <div className="flex-1 w-full overflow-y-auto space-y-4 px-4 pb-4 
      [scrollbar-color:blue_gray] [scrollbar-width:thin]
      
      ">
        
       
        <div className="flex flex-col justify-between w-full border-y py-2"> 
          <h2 className="font-mono font-extrabold text-[1.4em]">Ecomerce do pobre</h2> 
          <h3 className="font-sans font-bold">html css javascript</h3> 
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi id, at dolorem qui dolorum facilis esse libero recusandae?</p> 
          <Image src={site} alt="site" className="w-full h-auto" /> 
          <button className="border rounded-md bg-white my-1">Ver Site</button> 
          <button className="border rounded-md bg-white my-1">Ver GitHub</button> 
        </div> 

        <div className="flex flex-col justify-between w-full border-y py-2"> 
          <h2 className="font-mono font-extrabold text-[1.4em]">Ecomerce do pobre</h2> 
          <h3 className="font-sans font-bold">html css javascript</h3> 
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi id, at dolorem qui dolorum facilis esse libero recusandae?</p> 
          <Image src={site} alt="site" className="w-full h-auto" /> 
          <button className="border rounded-md bg-white my-1">Ver Site</button> 
          <button className="border rounded-md bg-white my-1">Ver GitHub</button> 
        </div> 
       

      </div>
    </section> 
  ) 
}
