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
import HorizontalGallery from "@/components/HorizonGallery";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.travnox.com.au";

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
    (section) => section.__component === "components.section",
  );
  const section1 = sections[0];
  const section2 = sections[1];
  const section3 = sections[2];
  const section4 = sections[3];
  const section5 = sections[4];
  const section6 = sections[5];
  const section7 = sections[6];

  console.log(section5.content[0].activity);

  // If there's an error, show error page
  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <>
      <main className="min-h-screen bg-primary-parchment">
        <section className="relative w-full min-h-[120vh] overflow-hidden md:min-h-[120vh] md:flex md:justify-center md:items-start">
          <Image
            src="/images/new-home-banner@2x.png"
            alt="Background"
            fill
            priority
            className="object-cover object-[top_-20px] md:object-[center_-100px] z-0"
            sizes="100vw"
            quality={100}
          />
          <div className="relative z-10 flex w-full max-w-[890px] md:max-w-[1158px] flex-col items-center justify-center mx-auto pt-[30px] md:pt-[50px] md:pt-[120px] px-[5vw] md:px-4">
            <Title
              title={"Authentic cultural experiences in the heart of China."}
              textSize={"text-[32px] md:text-[80px]"}
            />
            <Description
              description={
                "For modern explorers chasing authentic Chinese moments, places, and stories—from ancient myths to modern life, our journeys bring you closer to the heart of China's timeless culture."
              }
            />
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
            <Intro intro={"WHO WE ARE"} textColor="text-primary-parchment" />
            <TwoColorTitle
              title={"Not tour guides. Cultural storytellers."}
              breakAt={"guides."}
              textColor="text-[#efeee966]"
              secondColor="text-primary-parchment"
            />
            <Description
              description={
                "TravNox exists to shift perspectives and bridge cultural gaps, taking travellers beyond the ordinary. Through premium hosted tours, we explore places where myth meets modernity, and cities pulse with untold stories, and landscapes hold memory."
              }
              textColor="text-primary-parchment"
            />
            <Link
              href="/our-story"
              className={`text-primary-parchment border-primary-parchment mt-10 px-7 py-3 rounded-full border font-noto-sans font-[500] text-[16px] `}
            >
              OUR STORY
            </Link>
          </div>
        </section>

        <section className="relative">
          <div className="flex flex-col items-center justify-center mx-auto pt-[80px] pb-[72px] md:pt-[228px] md:pb-[311px]">
            <div className="flex w-full max-w-[890px] flex-col items-center px-4">
              <Intro intro={"YUNNAN, 2026"} textColor="text-primary-midnight" />
              <Title
                title={"Explore highlights from our first journey."}
                breakAt={"highlights"}
              />
              <Description
                description={
                  "In June 2026, we travelled to Yunnan, China for our inaugural TravNox trip. A way for us to get a deeper understanding of how to best share our culture and country with you — our curious explorers. Enjoy some of our highlights."
                }
                textColor="text-primary-midnight"
              />
            </div>

            <HorizontalGallery section={section5} />
          </div>
        </section>

        <section className="relative z-10 flex flex-col items-center justify-center pb-10">
          <div className="md:w-[700px]">
            <Intro intro={"TRAVEL WITH US"} textColor="text-primary-midnight" />
            <h2 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[1.2] text-center">
              We’re planning our next adventures.
            </h2>
            <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] text-center mb-10">
              Seeking expressions of interest from culturally curious explorers,
              who want to visit a new part of the world, and help us shape the
              future of China as a holiday destination.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
