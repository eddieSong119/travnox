"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Footer from "./Footer";

export function ConditionalNavBar() {
  const pathname = usePathname();
  // 隐藏 agency 和 admin portal 的网站 header
  if (pathname?.startsWith("/agency") || pathname?.startsWith("/admin")) {
    return null;
  }
  return <NavBar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  // 隐藏 agency 和 admin portal 的网站 footer
  if (pathname?.startsWith("/agency") || pathname?.startsWith("/admin")) {
    return null;
  }
  return <Footer />;
}

export function ConditionalSpacer() {
  const pathname = usePathname();
  // 隐藏 agency 和 admin portal 的 spacer
  if (pathname?.startsWith("/agency") || pathname?.startsWith("/admin")) {
    return null;
  }
  return <div className="h-[70px]" />;
}
