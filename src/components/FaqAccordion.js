"use client";

const FaqAnswer = ({ a, textColor, answerFont }) => {
  if (!a) return null;
  return <p className={`${textColor} ${answerFont} mt-4`}>{a}</p>;
};

const FaqItem = ({
  id,
  q,
  a,
  textColor = "text-primary-midnight",
  className = "",
  titleFont = "font-pp-museum text-[18px] md:text-[24px] md:leading-[0.9] leading-[1.3]",
  titleMargin = "",
  answerFont = "font-noto-sans text-[14px] font-[300] leading-[1.6] md:text-[16px]",
}) => (
  <div className={`w-full ${className}`}>
    {/* Mobile: expandable */}
    <div className="content-dropdown md:hidden">
      <input
        type="checkbox"
        id={`faq-toggle-${id}`}
        className="content-toggle hidden"
      />
      <label
        htmlFor={`faq-toggle-${id}`}
        className={`${textColor} ${titleFont} font-[500] ${titleMargin} flex cursor-pointer items-center justify-between gap-4`}
      >
        <span>{q}</span>
        <svg
          className="content-arrow h-5 w-5 shrink-0 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
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
        <FaqAnswer a={a} textColor={textColor} answerFont={answerFont} />
      </div>
    </div>

    {/* Desktop: always visible */}
    <div className="hidden md:block">
      <p className={`${textColor} ${titleFont} font-[500] ${titleMargin}`}>{q}</p>
      <FaqAnswer a={a} textColor={textColor} answerFont={answerFont} />
    </div>
  </div>
);

const FaqAccordion = ({
  items = [],
  textColor = "text-primary-midnight",
  className = "",
  itemClassName = "",
  titleFont,
  titleMargin,
  answerFont,
}) => {
  if (!items.length) return null;

  return (
    <div className={`flex w-full flex-col gap-0 ${className}`}>
      {items.map((item, index) => (
        <FaqItem
          key={item.id ?? index}
          id={item.id ?? `faq-${index}`}
          q={item.q}
          a={item.a}
          textColor={textColor}
          titleFont={titleFont}
          titleMargin={titleMargin}
          answerFont={answerFont}
          className={`py-5 ${
            index !== 0
              ? "border-b border-primary-stone"
              : "border-t border-b border-primary-stone"
          } ${itemClassName}`}
        />
      ))}
    </div>
  );
};

export { FaqItem };
export default FaqAccordion;
