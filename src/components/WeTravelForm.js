"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function WeTravelForm() {
  useEffect(() => {
    if (window?.dispatchEvent) {
      window.dispatchEvent(new Event("load"));
    }
  }, []);

  return (
    <>
      <div
        data-wt-embed="custom-form"
        data-widget-id="6b845871-12f8-4f13-9f24-5b3ec7f41a0d"
        data-api-base-url="https://www.wetravel.com"
      >
        <script src="https://cdn.wetravel.com/mfe-widgets/embeds/custom-form.embed.js"></script>
      </div>
    </>
  );
}
