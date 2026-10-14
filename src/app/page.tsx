import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Manifesto } from "@/components/Manifesto";
import { Trust } from "@/components/Trust";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { Results } from "@/components/Results";
import { Why } from "@/components/Why";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Header c={c} />
      <main id="main">
        <Hero c={c} /><Marquee items={c.ticker} /><Manifesto c={c} /><Trust c={c} /><Projects c={c} /><Services c={c} /><Results c={c} /><Why c={c} /><Pricing c={c} /><FAQ c={c} /><Contact c={c} />
      </main>
      <Footer c={c} />
    </>
  );
}
