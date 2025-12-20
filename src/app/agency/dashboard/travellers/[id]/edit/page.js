"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditTravellerPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    notes: "",
    // Order fields
    tripName: "",
    tripStartDate: "",
    tripEndDate: "",
    orderAmount: "",
    currency: "AUD",
    orderStatus: "",
    paymentStatus: "",
    paymentDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const tripNameOptions = [
    { value: "", label: "Select a trip" },
    { value: "THE_NORTH", label: "The North" },
    { value: "THE_SOUTH", label: "The South" },
    { value: "CHUANYU", label: "Chuanyu" },
  ];

  const orderStatusOptions = [
    { value: "", label: "Not Set" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "Not Set" },
    { value: "unpaid", label: "Unpaid" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "refunded", label: "Refunded" },
  ];

  const currencyOptions = [
    { value: "AUD", label: "AUD" },
    { value: "USD", label: "USD" },
    { value: "CNY", label: "CNY" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
  ];

  useEffect(() => {
    fetchTraveller();
  }, [id]);

  const fetchTraveller = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      const { data: traveller, error } = await supabase
        .from("travellers")
        .select("*, agencies!inner(user_id)")
        .eq("id", id)
        .single();

      if (error || !traveller) {
        console.error("Error fetching traveller:", error);
        router.push("/agency/dashboard/travellers");
        return;
      }

      // 验证这个旅客属于当前 agency
      if (traveller.agencies.user_id !== user.id) {
        router.push("/agency/dashboard/travellers");
        return;
      }

      setFormData({
        firstName: traveller.first_name || "",
        lastName: traveller.last_name || "",
        email: traveller.email || "",
        phone: traveller.phone || "",
        passportNumber: traveller.passport_number || "",
        nationality: traveller.nationality || "",
        dateOfBirth: traveller.date_of_birth || "",
        notes: traveller.notes || "",
        // Order fields
        tripName: traveller.trip_name || "",
        tripStartDate: traveller.trip_start_date || "",
        tripEndDate: traveller.trip_end_date || "",
        orderAmount: traveller.order_amount || "",
        currency: traveller.currency || "AUD",
        orderStatus: traveller.order_status || "",
        paymentStatus: traveller.payment_status || "",
        paymentDate: traveller.payment_date || "",
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
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
      const { error } = await supabase
        .from("travellers")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email || null,
          phone: formData.phone || null,
          passport_number: formData.passportNumber || null,
          nationality: formData.nationality || null,
          date_of_birth: formData.dateOfBirth || null,
          notes: formData.notes || null,
          // Order fields
          trip_name: formData.tripName || null,
          trip_start_date: formData.tripStartDate || null,
          trip_end_date: formData.tripEndDate || null,
          order_amount: formData.orderAmount
            ? parseFloat(formData.orderAmount)
            : null,
          currency: formData.currency || "AUD",
          order_status: formData.orderStatus || null,
          payment_status: formData.paymentStatus || null,
          payment_date: formData.paymentDate || null,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      router.push(`/agency/dashboard/travellers/${id}`);
    } catch (error) {
      console.error("Error updating traveller:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Failed to update traveller. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-primary-midnight font-noto-sans">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/agency/dashboard/travellers/${id}`}
          className="text-primary-terracotta font-noto-sans text-sm hover:underline mb-4 inline-block"
        >
          ← Back to Traveller
        </Link>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-2">
          Edit Traveller
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Update the traveller&apos;s information
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-4">
              Basic Information
            </h2>
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  LAST NAME *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          {/* Passport Information */}
          <div>
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-4">
              Passport Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="passportNumber"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  PASSPORT NUMBER
                </label>
                <input
                  type="text"
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="nationality"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  NATIONALITY
                </label>
                <input
                  type="text"
                  id="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-4">
              Order Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="tripName"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  TRIP NAME
                </label>
                <select
                  id="tripName"
                  value={formData.tripName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                >
                  {tripNameOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="orderStatus"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  ORDER STATUS
                </label>
                <select
                  id="orderStatus"
                  value={formData.orderStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                >
                  {orderStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tripStartDate"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  TRIP START DATE
                </label>
                <input
                  type="date"
                  id="tripStartDate"
                  value={formData.tripStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tripEndDate"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  TRIP END DATE
                </label>
                <input
                  type="date"
                  id="tripEndDate"
                  value={formData.tripEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="orderAmount"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  ORDER AMOUNT
                </label>
                <div className="flex space-x-2">
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    id="orderAmount"
                    value={formData.orderAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="paymentStatus"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  PAYMENT STATUS
                </label>
                <select
                  id="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                >
                  {paymentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="paymentDate"
                  className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
                >
                  PAYMENT DATE
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-4">
              Notes
            </h2>
            <div className="space-y-2">
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white resize-none"
              />
            </div>
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

          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-midnight"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/agency/dashboard/travellers/${id}`}
              className="text-primary-stone font-noto-sans hover:underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
