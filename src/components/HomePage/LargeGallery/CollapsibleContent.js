"use client";

import List from "@/components/HomePage/List";

const CollapsibleContent = ({
  item,
  textColor,
  className = "md:hidden content-dropdown",
  titleFont = "font-pp-museum text-[24px] leading-[100%]",
  titleMargin = "mb-4",
}) => {
  return (
    <div className={className}>
      <input
        type="checkbox"
        id={`content-toggle-${item.id}`}
        className="content-toggle hidden"
      />
      <label
        htmlFor={`content-toggle-${item.id}`}
        className={`${textColor} ${titleFont} font-[500] ${titleMargin} cursor-pointer flex items-center justify-between`}
      >
        <span>{item.title}</span>
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
        {item.description_type === "list" ? (
          <List list={item.description.value} textColor={textColor} />
        ) : (
          <p
            className={`${textColor} font-noto-sans text-[16px] font-[300] leading-[1.6]`}
          >
            {item.description.value}
          </p>
        )}
      </div>
    </div>
  );
};

export default CollapsibleContent;
