import ContactForm from "@/components/ContactForm";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travnox.com.au";

export const metadata = {
  title: "Contact Us - Start Your Journey",
  description:
    "Get in touch with our team to explore departure dates, customize your luxury China travel experience, and start your journey. We're here to help you discover authentic China.",
  openGraph: {
    title: "Contact Us | Travnox - Start Your Journey",
    description:
      "Get in touch with our team to explore departure dates, customize your luxury China travel experience, and start your journey to authentic China.",
    url: `${baseUrl}/contact`,
    images: [
      {
        url: `${baseUrl}/images/Contact@2x.png`,
        width: 1200,
        height: 630,
        alt: "Contact Travnox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Travnox",
    description:
      "Get in touch with our team to explore departure dates and start your journey to authentic China.",
    images: [`${baseUrl}/images/Contact@2x.png`],
  },
};

const Contact = () => {
  return (
    <div
      className="w-full min-h-screen bg-primary-parchment bg-none md:bg-[url('/images/contactform-bg@2x.png')] bg-no-repeat pt-40 md:pb-[400px]"
      style={{
        backgroundSize: "1400px",
        backgroundPosition: "calc(100% + 2px) calc(100% + 2px)",
      }}
    >
      <h1 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] leading-[1.2] text-center">
        Get in touch with our team
      </h1>
      <h2 className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.2] text-center mb-10">
        Fill out the form to find out more, explore departure dates, and book
        your trip.
      </h2>
      <ContactForm />
      <div className="md:hidden mt-6">
        <img
          src="/images/contactform-bg@1x.png"
          srcSet="/images/contactform-bg@2x.png 2x"
          alt="Contact Form Background"
          className="relative top-[1px]"
        />
      </div>
    </div>
  );
};

export default Contact;
