"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AgencyRegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = "Please enter your agency name";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Please enter contact name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Please enter a password";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/agency/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agencyName: formData.agencyName,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功后登录
        const supabase = createClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) {
          setSubmitStatus({
            type: "error",
            message:
              "Registration successful, but login failed. Please try logging in manually.",
          });
        } else {
          router.push("/agency/dashboard");
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Registration failed. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitStatus({
        type: "error",
        message: "Registration failed. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary-parchment flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] text-center mb-4">
          Agency Registration
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-center mb-8">
          Register your travel agency to start managing travellers
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="agencyName"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              AGENCY NAME *
            </label>
            <input
              type="text"
              id="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              required
              placeholder="Enter your agency name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                errors.agencyName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.agencyName && (
              <p className="text-red-500 text-sm">{errors.agencyName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contactName"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              CONTACT NAME *
            </label>
            <input
              type="text"
              id="contactName"
              value={formData.contactName}
              onChange={handleChange}
              required
              placeholder="Enter contact person name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                errors.contactName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.contactName && (
              <p className="text-red-500 text-sm">{errors.contactName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              EMAIL *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              PHONE
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              PASSWORD *
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="At least 6 characters"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              CONFIRM PASSWORD *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
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
              {isSubmitting ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-primary-stone font-noto-sans text-sm">
              Already have an account?{" "}
              <Link
                href="/agency/login"
                className="text-primary-terracotta hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

