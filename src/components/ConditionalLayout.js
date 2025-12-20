"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";

export function ConditionalNavBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/travellers")) {
    return null;
  }
  return <NavBar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/travellers")) {
    return null;
  }
  return <Footer />;
}

export function ConditionalSpacer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/travellers")) {
    return null;
  }
  return <div className="h-[70px]" />;
}
