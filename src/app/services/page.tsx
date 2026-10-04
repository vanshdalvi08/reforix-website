import Navbar from "@/components/navbar/Navbar";
import Services from "@/components/services/Services";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "Services — Reforix Engineering Solutions",
  description: "Specialized design and drafting services for petroleum plant engineering.",
};

export default function ServicesPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-28">
        <Services />
      </div>
      <Footer />
    </main>
  );
}
