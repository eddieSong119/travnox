"use client";

import React, { useState } from "react";
import Image from "next/image";
import LargeGallery from "@/components/HomePage/LargeGallery";

const ActivityCard = ({ activity }) => {
  const imageData = activity.image;

  // 渲染列表的函数
  const renderList = (listData) => {
    if (!listData || !Array.isArray(listData)) return null;

    return (
      <ul className="mt-4 space-y-2">
        {listData.map((listItem, index) => {
          if (listItem.type === "list" && listItem.children) {
            return listItem.children.map((item, itemIndex) => (
              <li key={`${index}-${itemIndex}`} className="flex items-start">
                <span className="w-1 h-1 bg-primary-midnight rounded-full mt-2 mr-3 flex-shrink-0 mt-[11px]"></span>
                <span
                  className="text-start font-noto-sans text-[16px] font-[300] leading-[160%] text-primary-midnight"
                  style={{ letterSpacing: "-0.32px" }}
                >
                  {item.children?.[0]?.text || ""}
                </span>
              </li>
            ));
          }
          return null;
        })}
      </ul>
    );
  };

  return (
    <div
      key={activity.id}
      className="flex flex-col w-[calc(100vw-30px)] h-[700px] md:w-[460px] md:h-[609px] bg-primary-parchment rounded-[10px] flex-shrink-0"
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${imageData.url}`}
        alt={imageData.alternativeText}
        width={imageData.width}
        height={imageData.height}
        className="w-full h-auto object-cover rounded-t-[10px]"
      />
      <div className="pt-7 px-6">
        <span className="text-start font-noto-sans text-[14px] font-[500] tracking-[1.4px] text-primary-midnight mb-3">
          {activity.intro}
        </span>
        <h3 className="text-start font-pp-museum text-[24px] font-[300] leading-[100%] text-primary-midnight mb-4">
          {activity.title}
        </h3>
        <span className="text-start font-noto-sans text-[16px] font-[300] leading-[160%] text-primary-midnight">
          {activity.description}
        </span>
        {renderList(activity.points)}
      </div>
    </div>
  );
};

const Stays = ({ section }) => {
  const contentsTitles = section?.content?.map((content) => content.title);
  const activities = section?.content?.map((content) => {
    return {
      title: content.title,
      activities: content.activity,
    };
  });

  const [activeTitle, setActiveTitle] = useState(contentsTitles[0]);

  const handleTitleClick = (title) => {
    setActiveTitle(title);
  };

  // 为当前激活的活动组创建 LargeGallery 的 scrollElements
  const getCurrentScrollElements = () => {
    const currentActivityGroup = activities.find(
      (group) => group.title === activeTitle
    );
    if (!currentActivityGroup) return [];

    return currentActivityGroup.activities.map((activity) => (
      <div
        key={activity.id}
        className="w-[calc(100vw-30px)] h-[700px] md:w-[280px] md:h-[609px] flex-shrink-0"
      >
        <ActivityCard activity={activity} />
      </div>
    ));
  };

  return (
    <section
      className="w-full flex flex-col items-center min-h-[1800px] md:min-h-[2650px] w-screen"
      style={{
        backgroundImage: `url(/images/section_7_bg.svg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container pt-[148px] pb-[104px] flex flex-col items-center justify-center px-8">
        <h3 className="text-center font-noto-sans text-[14px] md:text-[16px] font-medium tracking-[1.6px] text-primary-midnight mb-8">
          {section?.intro}
        </h3>
        <h2 className="text-center font-pp-museum text-[32px] md:text-[60px] font-[500] leading-[100%] text-primary-midnight mb-4">
          {section?.title}
        </h2>
        <h3 className="text-center font-pp-museum text-[18px] md:text-[20px] font-[300] tracking-[1.6px] text-primary-midnight mb-8">
          {section?.description}
        </h3>
        <div className="container flex items-center md:justify-center justify-start gap-x-[17px] overflow-x-auto no-scrollbar">
          {contentsTitles.map((title, index) => (
            <button
              key={index}
              className={`py-2 px-5 rounded-full text-primary-midnight ${
                activeTitle === title
                  ? "bg-primary-stone"
                  : "border border-primary-midnight "
              }`}
              onClick={() => handleTitleClick(title)}
            >
              <span
                className={`text-[16px] font-noto-sans font-[500] leading-[160%] whitespace-nowrap`}
              >
                {title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 桌面端版本 */}
      <div className="md:block hidden">
        {activities.map((activityGroup) => {
          return (
            <div
              key={activityGroup.title}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-center ${
                activeTitle === activityGroup.title ? "block" : "hidden"
              }`}
            >
              {activityGroup.activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          );
        })}
      </div>

      {/* 移动端版本 - 使用 LargeGallery */}
      <div className="md:hidden block w-full pl-2">
        <LargeGallery
          scrollElements={getCurrentScrollElements()}
          enableInteractive={true}
          className="px-[12px] md:px-0"
        />
      </div>

      <div className="w-full flex justify-center mt-10 md:mt-[100px]">
        <button className="w-auto bg-primary-terracotta text-primary-parchment py-2 px-8 text-[16px] font-noto-sans font-[500] leading-[160%] rounded-full">
          START YOUR JOURNEY
        </button>
      </div>
    </section>
  );
};

export default Stays;
