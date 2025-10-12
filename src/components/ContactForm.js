"use client";

import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    contactNumber: "",
    journey: "",
    travellers: "",
    message: "",
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
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! We'll be in touch soon.",
        });
        // 清空表单
        setFormData({
          firstName: "",
          surname: "",
          email: "",
          contactNumber: "",
          journey: "",
          travellers: "",
          message: "",
        });

        // GA4 转化事件追踪
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "generate_lead", {
            event_category: "contact",
            event_label: formData.journey || "general_inquiry",
          });
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto space-y-6 px-4 md:px-0 z-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            FIRST NAME *
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="surname"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            SURNAME
          </label>
          <input
            type="text"
            id="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Enter your surname"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contactNumber"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            CONTACT NUMBER
          </label>
          <input
            type="tel"
            id="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="journey"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            JOURNEY
          </label>
          <select
            id="journey"
            value={formData.journey}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Select your journey</option>
            <option value="north">North</option>
            <option value="south">South</option>
            <option value="chuanyu">Chuanyu</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="travellers"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            TRAVELLERS
          </label>
          <select
            id="travellers"
            value={formData.travellers}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Select number of travellers</option>
            <option value="1">1 Traveller</option>
            <option value="2">2 Travellers</option>
            <option value="3">3 Travellers</option>
            <option value="4">4 Travellers</option>
            <option value="5+">5+ Travellers</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
        >
          MESSAGE *
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Enter your message"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical bg-white"
        />
      </div>

      {/* 状态消息 */}
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
              : "hover:bg-primary-mist"
          }`}
        >
          {isSubmitting ? "SENDING..." : "SUBMIT FORM"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
