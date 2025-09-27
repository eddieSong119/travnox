import "./globals.css";
import { fontVariables } from "../lib/fonts";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Travnox",
  description: "Your Luxury Travel to China",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${fontVariables} antialiased max-w-screen bg-primary-parchment`}
      >
        <NavBar />
        <div className="h-[70px]" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
