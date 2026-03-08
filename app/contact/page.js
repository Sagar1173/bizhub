import ContactSection from "@/components/ContactSection";

export const metadata = {
  title: "Contact Bizmonk",
  description:
    "Get in touch with Bizmonk for buying, selling, and commercial real estate guidance across the GTA.",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <ContactSection header="Let's Connect" />
    </main>
  );
}
