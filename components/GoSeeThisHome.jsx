"use client";
import React, { useState } from "react";
import { sendEmail } from "@/actions/email";
import swal from "sweetalert";

export default function GoSeeThisHome() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "Please send me additional information about this business. Thank you",
    marketing: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendEmail({
        content: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          marketingConsent: formData.marketing ? "Yes" : "No",
          "Page URL": window.location.href,
        },
        title: "Go See This Home - Inquiry",
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
          message:
            "Please send me additional information about this business. Thank you",
          marketing: true,
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
    <div className="w-full bg-[#f7f7f7] rounded-xl p-2 md:p-5 border border-gray-100 shadow-sm font-sans">
      {/* Agent Row */}
      <div className="flex items-center gap-3 mb-3 p-2 bg-transparent rounded-xl">
        <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 border border-gray-200">
          <img
            src="/profile2.jpeg"
            alt="Ravi Singh Godara"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-serif font-semibold text-[#1a1a1a] leading-tight">
            Ravi Singh Godara
          </h2>
          <p className="text-sm md:text-base text-gray-700 font-medium">
            905-226-7284
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <form className="space-y-2.5" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full h-12 px-3 rounded-lg border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-[#004d4d] transition-all placeholder:text-gray-500"
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full h-12 px-3 rounded-lg border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-[#004d4d] transition-all placeholder:text-gray-500"
          />
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full h-12 px-3 rounded-lg border border-gray-300 bg-white text-base outline-none focus:ring-2 focus:ring-[#004d4d] transition-all placeholder:text-gray-500"
          />
        </div>
        <div>
          <textarea
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-[#004d4d] transition-all resize-none text-gray-700"
          />
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start gap-2 mt-2 px-1">
          <input
            type="checkbox"
            id="marketing"
            name="marketing"
            checked={formData.marketing}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#004d4d] focus:ring-[#004d4d] cursor-pointer"
          />
          <label
            htmlFor="marketing"
            className="text-xs text-gray-700 leading-snug cursor-pointer"
          >
            I would like to book a tour of this business. I consent to receive
            marketing and promotional messages by phone, text message, and email
            from Ravi Singh Godara.
          </label>
        </div>

        {/* Disclaimer */}
        <p className="mt-2 px-1 text-[11px] text-gray-500 leading-snug">
          This inquiry relates to a business property. All information provided
          is for informational purposes only and should be independently
          verified. Submitting this form does not create any agency, advisory,
          or brokerage relationship.
        </p>

        {/* Primary Action */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-700 cursor-pointer hover:bg-blue-600 text-white text-base font-bold py-3 rounded-full mt-2 transition-colors duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Contact agent"}
        </button>
      </form>

      {/* Alternative Action */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-800">
          Not a good time?{" "}
          <button className="font-bold underline">Schedule a call</button>
        </p>
      </div>
    </div>
  );
}
