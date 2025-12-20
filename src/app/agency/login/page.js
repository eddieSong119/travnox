"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AgencyLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setSubmitStatus({
          type: "error",
          message:
            error.message || "Login failed. Please check your credentials.",
        });
        return;
      }

      // 检查是否是 agency 用户
      const { data: agency, error: agencyError } = await supabase
        .from("agencies")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      if (agencyError || !agency) {
        await supabase.auth.signOut();
        setSubmitStatus({
          type: "error",
          message: "No agency account found. Please register first.",
        });
        return;
      }

      router.push("/agency/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setSubmitStatus({
        type: "error",
        message: "Login failed. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary-parchment flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] text-center mb-4">
          Agency Portal
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-center mb-8">
          Sign in to manage your travellers
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
          </div>

          {submitStatus && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-midnight"
              }`}
            >
              {isSubmitting ? "Signing in..." : "SIGN IN"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-primary-stone font-noto-sans text-sm">
              Don't have an account?{" "}
              <Link
                href="/agency/register"
                className="text-primary-terracotta hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

