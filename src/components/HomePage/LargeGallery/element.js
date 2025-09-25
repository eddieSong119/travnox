import List from "@/components/HomePage/List";
import Link from "next/link";
import CollapsibleContent from "./CollapsibleContent";

const GalleryElement = ({
  section,
  backgroundColor,
  textColor,
  img,
  largeImg,
  mobileImg,
  mobileLargeImg,
  ctaText,
  ctaDest,
}) => {
  const borderColor = textColor.replace("text-", "border-");

  return (
    <section
      key={section.id}
      className={`${backgroundColor} relative flex w-[calc(100vw-20px)] h-auto md:h-[890px] md:w-[1420px] rounded-lg`}
    >
      <div className="flex flex-col items-start justify-start">
        <div className="pt-8 px-6 md:pt-[60px] md:absolute md:max-w-[640px] md:left-[60px]">
          <h2
            className={`${textColor} font-pp-museum text-[24px] md:text-[48px] font-[500] mb-4 leading-[100%]`}
          >
            {section.title}
          </h2>
          <p
            className={`${textColor} font-pp-museum italic text-[20px] md:text-[32px] font-[500] leading-[100%] mb-8 md:mb-15`}
          >
            {section.description}
          </p>

          {section.content &&
            section.content.map((item) => {
              if (item.description_type === "list") {
                return (
                  <div key={item.id} className="flex flex-col mb-8 md:mb-15">
                    {/* 移动端折叠版本 - 客户端组件 */}
                    <CollapsibleContent item={item} textColor={textColor} />

                    {/* 桌面端正常版本 - 服务端组件 */}
                    <div className="hidden md:block">
                      <p
                        className={`${textColor} font-pp-museum text-[18px] md:text-[24px] font-[500] mb-4 leading-[100%]`}
                      >
                        {item.title}
                      </p>
                      <List
                        list={item.description.value}
                        textColor={textColor}
                      />
                    </div>
                  </div>
                );
              } else if (item.description_type === "text") {
                return (
                  <div key={item.id} className="flex flex-col mb-8 md:mb-15">
                    {/* 移动端折叠版本 - 客户端组件 */}
                    <CollapsibleContent item={item} textColor={textColor} />

                    {/* 桌面端正常版本 - 服务端组件 */}
                    <div className="hidden md:block">
                      <p
                        className={`${textColor} font-pp-museum text-[18px] md:text-[24px] font-[500] mb-4 leading-[100%]`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`${textColor} font-noto-sans text-[14px] md:text-[16px] font-[300] leading-[1.6]`}
                      >
                        {item.description.value}
                      </p>
                    </div>
                  </div>
                );
              }
            })}

          <button
            className={`${textColor} font-noto-sans text-[14px] font-[500] leading-[140%] py-2 px-4 hover:bg-primary-terracotta hover:text-primary-parchment transition-all duration-300 border ${borderColor} rounded-full w-full md:w-auto`}
          >
            <Link href={ctaDest}>{ctaText}</Link>
          </button>
        </div>

        <img
          src={mobileImg}
          srcSet={mobileLargeImg}
          className="w-full object-cover block md:hidden  min-h-[542px]"
          alt={section.title}
        />
      </div>

      <img
        src={img}
        srcSet={largeImg}
        className="h-full object-cover ml-auto hidden md:block"
        alt={section.title}
      />
    </section>
  );
};

export default GalleryElement;
