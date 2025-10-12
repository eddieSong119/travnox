import NavBar from "@/components/NavBar";
import strapiService from "@/lib/strapiService";
import {
  Title,
  Intro,
  Description,
  TwoColorTitle,
} from "@/components/HomePage/Title";
import Stays from "@/components/HomePage/Stays";
import LargeGallery from "@/components/HomePage/LargeGallery";
import GalleryElement from "@/components/HomePage/LargeGallery/element";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travnox.com.au";

export const metadata = {
  title: "Luxury Travel to China | Curated Cultural Experiences",
  description:
    "Discover authentic China through curated luxury travel experiences. From ancient temples to modern metropolises, explore premium cultural encounters with expert guides and 5-star hospitality.",
  openGraph: {
    title: "Travnox - Luxury Travel to China | Curated Cultural Experiences",
    description:
      "Discover authentic China through curated luxury travel experiences. From ancient temples to modern metropolises, explore premium cultural encounters with expert guides.",
    url: baseUrl,
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
    title: "Travnox - Luxury Travel to China | Curated Cultural Experiences",
    description:
      "Discover authentic China through curated luxury travel experiences. From ancient temples to modern metropolises, explore premium cultural encounters.",
    images: [`${baseUrl}/images/home-banner@2x.png`],
  },
};

// Server-side function to fetch home data from Strapi - using the service
async function getHomeData() {
  // Use the Strapi service to fetch home endpoint data
  return await strapiService.fetchEndpoint("home-page");
}

// Error page component
function ErrorPage({ error }) {
  return (
    <>
      <NavBar />
      <div className="pt-[100px] min-h-screen bg-primary-parchment flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h2 className="text-lg font-semibold mb-2">Loading Error</h2>
            <p>Failed to fetch Home data: {error}</p>
            <p className="text-sm mt-4 text-red-600">Please check:</p>
            <ul className="text-sm mt-2 text-left space-y-1">
              <li>
                • Strapi server is running at {strapiService.getBaseUrl()}
              </li>
              <li>• Home content type has been created</li>
              <li>• Home content is set to public access</li>
              <li>• STRAPI_URL environment variable is configured</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

const ScrollElements = (section4, section5, section6) => [
  <GalleryElement
    key={section4.id}
    section={section4}
    backgroundColor="bg-primary-steel"
    textColor="text-primary-midnight"
    img={"/images/North@1x.png"}
    largeImg={"/images/North@2x.png"}
    mobileImg={"/images/NorthMobile@1x.png"}
    mobileLargeImg={"/images/NorthMobile@2x.png"}
    ctaText={"EXPLORE THE NORTH"}
    ctaDest={"/north"}
  />,
  <GalleryElement
    key={section5.id}
    section={section5}
    backgroundColor="bg-primary-midnight"
    textColor="text-primary-parchment"
    img={"/images/South@1x.png"}
    largeImg={"/images/South@2x.png"}
    mobileImg={"/images/SouthMobile@1x.png"}
    mobileLargeImg={"/images/SouthMobile@2x.png"}
    ctaText={"EXPLORE THE SOUTH"}
    ctaDest={"/south"}
  />,
  <GalleryElement
    key={section6.id}
    section={section6}
    backgroundColor="bg-primary-mist"
    textColor="text-primary-midnight"
    img={"/images/Southwest@1x.png"}
    largeImg={"/images/Southwest@2x.png"}
    mobileImg={"/images/SouthwestMobile@1x.png"}
    mobileLargeImg={"/images/SouthwestMobile@2x.png"}
    ctaText={"EXPLORE CHUANYU"}
    ctaDest={"/chuanyu"}
  />,
];

export default async function Home() {
  // Check if Strapi service is properly configured
  if (!strapiService.isConfigured()) {
    return (
      <ErrorPage error="STRAPI_URL environment variable is not configured" />
    );
  }

  // Fetch data on the server side using Strapi service
  const { data: homeData, error } = await getHomeData();
  const sections = homeData.content.filter(
    (section) => section.__component === "components.section"
  );
  const section1 = sections[0];
  const section2 = sections[1];
  const section3 = sections[2];
  const section4 = sections[3];
  const section5 = sections[4];
  const section6 = sections[5];
  const section7 = sections[6];

  // If there's an error, show error page
  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <main className="min-h-screen bg-primary-parchment">
        <section className="w-full min-h-[calc(100vh-70px)] md:min-h-[100vh] relative md:flex md:justify-center md:items-start">
          <Image
            src="/images/home-banner-mobile@2x.png"
            srcSet="/images/home-banner-mobile@1x.png 1x, /images/home-banner-mobile@2x.png 2x"
            alt="Background"
            fill
            className="object-contain md:hidden object-bottom z-0"
            sizes="100vw"
            quality={100}
          />

          <Image
            src="/images/home-banner@2x.png"
            srcSet="/images/home-banner@1x.png 1x, /images/home-banner@2x.png 2x"
            alt="Background"
            fill
            className="object-cover hidden md:block z-0"
            sizes="100vw"
            quality={100}
          />
          <div className="relative z-10 flex flex-col items-center justify-center mx-auto pt-[100px] px-[5vw] md:px-0 md:max-w-[1152px]">
            <Intro intro={section1.intro} />
            <Title title={section1.title} breakAt={section1.title_breakAt} />
            <Description description={section1.description} />
            <Link
              href="/contact"
              className="w-full mt-6 md:w-auto bg-primary-terracotta text-primary-parchment py-2 px-8 text-[16px] font-noto-sans font-[500] leading-[160%] rounded-full text-center"
            >
              START YOUR JOURNEYY
            </Link>
          </div>
        </section>

        <section
          className="h-[110vh] relative -top-[1px] z-10"
          style={{
            backgroundImage: `url(/images/home-bg-2.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute top-[191px] left-[50%] w-full px-4 translate-x-[-50%] flex flex-col items-center justify-center mx-auto max-w-[890px]">
            <Intro intro={section2.intro} textColor="text-primary-parchment" />
            <TwoColorTitle
              title={section2.title}
              breakAt={section2.title_breakAt}
              textColor="text-[#efeee966]"
              secondColor="text-primary-parchment"
            />
            <Description
              description={section2.long_description[0].children[0].text}
              textColor="text-primary-parchment"
            />
            <Link
              href="/our-story"
              className={`text-primary-parchment border-primary-parchment mt-10 px-7 py-3 rounded-full border font-noto-sans font-[500] text-[16px] `}
            >
              {section2.CTA}
            </Link>
          </div>
        </section>

        <section className="relative">
          <div className="flex flex-col items-center justify-center mx-auto pt-[80px] pb-[72px] px-12 md:pt-[228px] md:pb-[311px]">
            <Intro
              intro={section3.intro}
              breakAt={section3.intro_breakAt}
              textColor="text-primary-midnight"
            />
            <Title title={section3.title} breakAt={section3.title_breakAt} />
            <Description
              description={section3.description}
              breakAt={section3.description_breakAt}
              textColor="text-primary-midnight"
            />
          </div>
        </section>

        <LargeGallery
          scrollElements={ScrollElements(section4, section5, section6)}
          className="px-[10px] md:pl-0 mb-[50px] md:mb-[100px]"
          slideClassName="md:pb-[100px]"
        />

        <Stays section={section7} />

        <section className="relative z-10 flex flex-col items-center justify-center">
          <div className="md:w-[700px]">
            <h2 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[1.2] text-center">
              Enjoy seamless luxury, from city lights to mountain mist
            </h2>
            <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] text-center mb-10">
              Fill out the form to find out more, explore departure dates, and
              book your trip.
            </p>
            <ContactForm />
          </div>

          <img
            src="images/Contact@1x.png"
            srcSet="images/Contact@2x.png 2x"
            alt="Enjoy seamless luxury, from city lights to mountain mist"
            className=" w-full h-full object-cover"
          />
        </section>
      </main>
    </>
  );
}
