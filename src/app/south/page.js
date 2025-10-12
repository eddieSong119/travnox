import strapiService from "@/lib/strapiService";
import Image from "next/image";
import CollapsibleContent from "@/components/HomePage/LargeGallery/CollapsibleContent";
import Polaroid from "@/components/Polaroid";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travnox.com.au";

export const metadata = {
  title: "Experience the South",
  description:
    "Discover Southern China's vibrant culture and natural beauty. From Shanghai's modern skyline to Guangdong's dynamic cities, enjoy curated luxury experiences with 5-star accommodation and authentic local encounters.",
  openGraph: {
    title: "Experience the South | Travnox - Luxury China Travel",
    description:
      "Discover Southern China's vibrant culture and natural beauty. From Shanghai's modern skyline to Guangdong's dynamic cities, enjoy curated luxury experiences with 5-star accommodation.",
    url: `${baseUrl}/south`,
    images: [
      {
        url: `${baseUrl}/images/South@2x.png`,
        width: 1200,
        height: 630,
        alt: "Experience Southern China - Travnox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience the South | Travnox",
    description:
      "Discover Southern China's vibrant culture and natural beauty. From Shanghai's modern skyline to Guangdong's dynamic cities, enjoy curated luxury experiences.",
    images: [`${baseUrl}/images/South@2x.png`],
  },
};

async function getSouthData() {
  const data = await strapiService.fetchEndpoint("journeys");
  const southPage = data.data.find((item) => {
    return item.page.some((page) => page.title === "south");
  });
  return southPage.page.find(
    (page) => page.__component === "components.section"
  );
}

const South = async () => {
  const pageData = await getSouthData();
  const { title, intro, long_description, content } = pageData;
  console.log(content);
  const routeContent = content[0];
  const routeTitle = routeContent.title;
  const routeItinerary = routeContent.description.itinerary;
  const activities = routeContent.activity;
  console.log(activities);

  return (
    <main className="md:min-w-[1420px] @container">
      <section className="w-full min-h-[1000px] md:min-h-[100vh] relative md:flex md:justify-center  @min-[1420px]:px-[5vw]">
        <Image
          src="/images/south-bg-mobile@1x.png"
          srcSet="/images/south-bg-mobile@1x.png 1x, /images/south-bg-mobile@2x.png 2x"
          alt="Background"
          fill
          className="object-cover md:hidden"
          sizes="100vw"
        />

        <Image
          src="/images/south-bg@1x.png"
          srcSet="/images/south-bg@1x.png 1x, /images/south-bg@2x.png 2x"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          sizes="100vw"
          quality={100}
        />

        <div className="px-[5vw] md:w-[1420px] md:px-0 md:flex md:justify-start md:items-start">
          <div className="relative z-10 flex flex-col items-start justify-center px-[5vw] pt-[80px] md:max-w-[700px] md:pt-[150px] md:px-0">
            <h2 className="text-primary-parchment font-noto-sans text-[14px] md:text-[16px] font-[500] leading-[1.6] mb-5">
              {intro}
            </h2>
            <h1 className="text-primary-parchment font-pp-museum text-[32px] md:text-[60px] font-[500] mb-4">
              {title}
            </h1>

            <p className="text-primary-parchment font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6]">
              {long_description[0].children[0].text}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full h-full bg-primary-parchment md:flex md:justify-center pb-[10vh]  @min-[1420px]:px-[5vw]">
        <div className="md:w-[1420px] px-[5vw] md:px-0">
          <div className="w-full h-auto flex flex-col md:flex-row justify-between items-start pt-[10vh] gap-15">
            <div className="h-full flex flex-col justify-start items-start w-full">
              <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%]">
                {routeTitle}
              </h2>
              <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4 mt-10">
                <div className="flex flex-col justify-start items-start gap-4 md:w-1/2">
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.49967 2.97919H16.4997V0.916687H18.333V2.97919H20.8538V20.8542H1.14551V2.97919H3.66634V0.916687H5.49967V2.97919ZM8.91792 7.57627L14.1466 5.48352L14.8277 7.18485L12.5635 8.09235L12.7771 10.3749L10.9529 10.5454L10.7879 8.80185L8.74834 9.6186L7.89676 9.9596L7.55576 9.10894L6.85542 7.3581L8.55767 6.67702L8.91792 7.57627ZM9.62467 14.4375H4.12467V13.0625H9.62467V14.4375ZM4.12467 18.1042H9.62467V16.7292H4.12467V18.1042ZM17.8747 14.4375H12.3747V13.0625H17.8747V14.4375ZM12.3747 18.1042H17.8747V16.7292H12.3747V18.1042Z"
                          fill="#262B2F"
                        />
                      </svg>
                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        TRAVEL PERIOD
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      Mid December to late February
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.5003 12.8334C16.5003 12.8334 20.6253 7.73606 20.6253 5.04169C20.6253 2.91539 18.6266 0.916687 16.5003 0.916687C14.374 0.916687 12.3753 2.91539 12.3753 5.04169C12.3753 7.73606 16.5003 12.8334 16.5003 12.8334ZM0.916992 2.75002H11.5554C11.2078 3.44748 11.0003 4.22593 11.0003 5.04169C11.0003 5.4919 11.0769 5.95694 11.1999 6.41669H3.66699V8.25002H11.9007C12.304 9.0951 12.7995 9.9388 13.2797 10.6892C13.78 11.4708 14.2782 12.1732 14.667 12.7V21.0834H8.70866V17.4167H6.87533V21.0834H0.916992V2.75002ZM3.66699 12.375H11.917V10.5417H3.66699V12.375ZM15.5837 5.95835V4.12502H17.417V5.95835H15.5837Z"
                          fill="#262B2F"
                        />
                      </svg>
                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        ACCOMMODATION
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      10 nights in 5 star luxury hotels
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-4 md:w-1/2">
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="14"
                        viewBox="0 0 20 14"
                        fill="none"
                      >
                        <path
                          d="M12.301 0.697918C14.8157 -0.45239 17.7869 0.653719 18.9372 3.16853L19.2844 3.92742L14.1661 6.26865L13.3903 12.1296L10.3547 13.5182L9.41025 8.44405L4.10636 10.8702L0.634977 3.28116L2.91196 2.23961L5.87574 4.55466L12.301 0.697918Z"
                          fill="#262B2F"
                        />
                      </svg>
                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        DEPARTS FROM
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      Sydney International Airport
                    </p>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="22"
                        viewBox="0 0 21 22"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0837 11C10.0837 16.5687 14.5982 21.0833 20.167 21.0833V17.1875C18.526 17.1875 16.9522 16.5356 15.7918 15.3752C14.6314 14.2148 13.9795 12.641 13.9795 11C13.9795 9.35893 14.6314 7.78512 15.7918 6.62474C16.9522 5.46435 18.526 4.81246 20.167 4.81246V0.916626C14.5982 0.916626 10.0837 5.43121 10.0837 11ZM15.3545 11C15.3545 8.34163 17.5087 6.18746 20.167 6.18746V15.8125C18.8906 15.8125 17.6666 15.3054 16.764 14.4029C15.8615 13.5004 15.3545 12.2763 15.3545 11ZM0.916992 1.83329V6.87496C0.917073 7.76922 1.20763 8.63925 1.74492 9.3541C2.28222 10.069 3.03718 10.5899 3.89616 10.8386V20.1666H6.18783V10.8386C7.04681 10.5899 7.80177 10.069 8.33906 9.3541C8.87636 8.63925 9.16691 7.76922 9.16699 6.87496V1.83329H7.33366V5.95829H5.95866V1.83329H4.12533V5.95829H2.75033V1.83329H0.916992Z"
                          fill="#262B2F"
                        />
                      </svg>
                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        MEALS
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      Breakfast included
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300] mb-6">
                  Itinerary
                </p>
                {routeItinerary.map((desc, index) => {
                  return (
                    <CollapsibleContent
                      key={index + desc.title.replace(/\s+/g, "-")}
                      className={`py-5 ${
                        index !== 0
                          ? "border-b border-primary-stone"
                          : "border-t border-b border-primary-stone"
                      }`}
                      titleFont="text-[16px] font-noto-sans leading-[1.6]"
                      titleMargin=""
                      item={{
                        id: index + desc.title.replace(/\s+/g, "-"),
                        title: desc.title.toUpperCase(),
                        description_type: "text",
                        description: {
                          value: desc.description,
                        },
                      }}
                    />
                  );
                })}
              </div>

              <Link
                href="/contact"
                className="mt-10 bg-primary-terracotta text-primary-parchment px-7 py-3 rounded-full font-noto-sans text-[14px] md:text-[16px] font-[500] text-center w-full md:max-w-fit"
              >
                START YOUR JOURNEY
              </Link>
            </div>

            <div className="h-full">
              <img
                src="/images/south-map.png"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="mt-15 md:mt-30 w-full flex flex-col md:flex-row items-center justify-center gap-5">
            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="20"
                viewBox="0 0 28 20"
                fill="none"
              >
                <path
                  d="M17.3462 0.833365C21.004 -0.839811 25.3257 0.769075 26.9988 4.42699L27.5038 5.53083L20.059 8.93625L18.9307 17.4613L14.5153 19.481L13.1415 12.1005L5.42672 15.6293L0.377439 4.59081L3.68941 3.07583L8.00037 6.44316L17.3462 0.833365Z"
                  fill="#262B2F"
                />
              </svg>
              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Direct fights
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                No transfers, no hassle
              </p>
            </div>

            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="26"
                viewBox="0 0 30 26"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.92178 0.333328H24.0775L24.3034 1.38729L26.0775 9.66666H29.6663V21.6667H25.6663V25.6667H22.9997V21.6667H6.99967V25.6667H4.33301V21.6667H0.333008V9.66666H3.92178L5.69594 1.38729L5.92178 0.333328ZM21.9218 2.99999L23.3503 9.66666H6.64899L8.07757 2.99999H21.9218ZM8.33301 17H4.33301V14.3333H8.33301V17ZM21.6663 14.3333H25.6663V17H21.6663V14.3333Z"
                  fill="#262B2F"
                />
              </svg>
              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Private transfers
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                A seamless door-to-door experience
              </p>
            </div>

            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.5067 10.5343L14.9999 0.31282L10.4932 10.5352L0.270508 15.0416L10.4932 19.548L15.0001 29.7705L19.5067 19.5472L29.7294 15.0408L19.5067 10.5343Z"
                  fill="#262B2F"
                />
              </svg>
              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Premium experience
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                Small groups and curated encounters
              </p>
            </div>

            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.4897 18.1964C21.6803 17.0057 22.3493 15.3908 22.3493 13.7068V11.8656L16.0001 1.38931L9.65082 11.8656V13.7068C9.65082 15.3908 10.3198 17.0057 11.5105 18.1964C12.7012 19.3871 14.3162 20.056 16.0001 20.056C17.6839 20.056 19.2989 19.3871 20.4897 18.1964ZM29.3337 30.6668H2.66699V28.0001H29.3337V30.6668ZM24.3493 11.3068V13.7068C24.3493 15.9212 23.4697 18.0448 21.9038 19.6107C21.349 20.1655 20.7241 20.6341 20.0499 21.0081C21.2626 21.4827 22.6009 21.5775 23.8829 21.2643C25.5241 20.8633 26.9387 19.8269 27.8157 18.3831L28.7691 16.8132L28.7807 4.5235L22.2875 7.90491L24.3493 11.3068ZM8.11819 21.2643C9.40007 21.5773 10.7381 21.4827 11.9506 21.0083C11.2763 20.6344 10.6512 20.1656 10.0962 19.6107C8.53047 18.0448 7.65082 15.9212 7.65082 13.7068V11.3068L9.71281 7.90453L3.22038 4.5235L3.23203 16.8132L4.18545 18.3831C5.06242 19.8269 6.47707 20.8633 8.11819 21.2643Z"
                  fill="#262B2F"
                />
              </svg>
              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Truly unwind
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                Wellness woven into the journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-full bg-[#21272B] flex flex-col justify-center items-center @min-[1420px]:px-[5vw] pt-[10vh] md:pt-[15vh]">
        <div className="w-full md:w-[1420px] h-[650px] md:h-[900px] relative mb-[200px] md:mb-[300px]">
          <p className="text-[24px] md:text-[40px] font-pp-museum font-[500] text-primary-parchment absolute -top-[60px] left-5">
            Flavours you won&apos;t forget
          </p>
          <div className="hidden md:block w-[100vw] @min-[1420px]:w-full mr-[5vw]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 1585 877"
              fill="none"
            >
              <path
                d="M516.999 13.9999C562.332 -8.00006 686.938 -11.2133 805.338 100.787C953.338 240.787 1130.66 481.213 1297 332C1427.21 215.192 1117 40.7867 758.999 302.787C400.999 564.787 182.999 548 80.9988 486C-21.0012 424 -65.001 130.787 202.999 302.787C470.999 474.787 772.999 1090 1653.34 798.787"
                stroke="#A59B8F"
                strokeWidth="2"
                strokeDasharray="12 12"
              />
            </svg>
          </div>
          <div className="block md:hidden h-full w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="619"
              viewBox="0 0 350 619"
              fill="none"
            >
              <path
                d="M290 6.00038C347 -18 351.8 70.8004 223 86.0004C62.0002 105 30.0002 140 50.0002 172C70.0002 204 384 237 280 304C176 371 -24.9997 359 4.00031 440C33.0003 521 208 558 280 525C352 492 273 440 254 469C227.276 509.79 284 613 401 618"
                stroke="#A59B8F"
                strokeWidth="2"
                strokeDasharray="12 12"
              />
            </svg>
          </div>
          <div className="w-[144px] md:w-[376px] absolute right-5 top-[180px] md:left-0 md:top-[200px]">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[0].image.url
              }
              imageAlt={activities[0].image.alternativeText}
              text={activities[0].intro}
              rotate={activities[0].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[0].description}
            </p>
          </div>

          <div className="w-[144px] md:w-[376px] absolute left-5 top-[360px] md:left-1/2 md:-translate-x-1/2 md:-bottom-[100px]">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[2].image.url
              }
              imageAlt={activities[2].image.alternativeText}
              text={activities[2].intro}
              rotate={activities[2].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[1].description}
            </p>
          </div>

          <div className="w-[144px] md:w-[376px] absolute left-5 top-0 md:left-auto md:right-0 md:top-0">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[1].image.url
              }
              imageAlt={activities[1].image.alternativeText}
              text={activities[1].intro}
              rotate={activities[1].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[2].description}
            </p>
          </div>
        </div>

        <div className="w-full md:w-[1420px] h-[650px] md:h-[600px] relative mb-[100px]">
          <p className="text-[24px] md:text-[40px] font-pp-museum font-[500] text-primary-parchment absolute -top-[100px] right-5">
            ...and Luxury stays await you
          </p>
          <div className="hidden md:block w-[100vw] @min-[1420px]:w-full mr-[5vw]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 1920 429"
              fill="none"
            >
              <path
                d="M-131 220.726C-61.6667 132.726 229.512 -95.6373 613 140.726C855 289.883 1016.04 88.7547 925 39.8828C735 -62.1172 757 552.726 1193 404.726C1629 256.726 1613 -35.274 1933 4.72589"
                stroke="#A59B8F"
                strokeWidth="2"
                strokeDasharray="12 12"
              />
            </svg>
          </div>
          <div className="block md:hidden h-full w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="619"
              viewBox="0 0 293 448"
              fill="none"
            >
              <path
                d="M466.139 78.1502C437.115 41.2472 315.227 -54.5175 154.697 44.602C53.3945 107.151 -14.0159 22.8077 24.0922 2.31314C57.441 -1.12198 100.339 31.0078 5.13867 187.008C-11.8613 218.674 22.6 302.6 169 305C315.4 307.4 309.667 412.667 317 447"
                stroke="#A59B8F"
                strokeWidth="2"
                strokeDasharray="12 12"
              />
            </svg>
          </div>

          <div className="w-[144px] md:w-[376px] absolute right-5 top-0 md:left-0 md:top-0">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[3].image.url
              }
              imageAlt={activities[3].image.alternativeText}
              text={activities[3].intro}
              rotate={activities[3].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[3].description}
            </p>
          </div>

          <div className="w-[144px] md:w-[376px] absolute left-5 top-[180px] md:left-1/2 md:-translate-x-1/2 md:-bottom-[100px]">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[4].image.url
              }
              imageAlt={activities[4].image.alternativeText}
              text={activities[4].intro}
              rotate={activities[4].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[4].description}
            </p>
          </div>

          <div className="w-[144px] md:w-[376px] absolute right-5 top-[360px] md:right-0 md:top-0">
            <Polaroid
              imageSrc={
                process.env.NEXT_PUBLIC_STRAPI_URL + activities[5].image.url
              }
              imageAlt={activities[5].image.alternativeText}
              text={activities[5].intro}
              rotate={activities[5].title}
              className="w-[131px] md:w-[350px] h-auto"
              padding="p-[5px]"
            />
            <p className="text-[12px] md:text-[20px] font-pp-museum text-primary-parchment mt-5 text-center">
              {activities[5].description}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full relative h-auto bg-primary-parchment flex flex-col items-center justify-center">
        <img
          src="/images/bottom-bg-midnight.png"
          alt="Bottom background"
          className="w-full h-auto object-cover"
        />
        <div className="md:w-[700px] mt-[100px] mb-[200px]">
          <h2 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[1.2] text-center">
            Experience the South
          </h2>
          <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] text-center mb-10">
            Fill out the form to find out more, explore departure dates, and
            book your trip.
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
};

export default South;
