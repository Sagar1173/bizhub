import ContactSection from "@/components/ContactSection";
import RegisterNowModal from "@/components/RegisterNowModal";

export const metadata = {
  title: "Contact Century 21 Canada",
  description:
    "Get in touch with Century 21 Canada for buying, selling, and commercial real estate guidance across the GTA.",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <ContactSection header="Get in Touch" />
      <RegisterNowModal />
    </main>
  );
}
