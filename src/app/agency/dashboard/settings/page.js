"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AgencySettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [agency, setAgency] = useState(null);
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

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchAgencyData();
  }, []);

  const fetchAgencyData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      const { data: agencyData } = await supabase
        .from("agencies")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (agencyData) {
        setAgency(agencyData);
        setFormData({
          agencyName: agencyData.agency_name || "",
          contactName: agencyData.contact_name || "",
          email: agencyData.email || user.email || "",
          phone: agencyData.phone || "",
          address: agencyData.address || "",
          businessLicense: agencyData.business_license || "",
        });
      }
    } catch (error) {
      console.error("Error fetching agency data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      const { error } = await supabase
        .from("agencies")
        .update({
          agency_name: formData.agencyName,
          contact_name: formData.contactName,
          phone: formData.phone,
          address: formData.address,
          business_license: formData.businessLicense,
        })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setSubmitStatus({
        type: "success",
        message: "Agency information updated successfully",
      });
    } catch (error) {
      console.error("Error updating agency:", error);
      setSubmitStatus({
        type: "error",
        message: "Update failed. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSubmitStatus({
        type: "error",
        message: "New password and confirm password do not match",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSubmitStatus({
        type: "error",
        message: "New password must be at least 6 characters",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        throw error;
      }

      setSubmitStatus({
        type: "success",
        message: "Password updated successfully",
      });
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Password update failed. Please try again later.",
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
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-4">
          Agency Settings
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Manage your agency information and account settings
        </p>
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

      {/* Agency Information */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Agency Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="agencyName"
                className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
              >
                AGENCY NAME
              </label>
              <input
                type="text"
                id="agencyName"
                value={formData.agencyName}
                onChange={(e) =>
                  setFormData({ ...formData, agencyName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contactName"
                className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
              >
                CONTACT NAME
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              />
            </div>
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
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-sm text-primary-stone">
              Email address cannot be changed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="businessLicense"
                className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
              >
                BUSINESS LICENSE
              </label>
              <input
                type="text"
                id="businessLicense"
                value={formData.businessLicense}
                onChange={(e) =>
                  setFormData({ ...formData, businessLicense: e.target.value })
                }
                placeholder="Enter business license number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              ADDRESS
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              placeholder="Enter business address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white resize-none"
            />
          </div>

          <div className="pt-4">
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
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Change Password
        </h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              NEW PASSWORD
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full transition-colors ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-midnight"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

