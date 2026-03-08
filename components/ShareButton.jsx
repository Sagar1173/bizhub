"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Facebook, Mail, MessageCircle, Share2 } from "lucide-react";

export default function ShareButton({ title, text }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  const shareTitle = title || "Check out this property";
  const shareText = text || "Take a look at this property I found:";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const closeMenu = () => setIsOpen(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    const url = getUrl();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  const handleEmailShare = () => {
    const url = getUrl();
    const subject = shareTitle;
    const body = `${shareText}\n\n${url}`;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    closeMenu();
  };

  const handleWhatsAppShare = () => {
    const url = getUrl();
    const message = `${shareText} ${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    closeMenu();
  };

  const handleFacebookShare = () => {
    const url = getUrl();

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
    closeMenu();
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        aria-label="Share this property"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Share this property"
      >
        <Share2 size={16} />
        Share
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleEmailShare}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Mail size={16} />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <MessageCircle size={16} className="text-[#25D366]" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleFacebookShare}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Facebook size={16} className="text-[#1877F2]" />
            <span>Facebook</span>
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy size={16} />
            <span>{copied ? "Copied" : "Copy link"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
