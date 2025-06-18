import Image from "next/image";
import home_bird from '../public/img/home_bird.png';


export default function Home() {
  return (
  <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
    <div className=" basis-full flex flex-col justify-center md:basis-2/3">
    <p className="special-word text-xs">
       Protect All the Brids 
    </p>
       <h1 className="pb-5">
        The World's <span className="special-word">Rarest</span> Brids

       </h1>
       <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, sunt quae nostrum ratione consequatur magni asperiores aspernatur tempore esse vero beatae voluptates facilis et rerum quo consequuntur! In, non minus?
       </p>
    </div>
       <div className="hidden md:block basis-1/3">
           <Image src={home_bird} alt="homeBird" sizes="100vw" className="w-full h-auto" />
       </div>
  </div>
  );
}
