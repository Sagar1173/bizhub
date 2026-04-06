"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { sendEmail } from "@/actions/email";
import swal from "sweetalert";

const ContactSection = ({ header }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendEmail({
        content: {
          ...formData,
          "Page URL": window.location.href,
        },
        title: "Contact Section - Inquiry",
      });

      if (result.success) {
        swal(
          `Thank You, ${formData.name}`,
          "Please expect an email or call from us shortly",
          "success",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        swal("Message Failed", "Cannot send your message", "error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      swal("Error", "Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mx-auto mb-2 inline-flex items-center rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[11px] ">
            Get in touch
          </p>
          <h2 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
            {header}
          </h2>
        </div>

        {/* Contact Info */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 sm:mb-10">
          <a
            href="tel:+19052267284"
            className="group inline-flex items-center gap-2 rounded-full  px-4 py-2 text-slate-900 transition bg-slate-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition group-hover:bg-slate-200/70">
              <Phone className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium">(905) 226-7284</span>
          </a>
          <a
            href="mailto:info@bizmonk.ca"
            className="group inline-flex items-center gap-2 rounded-full  px-4 py-2 text-slate-900 transition bg-slate-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition group-hover:bg-slate-200/70">
              <Mail className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium">info@bizmonk.ca</span>
          </a>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-slate-900">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900">
              <MapPin className="h-4 w-4" />
            </span>
            <span className="text-xs font-medium">Mississauga, Ontario</span>
          </span>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-[0_16px_40px_-22px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Smith"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    className="h-11 border-0 bg-slate-100 text-sm shadow-none ring-1 ring-slate-200/60 transition placeholder:text-slate-500/70 focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-0"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className="h-11 border-0 bg-slate-100 text-sm shadow-none ring-1 ring-slate-200/60 transition placeholder:text-slate-500/70 focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="(647) 555-1234"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className="h-11 border-0 bg-slate-100 text-sm shadow-none ring-1 ring-slate-200/60 transition placeholder:text-slate-500/70 focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-0"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-900">
                  Message
                </label>
                <Textarea
                  placeholder="Tell me about your needs..."
                  value={formData.message}
                  onChange={handleChange("message")}
                  className="min-h-28 resize-none border-0 bg-slate-100 text-sm shadow-none ring-1 ring-slate-200/60 transition placeholder:text-slate-500/70 focus-visible:ring-2 focus-visible:ring-slate-900/10 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  type="submit"
                  disabled={loading}
                  className="group h-11 rounded-full bg-[#0075d7] px-7 font-semibold text-white shadow-sm transition hover:bg-[#006ac2] focus-visible:ring-2 focus-visible:ring-[#0075d7]/25 focus-visible:ring-offset-0 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
