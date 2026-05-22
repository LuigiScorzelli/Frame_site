import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import MetricsBar from "@/components/sections/MetricsBar";
import Servizi from "@/components/sections/Servizi";
import ServiceDetails from "@/components/sections/ServiceDetails";
import AIInterlude from "@/components/sections/AIInterlude";
import BrandHistory from "@/components/sections/BrandHistory";
import Risultati from "@/components/sections/Risultati";
import ChatWidget from "@/components/ui/ChatWidget";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Ticker />
        <MetricsBar />
        <Servizi />
        <ServiceDetails />
        <AIInterlude />
        <BrandHistory />
        <Risultati />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
