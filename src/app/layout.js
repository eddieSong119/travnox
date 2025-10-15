import "./globals.css";
import { fontVariables } from "../lib/fonts";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytics";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.travnox.com.au";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Travnox - Luxury Travel to China",
    template: "%s | Travnox",
  },
  description:
    "Experience luxury travel to China with curated cultural encounters, premium hospitality, and authentic storytelling. Discover the real China beyond headlines.",
  keywords: [
    "luxury travel China",
    "China tours",
    "cultural travel",
    "luxury China experiences",
    "China travel packages",
    "authentic China travel",
  ],
  authors: [{ name: "Travnox" }],
  creator: "Travnox",
  publisher: "Travnox",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Travnox",
    title: "Travnox - Luxury Travel to China",
    description:
      "Experience luxury travel to China with curated cultural encounters, premium hospitality, and authentic storytelling. Discover the real China beyond headlines.",
    images: [
      {
        url: `${baseUrl}/images/home-banner@2x.png`,
        width: 1200,
        height: 630,
        alt: "Travnox - Luxury Travel to China",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travnox - Luxury Travel to China",
    description:
      "Experience luxury travel to China with curated cultural encounters, premium hospitality, and authentic storytelling.",
    images: [`${baseUrl}/images/home-banner@2x.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification here when available
    // google: 'your-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fontVariables} antialiased max-w-screen bg-primary-parchment`}
      >
        <GoogleAnalytics />
        <NavBar />
        <div className="h-[70px]" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
