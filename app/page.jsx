import Image from "next/image";
import home_bird from '../public/img/hand.png';


export default function Home() {
  return (
  <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
    <div className=" basis-full flex flex-col justify-center md:basis-2/3">
    <p className="special-word text-xs">
       No boundaries 
    </p>
       <h1 className="pb-5">
        Hi Mate 👋🙂 <span className="special-word"> Whiteboard</span> is here..

       </h1>
       <p>
        Welcome to Our Blog!

Hey there! 👋
You've just entered a space where everyone’s voice matters. Whether you're a seasoned writer or someone with a single powerful thought—this is your platform. Here, anyone can blog, share their ideas, tell stories, spark discussions, or simply express what’s on their mind.

🌟 No boundaries.
🖋 Real thoughts.
💬 Honest voices.

So go ahead—read, write, connect. This is not just a blog; it's a shared journey of expression and community.

Welcome to the family.
       </p>
    </div>
       <div className="hidden md:block basis-1/3">
           <Image src={home_bird} alt="homeBird" sizes="100vw" className="w-full h-auto" />
       </div>
  </div>
  );
}
