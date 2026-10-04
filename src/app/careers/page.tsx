import Navbar from "@/components/navbar/Navbar";
import Careers from "@/components/careers/Careers";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "Careers — Reforix Engineering Solutions",
  description: "Join the Reforix team — apply with your skills and experience in petroleum plant design and drafting.",
};

export default function CareersPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-28">
        <Careers />
      </div>
      <Footer />
    </main>
  );
}
