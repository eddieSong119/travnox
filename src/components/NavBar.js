"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isJourneysDropdownOpen, setIsJourneysDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleJourneysDropdown = () => {
    setIsJourneysDropdownOpen(!isJourneysDropdownOpen);
  };

  const closeJourneysDropdown = () => {
    setIsJourneysDropdownOpen(false);
  };

  return (
    <nav
      className="bg-primary-parchment fixed top-0 left-0 right-0 z-50 w-screen md:h-auto"
      style={{ height: isMenuOpen ? "100vh" : "70px" }}
    >
      <div className="flex justify-start items-center h-[70px] border-b-1 border-primary-steel">
        {/* Logo */}
        <div className="flex-shrink-0 ml-8" onClick={() => router.push("/")}>
          <Image
            src="/brand/logo-stone.svg"
            alt="Travnox Logo"
            width={175}
            height={44}
            className="h-8 w-auto"
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block md:ml-auto">
          <div className="flex items-baseline space-x-8">
            <a
              href="/our-story"
              className="text-[16px] font-noto-sans font-normal text-primary-midnight hover:text-primary-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              OUR STORY
            </a>
            <a
              href="/contact"
              className="text-[16px] font-noto-sans font-normal text-primary-midnight hover:text-primary-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              CONTACT
            </a>

            {/* Desktop Journeys Dropdown */}
            <div className="relative">
              <button
                onClick={toggleJourneysDropdown}
                onMouseEnter={() => setIsJourneysDropdownOpen(true)}
                className="text-[16px] font-noto-sans font-normal text-primary-midnight hover:text-primary-terracotta px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                JOURNEYS
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    isJourneysDropdownOpen ? "rotate-180" : ""
                  }`}
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
              </button>

              {/* Desktop Dropdown Menu */}
              {isJourneysDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-48 z-50 w-[340px]"
                  onMouseLeave={closeJourneysDropdown}
                >
                  <a
                    href="/north"
                    className="block pl-6 py-6 text-[16px] font-noto-sans bg-primary-midnight hover:bg-primary-stone text-primary-parchment transition-colors duration-200"
                    onClick={closeJourneysDropdown}
                  >
                    THE NORTH
                  </a>
                  <a
                    href="/south"
                    className="block pl-6 py-6 text-[16px] font-noto-sans bg-primary-midnight hover:bg-primary-stone text-primary-parchment transition-colors duration-200"
                    onClick={closeJourneysDropdown}
                  >
                    THE SOUTH
                  </a>
                  <a
                    href="/chuanyu"
                    className="block pl-6 py-6 text-[16px] font-noto-sans bg-primary-midnight hover:bg-primary-stone text-primary-parchment transition-colors duration-200"
                    onClick={closeJourneysDropdown}
                  >
                    CHUANYU
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block ml-8 h-full">
          <button
            onClick={() => router.push("/contact")}
            className="bg-primary-terracotta hover:bg-primary-midnight font-noto-sans font-normal text-white px-6 py-0 h-full text-sm font-medium transition-colors duration-200"
          >
            START YOUR JOURNEY
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden ml-auto mr-4">
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden relative h-[calc(100vh-70px)]">
          <div className="pt-[47px] px-2 pb-3 space-y-10 sm:px-3 bg-primary-parchment">
            <a
              href="/our-story"
              className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500]"
              onClick={() => setIsMenuOpen(false)}
            >
              OUR STORY
            </a>
            <a
              href="/contact"
              className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500]"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </a>

            {/* Journeys 折叠菜单 - 使用纯 CSS */}
            <div className="journeys-dropdown">
              <input
                type="checkbox"
                id="journeys-toggle"
                className="journeys-toggle hidden"
              />
              <label
                htmlFor="journeys-toggle"
                className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500] cursor-pointer flex items-center justify-between"
              >
                <span>JOURNEYS</span>
                <svg
                  className="journeys-arrow h-4 w-4 transition-transform duration-200"
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

              {/* 子选项 */}
              <div className="journeys-submenu ml-4 mt-2 space-y-2 max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                <a
                  href="/north"
                  className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  THE NORTH
                </a>
                <a
                  href="/south"
                  className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  THE SOUTH
                </a>
                <a
                  href="/chuanyu"
                  className="text-[14px] font-noto-sans text-primary-midnight block px-3 py-2 font-[500]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CHUANYU
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => router.push("/contact")}
                className="w-full bg-primary-terracotta rounded-full text-primary-parchment py-3 font-noto-sans text-[14px] font-[500] leading-[160%]"
              >
                START YOUR JOURNEY
              </button>
            </div>
          </div>
          <Image
            src="/brand/navBG.svg"
            alt="Nav BG"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full absolute bottom-0 left-0"
            style={{ width: "100%", height: "auto" }}
          />
          <span className="text-primary-parchment text-[20px] font-pp-museum font-[300] leading-[110%] absolute bottom-[27px] left-[30px]">
            Beyond the Wall
          </span>
        </div>
      )}

      <style jsx>{`
        .journeys-toggle:checked + label .journeys-arrow {
          transform: rotate(180deg);
        }

        .journeys-toggle:checked ~ .journeys-submenu {
          max-height: 200px;
        }
      `}</style>
    </nav>
  );
}
