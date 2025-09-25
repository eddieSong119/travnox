import Image from "next/image";
import Link from "next/link";

const Email = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.1666 0.916504H0.833252V2.9415L9.99992 8.92067L19.1666 2.9415V0.916504ZM19.1666 4.434L10.3416 10.1898L9.99992 10.4123L9.65825 10.1898L0.833252 4.434V15.0832H19.1666V4.434Z"
      fill="#EFEEE9"
    />
  </svg>
);

const Phone = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.58334 2.49967C13.9556 2.49967 17.5 6.04408 17.5 10.4163H19.1667C19.1667 5.12362 14.8761 0.833008 9.58334 0.833008V2.49967ZM9.58334 5.83301C12.1147 5.83301 14.1667 7.88503 14.1667 10.4163H15.8333C15.8333 6.96456 13.0351 4.16634 9.58334 4.16634V5.83301ZM7.95361 15.1984L9.298 12.9459L14.7218 14.4956L14.1433 19.3243L13.3628 19.2811C11.3426 19.1692 9.34167 18.5995 7.52927 17.5712C6.50724 16.9913 5.5462 16.2661 4.67649 15.3963C3.80677 14.5267 3.08158 13.5656 2.50168 12.5436C1.47334 10.7312 0.903687 8.73026 0.791772 6.71001L0.748535 5.92948L5.57725 5.351L7.12693 10.7748L4.8283 12.1468C5.21475 12.6993 5.65486 13.2261 6.14885 13.7201C6.7114 14.2826 7.3165 14.7753 7.95361 15.1984Z"
      fill="#EFEEE9"
    />
  </svg>
);

const Nacara = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="31"
    height="32"
    viewBox="0 0 31 32"
    fill="none"
  >
    <path
      d="M27.3931 8.11933C27.606 8.54515 29.1867 10.8721 29.7686 13.1131C28.631 10.7098 27.0044 9.19116 25.9884 8.82171C25.6461 8.69727 23.6568 8.50274 21.2677 9.97851C23 8.23616 24.0568 7.06576 23.7056 6.18778C23.495 5.66117 21.773 3.4593 18.8733 2.229C21.127 2.76506 23.1071 4.09521 24.5836 5.13421C25.765 5.96556 26.8664 4.95878 27.9199 4.2564C26.8664 5.83676 27.1802 7.69351 27.3931 8.11933Z"
      fill="#FFFDF8"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1475 32.0001C23.5132 32.0001 30.295 25.2183 30.295 16.8526C30.295 16.3352 30.2691 15.8239 30.2184 15.3199C29.5343 21.4307 24.3504 26.1812 18.0569 26.1812C11.298 26.1812 5.81886 20.7021 5.81886 13.9432C5.81886 7.6497 10.5694 2.46579 16.6802 1.78166C16.1762 1.73101 15.6649 1.70508 15.1475 1.70508C6.78177 1.70508 0 8.48685 0 16.8526C0 25.2183 6.78177 32.0001 15.1475 32.0001Z"
      fill="#FFFDF8"
    />
  </svg>
);

const Footer = () => {
  return (
    <div className="bg-primary-midnight w-full md:min-w-[1420px] md:flex md:justify-center md:pt-[72px]">
      {/* Desktop */}
      <div className="hidden md:flex flex-col w-full px-[10vw]">
        <div className="flex justify-between h-[370px]">
          <div className="flex flex-col h-full">
            <Image
              src="/brand/logo-white.svg"
              alt="Travnox Logo"
              width={175}
              height={44}
            />
            <p className="mt-auto text-primary-parchment font-pp-museum text-[24px] font-[300] leading-[1.1] tracking-[1.6px]">
              Beyond the Wall.
            </p>
          </div>

          <div className="flex h-full ml-auto">
            <div className="flex flex-col h-full mr-10">
              <p className="text-primary-parchment font-pp-museum text-[20px] font-[300] leading-[1.1] tracking-[1.6px] mb-5">
                Quick Links
              </p>

              <Link
                href="/"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
              >
                Home
              </Link>
              <a
                href="/our-story"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
              >
                Our Story
              </a>

              <a
                href="/contact"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]"
              >
                Contact
              </a>
            </div>

            <div className="flex flex-col h-full mr-10">
              <p className="text-primary-parchment font-pp-museum text-[20px] font-[300] leading-[1.1] tracking-[1.6px] mb-5">
                Journeys
              </p>

              <a
                href="/north"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
              >
                North
              </a>
              <a
                href="/south"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
              >
                South
              </a>
              <a
                href="/chuanyu"
                className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]"
              >
                Chuanyu
              </a>
            </div>

            <div className="flex flex-col h-full">
              <p className="text-primary-parchment font-pp-museum text-[20px] font-[300] leading-[1.1] tracking-[1.6px] mb-5">
                Contact
              </p>

              <div className="flex items-center mb-2">
                <Email />
                <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] ml-2">
                  hello@travnox.com
                </p>
              </div>

              <div className="flex items-center">
                <Phone />
                <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] ml-2">
                  0452119599
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary-mist h-[1px] w-full mt-[80px]" />

        <div className="flex w-full my-[20px]">
          <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]">
            Copyright © 2025 TravNox
          </p>

          <div className="flex gap-x-2 ml-auto text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] items-center">
            Web design by Nacara Studio
            <Nacara />
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block md:hidden pt-[58px] pb-[20px] px-[18px]">
        <Image
          src="/brand/logo-white.svg"
          alt="Travnox Logo"
          width={175}
          height={44}
        />

        <p className="text-primary-parchment font-pp-museum text-[18px] font-[300] leading-[1.1] tracking-[1.6px] mt-8">
          Beyond the Wall.
        </p>

        <div className="flex justify-between w-full mt-16">
          <div className="flex flex-col w-1/2">
            <p className="text-primary-parchment font-pp-museum text-[18px] font-[300] mb-5">
              Quick Links
            </p>
            <Link
              href="/"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
            >
              Home
            </Link>
            <a
              href="/our-story"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
            >
              Our Story
            </a>
            <a
              href="/contact"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]"
            >
              Contact
            </a>
          </div>
          <div className="flex flex-col w-1/2">
            <p className="text-primary-parchment font-pp-museum text-[18px] font-[300] mb-5">
              Journeys
            </p>
            <a
              href="/north"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
            >
              North
            </a>
            <a
              href="/south"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] mb-2"
            >
              South
            </a>
            <a
              href="/chuanyu"
              className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]"
            >
              Chuanyu
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between w-full mt-16">
          <p className="text-primary-parchment font-pp-museum text-[18px] font-[300] mb-5">
            Contact
          </p>
          <div className="flex items-center mb-2">
            <Email />
            <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] ml-2">
              hello@travnox.com
            </p>
          </div>

          <div className="flex items-center">
            <Phone />
            <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] ml-2">
              0452119599
            </p>
          </div>
        </div>

        <div className="bg-primary-mist h-[1px] w-full mt-16" />

        <div className="flex flex-col justify-center items-center w-full mt-4">
          <p className="text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px]">
            Copyright © 2025 TravNox
          </p>
          <div className="flex gap-x-2 text-primary-parchment font-noto-sans text-[16px] font-[300] leading-[1.6] tracking-[1.6px] items-center">
            Web design by Nacara Studio
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
