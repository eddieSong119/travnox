"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminEditAgencyPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    businessLicense: "",
  });

  useEffect(() => {
    fetchAgency();
  }, [resolvedParams.id]);

  const fetchAgency = async () => {
    try {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;

      setFormData({
        agencyName: data.agency_name || "",
        contactName: data.contact_name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        businessLicense: data.business_license || "",
      });
    } catch (error) {
      console.error("Error fetching agency:", error);
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
        .from("agencies")
        .update({
          agency_name: formData.agencyName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          business_license: formData.businessLicense || null,
        })
        .eq("id", resolvedParams.id);

      if (error) throw error;

      setSubmitStatus({
        type: "success",
        message: "Agency updated successfully!",
      });

      setTimeout(() => {
        router.push(`/admin/dashboard/agencies/${resolvedParams.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating agency:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to update agency",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-primary-stone font-noto-sans">Loading agency...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/admin/dashboard/agencies/${resolvedParams.id}`}
          className="text-primary-stone font-noto-sans text-sm hover:underline mb-2 inline-block"
        >
          ← Back to Agency
        </Link>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
          Edit Agency
        </h1>
        <p className="text-primary-stone font-noto-sans text-[16px] mt-2">
          Update the agency&apos;s information
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="agencyName"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Agency Name *
              </label>
              <input
                type="text"
                id="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contactName"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName}
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
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
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

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="address"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="businessLicense"
                className="block text-primary-midnight font-noto-sans text-sm font-medium"
              >
                Business License
              </label>
              <input
                type="text"
                id="businessLicense"
                value={formData.businessLicense}
                onChange={handleChange}
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
              href={`/admin/dashboard/agencies/${resolvedParams.id}`}
              className="px-6 py-3 bg-gray-200 text-primary-midnight rounded-lg font-noto-sans font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
