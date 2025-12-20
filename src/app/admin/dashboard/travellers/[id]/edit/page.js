"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const tripNameOptions = [
  { value: "", label: "Select a trip" },
  { value: "THE_NORTH", label: "The North" },
  { value: "THE_SOUTH", label: "The South" },
  { value: "CHUANYU", label: "Chuanyu" },
];

const orderStatusOptions = [
  { value: "", label: "Select status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const paymentStatusOptions = [
  { value: "", label: "Select status" },
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

export default function AdminEditTravellerPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    nationality: "",
    dateOfBirth: "",
    tripName: "",
    tripStartDate: "",
    tripEndDate: "",
    orderAmount: "",
    currency: "AUD",
    commissionRate: "",
    commissionAmount: "",
    orderStatus: "",
    paymentStatus: "",
    paymentDate: "",
    zohoDealId: "",
    notes: "",
  });

  useEffect(() => {
    fetchTraveller();
  }, [resolvedParams.id]);

  const fetchTraveller = async () => {
    try {
      const { data, error } = await supabase
        .from("travellers")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;

      setFormData({
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        passportNumber: data.passport_number || "",
        nationality: data.nationality || "",
        dateOfBirth: data.date_of_birth || "",
        tripName: data.trip_name || "",
        tripStartDate: data.trip_start_date || "",
        tripEndDate: data.trip_end_date || "",
        orderAmount: data.order_amount || "",
        currency: data.currency || "AUD",
        commissionRate: data.commission_rate || "",
        commissionAmount: data.commission_amount || "",
        orderStatus: data.order_status || "",
        paymentStatus: data.payment_status || "",
        paymentDate: data.payment_date || "",
        zohoDealId: data.zoho_deal_id || "",
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching traveller:", error);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          trip_name: formData.tripName || null,
          trip_start_date: formData.tripStartDate || null,
          trip_end_date: formData.tripEndDate || null,
          order_amount: formData.orderAmount
            ? parseFloat(formData.orderAmount)
            : null,
          currency: formData.currency,
          commission_rate: formData.commissionRate
            ? parseFloat(formData.commissionRate)
            : null,
          commission_amount: formData.commissionAmount
            ? parseFloat(formData.commissionAmount)
            : null,
          order_status: formData.orderStatus || null,
          payment_status: formData.paymentStatus || null,
          payment_date: formData.paymentDate || null,
          zoho_deal_id: formData.zohoDealId || null,
          notes: formData.notes || null,
        })
        .eq("id", resolvedParams.id);

      if (error) throw error;

      setSubmitStatus({
        type: "success",
        message: "Traveller updated successfully!",
      });

      setTimeout(() => {
        router.push(`/admin/dashboard/travellers/${resolvedParams.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating traveller:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to update traveller",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-primary-stone font-noto-sans">
          Loading traveller...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/dashboard/travellers/${resolvedParams.id}`}
          className="text-primary-stone font-noto-sans text-sm hover:underline mb-2 inline-block"
        >
          ← Back to Traveller
        </Link>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
          Edit Traveller
        </h1>
        <p className="text-primary-stone font-noto-sans text-[16px] mt-2">
          Update the traveller&apos;s information
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
          <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="passportNumber"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Passport Number
              </label>
              <input
                type="text"
                id="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="nationality"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
          <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
            Order Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="tripName"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Trip Name
              </label>
              <select
                id="tripName"
                value={formData.tripName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
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
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Order Status
              </label>
              <select
                id="orderStatus"
                value={formData.orderStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
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
                htmlFor="paymentStatus"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
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
                htmlFor="tripStartDate"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Trip Start Date
              </label>
              <input
                type="date"
                id="tripStartDate"
                value={formData.tripStartDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tripEndDate"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Trip End Date
              </label>
              <input
                type="date"
                id="tripEndDate"
                value={formData.tripEndDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="paymentDate"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Payment Date
              </label>
              <input
                type="date"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="orderAmount"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Order Amount
              </label>
              <input
                type="number"
                id="orderAmount"
                step="0.01"
                value={formData.orderAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Currency
              </label>
              <select
                id="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="commissionRate"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Commission Rate (%)
              </label>
              <input
                type="number"
                id="commissionRate"
                step="0.01"
                value={formData.commissionRate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="commissionAmount"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Commission Amount
              </label>
              <input
                type="number"
                id="commissionAmount"
                step="0.01"
                value={formData.commissionAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="zohoDealId"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Zoho Deal ID
              </label>
              <input
                type="text"
                id="zohoDealId"
                value={formData.zohoDealId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <label
              htmlFor="notes"
              className="block text-primary-midnight font-noto-sans text-sm font-medium"
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-primary-terracotta text-white rounded-lg font-noto-sans font-medium transition-colors flex items-center justify-center ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-primary-midnight"
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
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <Link
            href={`/admin/dashboard/travellers/${resolvedParams.id}`}
            className="px-6 py-3 bg-gray-200 text-primary-midnight rounded-lg font-noto-sans font-medium hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
