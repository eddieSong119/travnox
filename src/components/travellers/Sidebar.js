"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar({ user, traveller }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/travellers/dashboard", icon: "📊" },
    { name: "Payment", href: "/travellers/dashboard/payment", icon: "💳" },
    { name: "Documents", href: "/travellers/dashboard/documents", icon: "📄" },
    { name: "Settings", href: "/travellers/dashboard/settings", icon: "⚙️" },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/travellers/account/register");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-[70px] left-0 right-0 z-40 bg-primary-parchment border-b border-primary-steel p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-between w-full text-primary-midnight font-noto-sans font-medium"
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

      {/* Sidebar */}
      <aside
        className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] w-64 bg-primary-midnight text-primary-parchment z-30 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* User info */}
          <div className="p-6 border-b border-primary-stone">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-terracotta flex items-center justify-center text-white font-noto-sans font-medium">
                {traveller?.first_name?.[0] || user?.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-noto-sans font-medium truncate">
                  {traveller
                    ? `${traveller.first_name} ${traveller.last_name}`
                    : user?.email}
                </p>
                <p className="text-xs text-primary-mist truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-noto-sans ${
                    isActive
                      ? "bg-primary-terracotta text-white"
                      : "text-primary-parchment hover:bg-primary-stone"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-primary-stone">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-primary-terracotta hover:bg-primary-stone text-white font-noto-sans font-medium transition-colors"
            >
              <span>Sign Out</span>
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
