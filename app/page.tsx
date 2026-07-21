import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/app/_components/header";
import Hero from "@/app/_components/Hero";

export default function Home() {
  return (

    <div>
    {/* header */}
    <Header/>
    {/*hero section*/}
    <Hero />
   </div>
  );
}
