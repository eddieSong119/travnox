"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function AgencySidebar({ user, agency }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/agency/dashboard" },
    { name: "Travellers", href: "/agency/dashboard/travellers" },
    { name: "Settings", href: "/agency/dashboard/settings" },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/agency/login");
  };

  return (
    <>
      {/* Mobile header with logo and menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary-midnight border-b border-primary-stone p-4">
        <div className="flex items-center justify-between">
          <Link href="/agency/dashboard">
            <Image
              src="/brand/logo-white.svg"
              alt="Travnox Logo"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary-parchment font-pp-museum font-medium flex items-center space-x-2"
          >
            <span>Menu</span>
            <svg
              className={`h-5 w-5 transition-transform ${
                isMobileMenuOpen ? "rotate-180" : ""
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
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-primary-midnight text-primary-parchment z-30 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-stone hidden md:block">
            <Link href="/agency/dashboard">
              <Image
                src="/brand/logo-white.svg"
                alt="Travnox Logo"
                width={140}
                height={36}
                className="h-9 w-auto"
              />
            </Link>
          </div>

          {/* Agency info */}
          <div className="p-6 border-b border-primary-stone mt-16 md:mt-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-terracotta flex items-center justify-center text-white font-pp-museum font-medium">
                {agency?.agency_name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-pp-museum font-medium truncate">
                  {agency?.agency_name || "Agency"}
                </p>
                <p className="text-xs text-primary-mist truncate font-pp-museum">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/agency/dashboard" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors font-pp-museum text-[16px] ${
                    isActive
                      ? "bg-primary-terracotta text-white"
                      : "text-primary-parchment hover:bg-primary-stone"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-primary-stone">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 rounded-lg bg-primary-terracotta hover:bg-primary-stone text-white font-pp-museum font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
