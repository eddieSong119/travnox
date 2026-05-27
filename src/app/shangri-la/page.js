import strapiService from "@/lib/strapiService";
import Image from "next/image";
import ShangriLaDetailedItinerary from "@/components/ShangriLaDetailedItinerary";
import LargeGallery from "@/components/HomePage/LargeGallery";
import Inclusions from "./inclusions";
import faqList from "./faq";
import FaqAccordion from "@/components/FaqAccordion";
import WeTravelForm from "@/components/WeTravelForm";
import { WhatsAppButton } from "@/components/WhtsAppButton";

const getActivityImageSrc = (image) => {
  if (!image?.url) return null;
  return image.url.startsWith("http")
    ? image.url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`;
};

const isDayNumberActivity = (activity) =>
  /^\d+$/.test(String(activity?.title ?? "").trim());

const isTopImageActivity = (activity) =>
  activity?.title && activity?.title.startsWith("top-");

const isStaysActivity = (activity) => activity?.intro.startsWith("stays-");

const isFamilyActivity = (activity) => activity?.intro.startsWith("family-");

const isDesktopStaysActivity = (activity) =>
  activity?.intro.startsWith("desktop-stays-");

const isDesktopFamilyActivity = (activity) =>
  activity?.intro.startsWith("desktop-family-");

const partitionActivities = (activities = []) => {
  const highlightActivities = [];
  const dayImageByDay = new Map();
  const topImagesByOrder = [];
  const stays = [];
  const families = [];
  const desktopStays = [];
  const desktopFamilies = [];

  activities.forEach((activity) => {
    if (isDayNumberActivity(activity)) {
      dayImageByDay.set(parseInt(activity.title, 10), activity);
    } else if (isTopImageActivity(activity)) {
      topImagesByOrder.push(activity);
    } else if (isStaysActivity(activity)) {
      stays.push(activity);
    } else if (isFamilyActivity(activity)) {
      families.push(activity);
    } else if (isDesktopStaysActivity(activity)) {
      desktopStays.push(activity);
    } else if (isDesktopFamilyActivity(activity)) {
      desktopFamilies.push(activity);
    } else {
      highlightActivities.push(activity);
    }
  });

  return {
    highlightActivities,
    dayImageByDay,
    topImagesByOrder,
    stays,
    families,
    desktopStays,
    desktopFamilies,
  };
};

const getDayImageForItineraryItem = (item, dayImageByDay) => {
  const day = Number(item?.day);
  if (Number.isNaN(day)) return null;
  return dayImageByDay.get(day) ?? null;
};

const ActivityHighlightCardMobile = ({ activity, imageSrc, image }) => (
  <div className="flex flex-col w-[calc(100vw-30px)] bg-primary-steel rounded-[10px] overflow-hidden md:hidden">
    {imageSrc && (
      <Image
        src={imageSrc}
        alt={image.alternativeText || activity.intro || "Activity"}
        width={image.width || 460}
        height={image.height || 300}
        className="w-full h-auto object-cover"
        unoptimized
      />
    )}
    <div className="flex flex-col gap-3 px-6 py-7">
      <p className="font-pp-museum text-[20px] font-[400] text-primary-midnight">
        {activity.intro}
      </p>
      <p className="font-noto-sans text-[16px] font-[300] leading-[1.8] text-primary-midnight">
        {activity.description}
      </p>
    </div>
  </div>
);

const ActivityHighlightCardDesktop = ({ activity, imageSrc, image }) => (
  <div
    className="relative hidden md:block overflow-hidden flex-shrink-0"
    style={{ width: "700px", height: "522px", borderRadius: "10px" }}
  >
    {imageSrc && (
      <Image
        src={imageSrc}
        alt={image.alternativeText || activity.intro || "Activity"}
        fill
        className="object-cover"
        unoptimized
      />
    )}
    <div className="absolute top-0 left-0 z-10 flex max-w-[85%] flex-col gap-3 p-8">
      <p className="font-pp-museum text-[28px] font-[400] text-primary-parchment">
        {activity.intro}
      </p>
      <p className="font-noto-sans text-[16px] font-[300] leading-[1.8] text-primary-parchment">
        {activity.description}
      </p>
    </div>
  </div>
);

const ActivityHighlightCard = ({ activity }) => {
  const image = activity.image;
  const imageSrc = getActivityImageSrc(image);

  return (
    <article className="flex-shrink-0">
      <ActivityHighlightCardMobile
        activity={activity}
        imageSrc={imageSrc}
        image={image}
      />
      <ActivityHighlightCardDesktop
        activity={activity}
        imageSrc={imageSrc}
        image={image}
      />
    </article>
  );
};

const ScrollElements = (activities = []) =>
  activities.map((activity) => (
    <ActivityHighlightCard key={activity.id} activity={activity} />
  ));

const TopImageElement = (activities = []) => {
  return activities.map((activity) => {
    const image = activity?.image;
    const imageSrc = image?.url;

    return (
      <div key={activity?.title} className="flex flex-col w-[100vw] h-[380px] overflow-hidden">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={image.alternativeText || activity.intro || "Activity"}
            width={image.width || 460}
            height={image.height || 300}
            className="w-full h-auto object-cover"
            unoptimized
          />
        )}
      </div>
    );
  });
};

const StaysAndFamiliesImage = ({ activity, width = "100%", height = "" }) => {
  const element = activity.activity || activity;

  return (
    <div
      className="relative rounded-lg overflow-hidden mb-3"
      style={{
        width,
        height,
      }}
    >
      <img
        src={element.image?.url}
        alt={element?.intro}
        className="w-full h-full object-cover"
      />

      {element.title && (
        <p className="absolute bottom-3 left-3 text-white font-pp-museum text-[16px] font-[300] z-10">
          {element.title}
        </p>
      )}
    </div>
  );
};

export const metadata = {
  title: "Journey to The Shangri-la",
  description:
    "Yunnan is one of China's most diverse regions, where snow-capped mountains, ancient towns, and tropical landscapes can be found within a single journey.",
};

async function getYunnanData() {
  const data = await strapiService.fetchEndpoint("journeys");
  const yunnanPage = data.data.find((item) => {
    return item.page.some((page) => page.title === "yunnan");
  });
  return yunnanPage.page.find(
    (page) => page.__component === "components.section",
  );
}

const Yunnan = async () => {
  const pageData = await getYunnanData();
  const { title, intro, long_description, content } = pageData;
  const routeContent = content[0];
  const routeTitle = routeContent.title;
  const detailedItinerary = routeContent.description.detailedItinerary;
  const activities = routeContent.activity ?? [];
  const {
    highlightActivities,
    dayImageByDay,
    topImagesByOrder,
    stays,
    families,
    desktopStays,
    desktopFamilies,
  } = partitionActivities(activities);

  return (
    <main className="md:min-w-[1420px] @container bg-primary-parchment">
      <section className="hidden md:block w-full min-h-[1000px] md:min-h-[100vh] relative md:flex md:justify-center  @min-[1420px]:px-[5vw]">
        <Image
          src="/images/north-bg-mobile@1x.png"
          srcSet="/images/north-bg-mobile@1x.png 1x, /images/north-bg-mobile@2x.png 2x"
          alt="Background"
          fill
          className="object-cover md:hidden"
          sizes="100vw"
        />

        <Image
          src="/images/yunnan-bg@1x.png"
          srcSet="/images/yunnan-bg@1x.png 1x, /images/yunnan-bg@2x.png 2x"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          sizes="100vw"
          quality={100}
        />

        <div className="px-[5vw] md:w-[1420px] md:px-0 md:flex md:justify-start md:items-start">
          <div className="relative z-10 flex flex-col items-start justify-center px-[5vw] pt-[80px] md:max-w-[700px] md:pt-[150px] md:px-0">
            <h2 className="text-primary-midnight font-noto-sans text-[14px] md:text-[16px] font-[500] leading-[1.6] mb-5">
              {intro}
            </h2>
            <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[60px] font-[500]">
              {title}
            </h1>

            <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] my-4">
              {long_description[0].children[0].text}
            </p>

            <p className="text-primary-midnight font-pp-museum md:text-[20px] font-[400] leading-[1.6]">
              Small-group | Curated | Beyond standard tours
            </p>

            <WhatsAppButton />
          </div>
        </div>
      </section>

      <LargeGallery
        scrollElements={TopImageElement(topImagesByOrder)}
        className="md:pl-0 mb-[50px] md:mb-[100px] md:hidden"
        slideClassName="md:pb-[100px]"
      />

      <section className="w-full h-full bg-primary-parchment md:flex md:justify-center pb-[10vh]  @min-[1420px]:px-[5vw]">
        <div className="md:w-[1420px] px-[5vw] md:px-0">
          <div className="w-full h-auto flex flex-col md:flex-row justify-between items-start pt-8 md:pt-[10vh] gap-15">
            <div className="h-full flex flex-col justify-start items-start w-full">
              <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%]">
                {routeTitle}
              </h2>

              <div className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300] leading-[1.6] my-4">
                <p className="mb-4">
                  Yunnan is one of China&apos;s most diverse regions, where
                  snow-capped mountains, ancient towns, and tropical landscapes
                  can be found within a single journey.
                </p>
                <p>
                  From the highlands of Lijiang to the tropical atmosphere of
                  Xishuangbanna, experience a side of China most travellers
                  never reach.
                </p>
              </div>

              <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4 mt-8 md:mt-28">
                <div className="flex flex-col justify-start items-start gap-4 md:w-1/2">
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.4987 2.97925H16.4987V0.916748H18.332V2.97925H20.8529V20.8542H1.14453V2.97925H3.66536V0.916748H5.4987V2.97925ZM8.91695 7.57633L14.1456 5.48358L14.8267 7.18491L12.5625 8.09241L12.7761 10.3749L10.9519 10.5454L10.7869 8.80192L8.74736 9.61866L7.89578 9.95966L7.55478 9.109L6.85445 7.35817L8.5567 6.67708L8.91695 7.57633ZM9.6237 14.4376H4.1237V13.0626H9.6237V14.4376ZM4.1237 18.1042H9.6237V16.7292H4.1237V18.1042ZM17.8737 14.4376H12.3737V13.0626H17.8737V14.4376ZM12.3737 18.1042H17.8737V16.7292H12.3737V18.1042Z"
                          fill="#262B2F"
                        />
                      </svg>

                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        TRAVEL PERIOD
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      May - July 2026 - flexible dates upon request
                    </p>
                  </div>
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
                      Sydney and Melbourne International Airport
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-4 md:w-1/2">
                  <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.0833 0C4.51446 0 0 4.51446 0 10.0833C0 15.6522 4.51446 20.1667 10.0833 20.1667C15.6522 20.1667 20.1667 15.6522 20.1667 10.0833C20.1667 4.51446 15.6522 0 10.0833 0ZM3.54224 7.88399C3.54224 6.31422 4.81479 5.04167 6.38456 5.04167C7.95434 5.04167 9.22689 6.31422 9.22689 7.88399C9.22689 9.45377 7.95434 10.7263 6.38456 10.7263C4.81479 10.7263 3.54224 9.45377 3.54224 7.88399ZM13.9792 7.53385C12.5869 7.53385 11.4583 8.6625 11.4583 10.0547C11.4583 11.4469 12.5869 12.5756 13.9792 12.5756C15.3714 12.5756 16.5 11.4469 16.5 10.0547C16.5 8.6625 15.3714 7.53385 13.9792 7.53385ZM13.3121 14.333C14.5151 14.333 15.6634 14.5677 16.7135 14.9937C15.5359 16.581 13.8019 17.7308 11.7999 18.1545V14.4588C12.2916 14.3761 12.7968 14.333 13.3121 14.333ZM10.4249 13.183V18.3264C10.3116 18.331 10.1977 18.3333 10.0833 18.3333C6.5374 18.3333 3.51396 16.0962 2.34739 12.9564C3.51437 12.4807 4.79116 12.2185 6.12917 12.2185C7.66644 12.2185 9.12285 12.5646 10.4249 13.183Z"
                          fill="#262B2F"
                        />
                      </svg>

                      <p className="text-primary-midnight font-noto-sans text-[16px] font-[500] leading-[1.6]">
                        GROUP SIZE
                      </p>
                    </div>

                    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                      Small group experience, limited to 12 travellers per
                      departure. Private tours available for groups travelling
                      together
                    </p>
                  </div>
                </div>
              </div>

              <WhatsAppButton />
            </div>

            <div className="h-full hidden md:block">
              <img
                src="/images/yunnan-map.png"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="hidden md:flex mt-15 md:mt-30 w-full items-center justify-center gap-5">
            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_794_370)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.33398 30.6664H30.6673V27.9997H1.33398V30.6664Z"
                    fill="#262B2F"
                  />
                  <path
                    d="M19.3462 6.83337C23.004 5.1602 27.3257 6.76908 28.9988 10.427L29.5038 11.5308L22.059 14.9363L20.9307 23.4613L16.5153 25.481L15.1415 18.1005L7.42672 21.6293L2.37744 10.5908L5.68941 9.07583L10.0004 12.4432L19.3462 6.83337Z"
                    fill="#262B2F"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_794_370">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Return international flights
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                From Australia to China
              </p>
            </div>

            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                width="30"
                height="31"
                viewBox="0 0 30 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.1667 15.125C14.1667 23.4781 21.1437 30.25 29.75 30.25V24.4062C27.2139 24.4062 24.7816 23.4284 22.9883 21.6878C21.195 19.9473 20.1875 17.5865 20.1875 15.125C20.1875 12.6635 21.195 10.3027 22.9883 8.56217C24.7816 6.82159 27.2139 5.84375 29.75 5.84375V0C21.1437 0 14.1667 6.77188 14.1667 15.125ZM22.3125 15.125C22.3125 11.1375 25.6417 7.90625 29.75 7.90625V22.3438C27.7775 22.3438 25.8857 21.5832 24.4909 20.2294C23.0961 18.8756 22.3125 17.0395 22.3125 15.125ZM0 1.375V8.9375C0.000125089 10.2789 0.449166 11.5839 1.27953 12.6562C2.1099 13.7285 3.27665 14.51 4.60417 14.883V28.875H8.14583V14.883C9.47335 14.51 10.6401 13.7285 11.4705 12.6562C12.3008 11.5839 12.7499 10.2789 12.75 8.9375V1.375H9.91667V7.5625H7.79167V1.375H4.95833V7.5625H2.83333V1.375H0Z"
                  fill="#262B2F"
                />
              </svg>
              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Selected meals
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                16 curated local dining experiences
              </p>
            </div>

            <div className="flex flex-col items-start justify-start bg-primary-steel p-6 rounded-[10px] w-full">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.2362 10.2215L14.7294 0L10.2227 10.2223L0 14.7288L10.2227 19.2352L14.7296 29.4577L19.2362 19.2344L29.4589 14.728L19.2362 10.2215Z"
                  fill="#262B2F"
                />
              </svg>

              <p className="text-primary-midnight font-pp-museum text-[24px] font-[300] leading-[1.6] mt-15">
                Premium experience
              </p>
              <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6]">
                Wellness woven into the journey
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

      <section className="w-full h-full bg-primary-parchment flex flex-col md:justify-center md:items-center  @min-[1420px]:px-[5vw]">
        <div className="md:w-[1420px] px-[5vw] md:px-0 mb-8">
          <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%]">
            Journey Highlights
          </h2>
        </div>
      </section>

      <LargeGallery
        scrollElements={ScrollElements(highlightActivities)}
        className="px-[10px] md:pl-0 mb-[50px] md:mb-[100px]"
        slideClassName="md:pb-[100px]"
      />

      <Inclusions />

      <section className="w-full relative h-auto bg-primary-parchment flex flex-col items-center justify-center">
        <div className="w-full mt-[100px] px-[5vw] md:px-[5vw] @min-[1420px]:px-[5vw]">
          <h2 className="text-primary-midnight font-pp-museum text-[28px] md:text-[40px] font-[500] mb-6 leading-[1.2] text-start md:text-center">
            Your Itinerary
          </h2>
          <div className="h-full md:hidden">
            <img
              src="/images/yunnan-map.png"
              className="object-cover w-full h-full"
            />
          </div>
          {detailedItinerary && detailedItinerary.length > 0 && (
            <div className="mx-auto mb-[80px] w-full max-w-[1420px] flex flex-col justify-center items-center">
              <div className="flex w-full md:w-1/2 flex-col gap-0">
                {detailedItinerary.map((item, index) => {
                  const dayActivity = getDayImageForItineraryItem(
                    item,
                    dayImageByDay,
                  );
                  const dayImage = dayActivity?.image;

                  return (
                    <ShangriLaDetailedItinerary
                      key={item.day || index}
                      item={item}
                      dayImageSrc={getActivityImageSrc(dayImage)}
                      dayImageAlt={
                        dayImage?.alternativeText || `Day ${item.day} itinerary`
                      }
                      textColor="text-primary-midnight"
                      className={`py-5 ${
                        index !== 0
                          ? "border-b border-primary-stone"
                          : "border-t border-b border-primary-stone"
                      }`}
                      titleFont="text-[16px] font-noto-sans leading-[1.6]"
                      titleMargin=""
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="w-full relative h-auto bg-[#DBE6E1] flex flex-col items-center justify-center">
        <div className="md:w-[1420px] mt-[100px] mb-[50px] px-[5vw] flex flex-col items-center">
          <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%] mb-15 text-center">
            Stays and flavours to remember
          </h2>
          <p className="max-w-[720px] font-pp-museum text-[16px] md:text-[20px] leading-[140%] font-[300] text-center">
            Stay across a curated mix of premium hotels and distinctive local
            properties — from scenic mountain stays to boutique hotels in
            ancient towns.
          </p>

          <div className="my-10 md:my-20 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <p className="font-pp-museum text-[16px] md:text-[20px] leading-[140%] font-[300] mb-5 text-center">
            Selected accommodation includes spa and hot spring facilities,
            offering time to rest and reset between travel days.
          </p>

          <div className={"md:hidden"}>
            {stays.map((stayActivity) => (
              <StaysAndFamiliesImage
                activity={stayActivity}
                key={stayActivity.intro}
              />
            ))}
          </div>

          <div className="hidden md:flex flex-col w-full">
            <div className="flex gap-x-2">
              <StaysAndFamiliesImage
                activity={desktopStays[0]}
                width="1060"
                height="408"
              />
              <StaysAndFamiliesImage
                activity={desktopStays[1]}
                width="340"
                height="408"
              />
            </div>
            <div className="flex gap-x-2">
              <div className="flex-col">
                <StaysAndFamiliesImage
                  activity={desktopStays[2]}
                  width="700"
                  height="593"
                />
                <StaysAndFamiliesImage
                  activity={desktopStays[3]}
                  width="700"
                  height="408"
                />
              </div>
              <div className="flex-col">
                <StaysAndFamiliesImage
                  activity={desktopStays[4]}
                  width="700"
                  height="445"
                />
                <StaysAndFamiliesImage
                  activity={desktopStays[5]}
                  width="700"
                  height="556"
                />
              </div>
            </div>
            <div className="flex gap-x-2">
              <StaysAndFamiliesImage
                activity={desktopStays[6]}
                width="940"
                height="408"
              />
              <StaysAndFamiliesImage
                activity={desktopStays[7]}
                width="460"
                height="408"
              />
            </div>
            <StaysAndFamiliesImage
              activity={desktopStays[8]}
              width="1420"
              height="513"
            />
          </div>

          <div className="my-10 md:my-20 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <div className={"md:hidden"}>
            {families.map((familyActivity) => (
              <StaysAndFamiliesImage
                activity={familyActivity}
                key={familyActivity.intro}
              />
            ))}
          </div>

          <div className="hidden md:flex flex-col">
            <div className="flex gap-x-2">
              <StaysAndFamiliesImage
                activity={desktopFamilies[0]}
                width="820"
                height="408"
              />
              <StaysAndFamiliesImage
                activity={desktopFamilies[1]}
                width="580"
                height="408"
              />
            </div>
            <div className="flex gap-x-2">
              <StaysAndFamiliesImage
                activity={desktopFamilies[2]}
                width="580"
                height="408"
              />
              <StaysAndFamiliesImage
                activity={desktopFamilies[3]}
                width="820"
                height="408"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative h-auto bg-primary-parchment flex flex-col items-center justify-center">
        <div className="w-full mt-[100px] mb-[50px] px-[5vw]">
          <h2 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[1.2] text-center">
            Departure dates
          </h2>
          <div className="my-10 md:my-20 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />
          <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] text-center mb-10">
            Contact To Customize
          </p>
        </div>
      </section>

      <section className="w-full relative h-auto bg-primary-midnight text-primary-parchment flex flex-col items-center justify-center">
        <div className="md:w-[700px] mt-[100px] mb-[50px] px-[5vw] text-[16px]">
          <h3 className="font-noto-sans font-[400] leading-[180%] font-[500] text-[14px] mb-5">
            LAUNCH OFFER - ENDS JULY 2026
          </h3>
          <h2 className="font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[1.2]">
            From $5,480 p/person
          </h2>
          <p className="font-noto-sans font-[400] leading-[180%]">
            Children under 12 (no bed): $2,980 p/person
          </p>

          <div className="my-10 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <p className=" font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] mb-10">
            DEPOSIT
          </p>
          <p className="font-noto-sans font-[400] leading-[180%]">
            A $1,650 inc. GST deposit is required to secure your spot. This
            secures your spot, and is allocated towards your flights and
            accommodation.
          </p>

          <div className="my-10 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <p className=" font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] mb-10">
            PAYMENT TERMS
          </p>
          <p className="font-noto-sans font-[400] leading-[180%]">
            The remaining balance must be paid within 7 days of the flight
            tickets being issued.
          </p>

          <div className="my-10 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <p className=" font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] mb-10">
            FLEXIBILITY
          </p>
          <p className="font-noto-sans font-[400] leading-[180%]">
            If your plans change, your booking can be moved to a future TravNox
            departure within 24 months. We aim to keep things flexible wherever
            possible.
          </p>

          <div className="my-10 md:my-20 h-[1px] w-full shrink-0 rounded-full bg-primary-terracotta" />

          <WeTravelForm />
        </div>
      </section>

      <section className="w-full relative h-auto bg-primary-parchment flex flex-col items-center justify-center">
        <div className="md:w-[1400px] w-full mt-[100px] mb-[50px] px-[5vw]">
          <h3 className="text-primary-midnight font-noto-sans text-[14px] mb-10">
            FAQ
          </h3>
          <h2 className="text-primary-midnight font-pp-museum text-[24px] md:text-[48px] font-[500] mb-8 leading-[1.2]">
            Things to know
          </h2>
          <FaqAccordion items={faqList} textColor="text-primary-midnight" />
        </div>
      </section>

      <section className="w-full min-h-[1000px] md:min-h-[100vh] relative md:flex md:justify-center  @min-[1420px]:px-[5vw]">
        <Image
          src="/images/bottom-bg@1x.png"
          srcSet="/images/bottom-bg@1x.png 1x, /images/bottom-bge@2x.png 2x"
          alt="Background"
          fill
          className="object-cover md:hidden"
          sizes="100vw"
        />

        <Image
          src="/images/bottom-bg-desktop@1x.png"
          srcSet="/images/bottom-bg-desktop@1x.png 1x, /images/bottom-bg-desktop@2x.png 2x"
          alt="Background"
          fill
          className="object-cover hidden md:block"
          sizes="100vw"
          quality={100}
        />

        <div className="px-[5vw] w-full md:px-0 md:flex justify-start items-start">
          <div className="text-[#262B2F] relative z-10 flex flex-col items-center justify-start px-[5vw] pt-[80px] w-full md:pt-[150px] md:px-0">
            <h2 className="font-pp-museum text-[28px] md:text-[48px] font-[500] mb-8 leading-[1.2] text-center">
              Rethinking how China should be experienced
            </h2>

            <div className="flex flex-col mt-10 gap-y-10 md:flex-row items-center justify-center w-full md:gap-x-5">
              <p className="font-pp-museum text-[20px] md:text-[28px] font-[400] leading-[1.4] text-center w-[248px] md:w-[328px]">
                Built in Australia, for Australian travellers
              </p>
              <p className="font-pp-museum text-[20px] md:text-[28px] font-[400] leading-[1.4] text-center w-[248px] md:w-[328px]">
                Journeys shaped by an international team
              </p>
              <p className="font-pp-museum text-[20px] md:text-[28px] font-[400] leading-[1.4] text-center w-[248px] md:w-[328px]">
                Small-group journeys with authentic experiences
              </p>
              <p className="font-pp-museum text-[20px] md:text-[28px] font-[400] leading-[1.4] text-center w-[248px] md:w-[328px]">
                We take care — the whole way through
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Yunnan;
