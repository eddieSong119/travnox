const IconPlaceholder = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden
  >
    <rect
      x="4"
      y="4"
      width="24"
      height="24"
      rx="4"
      stroke="#262B2F"
      strokeWidth="1.5"
    />
  </svg>
);

/**
 * Icon + title list with dividers between items.
 * Mobile: vertical stack, icon left of title.
 * Desktop: horizontal row, icon above title, equal-width columns.
 */
const IconTitleList = ({ items = [], className = "" }) => {
  if (!items.length) return null;

  return (
    <ul
      className={`flex w-full max-w-full list-none flex-col border-y border-primary-stone divide-y divide-primary-stone md:flex-row md:divide-x md:divide-y-0 ${className}`}
    >
      {items.map((item) => (
        <li
          key={item.id ?? item.title}
          className="flex w-full min-w-0 flex-row items-center gap-4 py-5 md:flex-1 md:flex-col md:items-center md:justify-start md:gap-4 md:px-4 md:py-6 md:text-center lg:px-6"
        >
          <div className="flex shrink-0 items-center justify-center">
            {item.icon ?? <IconPlaceholder />}
          </div>
          <p className="min-w-0 flex-1 font-pp-museum text-[16px] font-[500] text-primary-midnight md:flex-none md:text-[16px]">
            {item.title}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default IconTitleList;
