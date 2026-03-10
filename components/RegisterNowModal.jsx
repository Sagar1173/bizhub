"use client";

import React, { useState } from "react";
import { sendEmail } from "@/actions/email";
import swal from "sweetalert";
import { X } from "lucide-react";

export default function RegisterNowModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message:
      "I would like to get updates on the business opportunities in Ontario.",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await sendEmail({
        content: {
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          "Page URL": window.location.href,
        },
        title: "Register Now - Inquiry",
      });

      if (result.success) {
        swal(
          `Thank You, ${formData.name}`,
          "Please expect a call from us shortly",
          "success",
        );
        setFormData({
          name: "",
          phone: "",
          message: "I would like more information.",
        });
        setIsOpen(false);
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
    <>
      <div className="md:hidden fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-center px-4">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex w-fit max-w-xs items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow-2xl transition-transform duration-150 hover:scale-[1.02] active:scale-95"
        >
          Register For Updates
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:hidden backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold text-gray-900">Register Now</h3>
              <p className="mt-1 text-sm text-gray-500">
                Register for new updates for Restaurants, Convenience Stores,
                and more!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-full bg-blue-700 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
