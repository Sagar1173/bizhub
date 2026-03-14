"use client";

import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import swal from "sweetalert";
import { X } from "lucide-react";
import { sendEmail } from "@/actions/email";

export default function RequestInfoModal({
  propertyTitle = "Property",
  propertyMls = "",
  propertyUrl = "",
  variant = "default",
  label = "Request Info",
}) {
  const defaultMessage = propertyTitle
    ? `Hi, I’m interested in ${propertyTitle} and would like more information. Please contact me at your earliest convenience.`
    : "Hi, I’m interested in this listing and would like more information. Please contact me at your earliest convenience.";

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
  });

  const resolvedUrl = useMemo(() => {
    if (propertyUrl) return propertyUrl;
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [propertyUrl]);

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
          email: formData.email,
          ...(formData.phone ? { phone: formData.phone } : {}),
          message: formData.message,
          Listing: propertyTitle,
          ...(propertyMls ? { "MLS®": propertyMls } : {}),
          "Page URL": resolvedUrl,
        },
        title: "Request Info - Inquiry",
      });

      if (result.success) {
        swal(
          `Thank You, ${formData.name}`,
          "We received your request and will contact you shortly.",
          "success",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: defaultMessage,
        });
        setIsOpen(false);
      } else {
        swal("Message Failed", "Cannot send your message", "error");
      }
    } catch (error) {
      console.error("Request info submission error:", error);
      swal("Error", "Something went wrong. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  const isPill = variant === "pill";
  const buttonClass = isPill
    ? "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-teal-600 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-50 active:bg-teal-100"
    : "inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-200 active:bg-gray-300";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={buttonClass}
      >
        {label}
      </button>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            role="presentation"
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Request Info
                </h3>
                {propertyTitle ? (
                  <p className="mt-1 text-sm text-gray-600">
                    Request More info about {propertyTitle}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-gray-600">
                    Request More info about this listing
                  </p>
                )}
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
                    type="email"
                    name="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    autoComplete="tel"
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
          </div>,
          document.body,
        )}
    </>
  );
}
