import { Chrome } from "@/components/Chrome";
import { HeroAbout } from "@/components/HeroAbout";
import { Approach, Contact, Experience, Quotes, WhatIDo, Work } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Chrome />
      <main id="main">
        <HeroAbout />
        <WhatIDo />
        <Work />
        <Approach />
        <Experience />
        <Quotes />
        <Contact />
      </main>
    </>
  );
}
