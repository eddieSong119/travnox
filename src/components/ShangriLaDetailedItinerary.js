"use client";

import Image from "next/image";
import { splitSentences } from "@/lib/splitSentences";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDayTitle = (day, title) => {
  const dayNum = String(day ?? "").padStart(2, "0");
  return `DAY ${dayNum}: ${title}`;
};

const collectListItems = (item) => {
  const points = [];

  item.activities?.forEach((activity) => {
    if (!activity.description) return;
    splitSentences(activity.description).forEach((point) => {
      points.push(point);
    });
  });

  if (item.meals) {
    const { meals } = item;
    const mealText = [
      meals.breakfast &&
        `${capitalizeFirstLetter(meals.breakfast)} (Breakfast)`,
      meals.lunch && `${capitalizeFirstLetter(meals.lunch)} (Lunch)`,
      meals.dinner && `${capitalizeFirstLetter(meals.dinner)} (Dinner)`,
    ]
      .filter(Boolean)
      .join(", ");

    if (mealText) {
      points.push(`Meals: ${mealText}`);
    }
  }

  if (item.hotel) {
    points.push(`Hotel: ${item.hotel}`);
  }

  return points;
};

const ItineraryDayImage = ({ dayImageSrc, dayImageAlt, day }) => (
  <div className="relative mt-4 w-full shrink-0 overflow-hidden rounded-[10px] aspect-[16/10] md:mt-0 md:aspect-auto md:h-auto md:min-h-[280px] md:w-[42%] md:max-w-[560px] lg:min-h-[320px]">
    <Image
      src={dayImageSrc}
      alt={dayImageAlt || `Day ${day}`}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 90vw, 560px"
      unoptimized
    />
  </div>
);

const ItineraryList = ({ listItems, textColor }) => {
  if (!listItems.length) return null;

  return (
    <ul className="flex flex-col gap-2 list-none pl-0 md:flex-1 md:min-w-0">
      {listItems.map((point, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="mt-3 h-1 w-1 shrink-0 rounded-full bg-primary-terracotta" />
          <span
            className={`${textColor} font-noto-sans text-[14px] font-[300] leading-[1.6] md:text-[16px]`}
          >
            {point.endsWith(".") ? point : `${point}.`}
          </span>
        </li>
      ))}
    </ul>
  );
};

const ShangriLaDetailedItinerary = ({
  item,
  dayImageSrc,
  dayImageAlt,
  textColor,
  className = "md:hidden content-dropdown",
  titleFont = "font-noto-sans text-[16px] leading-[1.6]",
  titleMargin = "",
}) => {
  const { day, title } = item;
  const listItems = collectListItems(item);

  return (
    <div className={`w-full ${className}`}>
      <input
        type="checkbox"
        id={`shangri-la-itinerary-toggle-${day}`}
        className="content-toggle hidden"
      />
      <label
        htmlFor={`shangri-la-itinerary-toggle-${day}`}
        className={`${textColor} ${titleFont} font-[500] ${titleMargin} cursor-pointer flex items-center justify-between`}
      >
        <span>{formatDayTitle(day, title)}</span>
        <svg
          className="content-arrow h-5 w-5 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </label>
      <div className="content-submenu max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
        {(listItems.length > 0 || dayImageSrc) && (
          <div className="mt-4 flex w-full flex-col gap-4 md:flex-row md:items-stretch md:gap-10">
            <ItineraryList listItems={listItems} textColor={textColor} />
            {dayImageSrc && (
              <ItineraryDayImage
                dayImageSrc={dayImageSrc}
                dayImageAlt={dayImageAlt}
                day={day}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShangriLaDetailedItinerary;
