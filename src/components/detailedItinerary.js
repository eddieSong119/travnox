"use client";

import { splitSentences } from "@/lib/splitSentences";

const DetailedItinerary = ({
  item,
  textColor,
  className = "md:hidden content-dropdown",
  titleFont = "font-pp-museum text-[24px] leading-[100%]",
  titleMargin = "mb-4",
}) => {
  const { day, title, activities, meals, hotel } = item;

  // 时间段标签映射
  const timePeriodLabels = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
  };

  // 首字母大写函数
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={className}>
      <input
        type="checkbox"
        id={`itinerary-toggle-${day}`}
        className="content-toggle hidden"
      />
      <label
        htmlFor={`itinerary-toggle-${day}`}
        className={`${textColor} ${titleFont} font-[500] ${titleMargin} cursor-pointer flex items-center justify-between`}
      >
        <span>
          Day {day}: {title}
        </span>
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
        <div className="flex flex-col gap-6">
          {/* Activities Section */}
          {activities && activities.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {activities.map((activity, index) => {
                  // 使用智能分割函数，避免在缩写处分割
                  const descriptionPoints = activity.description
                    ? splitSentences(activity.description)
                    : [];

                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <p
                        className={`${textColor} font-noto-sans text-[16px] font-[500] leading-[1.6]`}
                      >
                        {timePeriodLabels[activity.time_period] || ""}
                      </p>
                      {descriptionPoints.length > 0 && (
                        <ul className="flex flex-col gap-2 list-none pl-0">
                          {descriptionPoints.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="flex gap-2 items-start"
                            >
                              <span
                                className={`${textColor} mt-3 flex-shrink-0 w-1 h-1 bg-primary-terracotta rounded-full`}
                              ></span>
                              <span
                                className={`${textColor} font-noto-sans text-[14px] md:text-[16px] font-[300] leading-[1.6]`}
                              >
                                {point}.
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Meals Section */}
          {meals && (
            <div className="flex flex-col gap-2">
              <p
                className={`${textColor} font-noto-sans text-[14px] md:text-[16px] font-[300] leading-[1.6]`}
              >
                <span className="font-[500]">Meals: </span>
                {[
                  meals.breakfast &&
                    `${capitalizeFirstLetter(meals.breakfast)} (Breakfast)`,
                  meals.lunch &&
                    `${capitalizeFirstLetter(meals.lunch)} (Lunch)`,
                  meals.dinner &&
                    `${capitalizeFirstLetter(meals.dinner)} (Dinner)`,
                ]
                  .filter(Boolean)
                  .join(", ")}
                ;
              </p>
            </div>
          )}

          {/* Hotel Section */}
          {hotel && (
            <div className="flex flex-col gap-2">
              <p
                className={`${textColor} font-noto-sans text-[14px] md:text-[16px] font-[300] leading-[1.6]`}
              >
                <span className="font-[500]">Hotel: </span>
                {hotel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedItinerary;
