"use client";

export const WhatsAppButton = () => (
  <button
    onClick={() => window.open("https://wa.me/+8619328759827", "_blank")}
    className="mt-10 bg-primary-terracotta text-primary-parchment px-7 py-3 rounded-full font-noto-sans text-[14px] md:text-[16px] font-[500] text-center w-full md:max-w-fit"
  >
    CONTACT US
  </button>
);
