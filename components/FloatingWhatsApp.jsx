"use client";

import { usePathname } from "next/navigation";

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  const isPropertyDetailPage =
    typeof pathname === "string" &&
    /^\/[^/]+\/[^/]+\/?$/.test(pathname || "");

  const handleWhatsAppClick = () => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    const message = `Hi Ravi,\nI would like to visit this property.\n\n${currentUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "19052267284";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (isPropertyDetailPage) {
    return null;
  }

  return (
    <div className="fixed z-50 right-3 sm:right-6 lg:right-10 bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))] lg:bottom-[max(2.5rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-1 sm:gap-1.5">
      <button
        type="button"
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 sm:h-8 sm:w-8 fill-current text-white"
          aria-hidden="true"
        >
          <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.92c0 1.75.46 3.46 1.33 4.96L2 22l5.26-1.38a9.86 9.86 0 0 0 4.77 1.22h.01c5.46 0 9.91-4.45 9.91-9.92a9.86 9.86 0 0 0-2.9-7.01zm-7.01 15.26h-.01a8.3 8.3 0 0 1-4.24-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.27 8.27 0 0 1-1.27-4.38c0-4.58 3.73-8.31 8.31-8.31 2.22 0 4.3.86 5.87 2.43a8.25 8.25 0 0 1 2.44 5.88c0 4.58-3.73 8.31-8.31 8.31zm4.56-6.22c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.16.25-.64.8-.78.96-.14.16-.28.18-.53.06-.25-.13-1.04-.38-1.98-1.21-.73-.65-1.23-1.45-1.37-1.69-.14-.25-.02-.38.11-.51.11-.11.25-.28.38-.42.13-.14.17-.25.25-.41.08-.16.04-.3-.02-.42-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.3-.23.25-.87.85-.87 2.06 0 1.21.89 2.39 1.01 2.55.13.16 1.74 2.66 4.21 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.29z" />
        </svg>
      </button>
      <span className="rounded-full bg-slate-900 px-2 py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-md">
        Connect with me
      </span>
    </div>
  );
}
