import Polaroid from "@/components/Polaroid";
import LargeGallery from "@/components/HomePage/LargeGallery";

const values = [
  <div
    key={1}
    className="flex flex-col items-center justify-center w-full md:w-[300px] flex-shrink-0"
  >
    <Polaroid
      imageSrc="/images/about-pic-1.png"
      imgAlt="New friends <3"
      rotate={2}
      text="New friends <3"
      className="w-[260px] mb-6"
    />
    <p className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300]">
      Connection
    </p>
    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] text-center leading-[1.6] tracking-[1.6px]">
      Travel is about the people you meet, not the stamps you collect.
    </p>
  </div>,
  <div
    key={2}
    className="flex flex-col items-center justify-center w-full md:w-[300px] flex-shrink-0"
  >
    <Polaroid
      imageSrc="/images/about-pic-2.png"
      imgAlt="Siguniang Mountain AKA the Four Sisters"
      rotate={2}
      text="Siguniang Mountain AKA the Four Sisters"
      className="w-[260px] mb-6"
    />
    <p className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300]">
      Storytelling
    </p>
    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] text-center leading-[1.6] tracking-[1.6px]">
      A landmark is memorable, but a story makes it meaningful.
    </p>
  </div>,
  <div
    key={3}
    className="flex flex-col items-center justify-center w-full md:w-[300px] flex-shrink-0"
  >
    <Polaroid
      imageSrc="/images/about-pic-3.png"
      imgAlt="Shanghai Skyline"
      rotate={-2}
      text="Shanghai Skyline"
      className="w-[260px] mb-6"
    />
    <p className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300]">
      Authenticity
    </p>
    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] text-center leading-[1.6] tracking-[1.6px]">
      Every experience is rooted in real culture, not staged performances.
    </p>
  </div>,
  <div
    key={4}
    className="flex flex-col items-center justify-center w-full md:w-[300px] flex-shrink-0"
  >
    <Polaroid
      imageSrc="/images/about-pic-4.png"
      imgAlt="Sofitel, Shanghai"
      rotate={3}
      text="Sofitel, Shanghai"
      className="w-[260px] mb-6"
    />
    <p className="text-primary-midnight font-pp-museum text-[20px] md:text-[24px] font-[300]">
      Elegance
    </p>
    <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] text-center leading-[1.6] tracking-[1.6px]">
      Seamless service and refined touches make journeys effortless.
    </p>
  </div>,
];

const OurStory = () => {
  return (
    <div>
      <section className="h-auto min-h-[100vh] px-[10vw] py-[5vh] md:py-0 bg-primary-parchment flex flex-col md:flex-row items-center justify-center md:gap-x-10">
        <Polaroid
          rotate={3}
          text="Karl Hong, founder"
          className="block md:hidden w-[70%] mb-20"
        />
        <div className="flex flex-col gap-y-4 md:max-w-[820px] md:mb-0 mb-40">
          <h2 className="text-primary-midnight font-noto-sans text-[14px] md:text-[16px] font-[500] leading-[1.6] tracking-[1.6px]">
            OUR STORY
          </h2>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[60px] font-[500] leading-[100%]">
            We see travel as a way to shift perspective, and build connection
            across borders.
          </h1>
          <p className="text-primary-midnight italic font-pp-museum text-[18px] md:text-[20px] font-[500] leading-[1.6] tracking-[1.6px]">
            “No bias. No borders. Just stories waiting to be shared.” - Karl
            Hong, founder
          </p>
          <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]">
            Karl has journeyed across Asia, Europe, and beyond—not collecting
            stamps, but stories and connections to share. For him, travel has
            never been about sightseeing. It has always been about people: the
            moments when stories are exchanged, barriers fall away, and the
            right guide reveals the soul of a place.
          </p>
          <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]">
            With TravNox, Karl transforms this philosophy into a travel company
            built on empathy, openness, and human connection. Each journey is
            designed as an energy exchange—where travelers don’t just see China,
            but feel its rhythm through the people who live it.
          </p>
        </div>
        <Polaroid
          rotate={3}
          text="Karl Hong, founder"
          className="md:w-full md:max-w-[450px] md:h-auto hidden md:block"
        />
      </section>

      <section className="w-full h-auto bg-primary-steel flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-y-4 px-[10vw] md:px-0 py-[10vh] w-full md:max-w-[820px]">
          <h3 className="text-primary-midnight font-noto-sans text-[14px] md:text-[16px] font-[500] leading-[1.6] tracking-[1.6px] text-center">
            WHY TRAVNOX?
          </h3>
          <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%] text-center">
            We understand what it means to belong in more than one world.
          </h2>
          <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] text-center">
            China is often seen through the lens of headlines, clichés, or
            fleeting impressions. TravNox exists to bridge the gap between
            perception and reality, offering journeys that reveal the country’s
            cultural depth, diversity, and humanity. Through carefully curated
            cultural encounters, elevated comforts, and thoughtful storytelling,
            we connect the culturally curious with authentic Chinese people,
            places, and traditions.
          </p>
          <p className="text-primary-midnight font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] text-center">
            TravNox brings together deep cultural knowledge, premium hospitality
            partners, and years of guiding global travellers. Our collaborations
            with leading hotels, airlines, and licensed local experts ensure
            that every journey is not only meaningful, but also delivered to the
            highest standard of luxury and care.
          </p>
        </div>

        <div
          className="w-full h-auto relative -mt-[100px] z-[5]"
          style={{
            backgroundImage: "url('/images/contact-bg@1x.png')",
            backgroundSize: "100% 100.1%",
            backgroundPosition: "0px -0.558px",
            backgroundRepeat: "no-repeat",
            backgroundColor: "lightgray",
            mixBlendMode: "darken",
            aspectRatio: "16/9",
          }}
        />

        <div className="w-full h-auto flex flex-col items-center justify-center">
          <h3 className="text-primary-midnight font-noto-sans text-[14px] md:text-[16px] font-[500] leading-[1.6] tracking-[1.6px]">
            OUR VALUES
          </h3>
          <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%] md:mb-20">
            What guides our path...
          </h2>
          <div className="hidden md:flex flex-col md:flex-row md:max-w-[100vw] md:overflow-x-scroll no-scrollbar items-center justify-start gap-x-10 pl-4">
            {values.map((value) => value)}
          </div>

          <div className="md:hidden block w-full h-auto">
            <LargeGallery
              scrollElements={values}
              className="pt-10"
              slideClassName="w-full px-[10vw] pb-[80px] pt-[20px]"
            />
          </div>
        </div>
      </section>

      <section className="w-full relative h-auto bg-primary-parchment flex flex-col items-center justify-center">
        <img
          src="/images/contact-bg2.png"
          alt="Bottom background"
          className="w-full h-auto object-cover"
        />

        <div className="md:absolute md:top-[1/3] pt-20 px-[10vw] flex flex-col items-center justify-center">
          <h2 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[100%] text-center md:max-w-[640px] mb-6">
            We believe every journey is a chance to see the world anew.
          </h2>
          <p className="text-primary-midnight font-pp-museum text-[18px] md:text-[20px] font-[300] leading-[1.6] text-center md:max-w-[540px] mb-6">
            To walk away not only with memories, but with stories that stay with
            you, and perspectives that change you.
          </p>

          <button className="bg-primary-terracotta text-primary-parchment px-7 py-3 rounded-full font-noto-sans text-[14px] md:text-[16px] font-[500] text-center md:max-w-[540px]">
            START YOUR JOURNEY
          </button>
        </div>
        <img
          src="/images/about-bg-2@1x.png"
          srcSet="/images/about-bg-2@2x.png 2x"
          alt="Bottom background"
          className="w-full h-auto object-cover md:block hidden"
        />

        <img
          src="/images/about-bg-2-mobile@1x.png"
          srcSet="/images/about-bg-2-mobile@2x.png 2x"
          alt="Bottom background"
          className="w-full h-auto object-cover md:hidden"
        />
      </section>
    </div>
  );
};

export default OurStory;
