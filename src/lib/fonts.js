import { Geist, Geist_Mono, Noto_Sans, Caveat } from "next/font/google";
import localFont from "next/font/local";

// Google字体
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
});

// Noto Sans Google字体
export const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// PP Museum 本地字体
export const ppMuseum = localFont({
  src: [
    {
      path: "../fonts/ppmuseum-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/ppmuseum-lightitalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/ppmuseum-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ppmuseum-regularitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ppmuseum-ultrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/ppmuseum-ultrabolditalic.otf",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-pp-museum",
  display: "swap",
});

// 字体变量组合
export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${notoSans.variable} ${ppMuseum.variable} ${caveat.variable}`;
