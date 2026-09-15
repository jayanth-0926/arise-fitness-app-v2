import { Mail, Phone, MapPin, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CONTACT_ITEMS = [
  { icon: Mail, label: "EMAIL", value: "xxxxx" },
  { icon: Phone, label: "PHONE", value: "xxxxx" },
  { icon: MapPin, label: "ADDRESS", value: "xxxxx" },
  { icon: Share2, label: "SOCIAL", value: "xxxxx" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-primary px-6 pb-24 pt-32 md:px-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl">CONTACT</h1>
          <p className="mt-3 max-w-lg text-text-secondary">
            Reach out with questions about ARISE. Contact details below will be updated soon.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="rounded-sm border border-border bg-bg-card p-6">
                <item.icon className="text-accent-red" size={22} />
                <p className="mt-4 text-xs tracking-widest text-text-secondary">{item.label}</p>
                <p className="mt-1 font-display text-xl">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
