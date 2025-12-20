"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
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

      // 检查是否是 admin 用户
      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select("id, role")
        .eq("user_id", data.user.id)
        .single();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        setSubmitStatus({
          type: "error",
          message: "Access denied. You are not authorized as an administrator.",
        });
        return;
      }

      router.push("/admin/dashboard");
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
    <div className="w-full min-h-screen bg-primary-midnight flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-primary-parchment font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] text-center mb-4">
          Admin Portal
        </h1>
        <p className="text-primary-mist font-noto-sans text-[16px] text-center mb-8">
          Sign in to manage all agencies and travellers
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-primary-parchment font-noto-sans text-base font-medium tracking-[1.6px]"
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
              className="w-full px-4 py-3 border border-primary-stone rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-primary-parchment text-primary-midnight"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-primary-parchment font-noto-sans text-base font-medium tracking-[1.6px]"
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
              className="w-full px-4 py-3 border border-primary-stone rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-primary-parchment text-primary-midnight"
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
              className={`w-full bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full transition-colors flex items-center justify-center ${
                isSubmitting
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary-stone"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
