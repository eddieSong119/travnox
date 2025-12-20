"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTravellerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [agencyId, setAgencyId] = useState(null);

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

  // Document upload state
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: "",
    type: "other",
    file: null,
  });

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

  const documentTypes = [
    { value: "itinerary", label: "Itinerary" },
    { value: "brochure", label: "Brochure" },
    { value: "passport", label: "Passport" },
    { value: "visa", label: "Visa" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchAgency();
  }, []);

  const fetchAgency = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/agency/login");
      return;
    }

    const { data: agency } = await supabase
      .from("agencies")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!agency) {
      router.push("/agency/login");
      return;
    }

    setAgencyId(agency.id);
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

  // Handle document file selection
  const handleDocFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDoc({
        ...newDoc,
        file,
        name: newDoc.name || file.name,
      });
    }
  };

  // Add document to pending list
  const handleAddDocument = () => {
    if (!newDoc.file || !newDoc.name.trim()) {
      return;
    }

    setDocuments([...documents, { ...newDoc, id: Date.now() }]);
    setNewDoc({ name: "", type: "other", file: null });

    // Reset file input
    const fileInput = document.getElementById("docFile");
    if (fileInput) fileInput.value = "";
  };

  // Remove document from pending list
  const handleRemoveDocument = (docId) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!agencyId) {
      setSubmitStatus({
        type: "error",
        message: "Agency not found. Please try again.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create traveller
      const { data: traveller, error } = await supabase
        .from("travellers")
        .insert({
          agency_id: agencyId,
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
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Upload documents if any
      if (documents.length > 0) {
        for (const doc of documents) {
          const formDataUpload = new FormData();
          formDataUpload.append("file", doc.file);
          formDataUpload.append("travellerId", traveller.id);
          formDataUpload.append("name", doc.name);
          formDataUpload.append("type", doc.type);

          await fetch("/api/agency/documents/upload", {
            method: "POST",
            body: formDataUpload,
          });
        }
      }

      router.push(`/agency/dashboard/travellers/${traveller.id}`);
    } catch (error) {
      console.error("Error creating traveller:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.message || "Failed to create traveller. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/agency/dashboard/travellers"
          className="text-primary-terracotta font-noto-sans text-sm hover:underline mb-4 inline-block"
        >
          ← Back to Travellers
        </Link>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-2">
          Add New Traveller
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Enter the traveller's information
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
                  placeholder="Enter first name"
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
                  placeholder="Enter last name"
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
                  placeholder="Enter email address"
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
                  placeholder="Enter phone number"
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
                  placeholder="Enter passport number"
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
                  placeholder="Enter nationality"
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

          {/* Documents */}
          <div>
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-4">
              Documents
            </h2>

            {/* Document upload form */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label
                    htmlFor="docName"
                    className="block text-[#262B2F] font-noto-sans text-sm font-medium"
                  >
                    Document Name
                  </label>
                  <input
                    type="text"
                    id="docName"
                    value={newDoc.name}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, name: e.target.value })
                    }
                    placeholder="Enter document name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="docType"
                    className="block text-[#262B2F] font-noto-sans text-sm font-medium"
                  >
                    Document Type
                  </label>
                  <select
                    id="docType"
                    value={newDoc.type}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white text-sm"
                  >
                    {documentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="docFile"
                    className="block text-[#262B2F] font-noto-sans text-sm font-medium"
                  >
                    File
                  </label>
                  <input
                    type="file"
                    id="docFile"
                    onChange={handleDocFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white text-sm"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddDocument}
                disabled={!newDoc.file || !newDoc.name.trim()}
                className={`text-sm font-noto-sans font-medium px-4 py-2 rounded-lg transition-colors ${
                  !newDoc.file || !newDoc.name.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary-midnight text-white hover:bg-primary-stone"
                }`}
              >
                + Add Document
              </button>
            </div>

            {/* Pending documents list */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-primary-stone font-noto-sans">
                  Documents to upload ({documents.length}):
                </p>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border border-primary-steel rounded-lg bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">📄</span>
                      <div>
                        <p className="text-primary-midnight font-noto-sans text-sm font-medium">
                          {doc.name}
                        </p>
                        <p className="text-primary-stone font-noto-sans text-xs">
                          {documentTypes.find((t) => t.value === doc.type)
                            ?.label || doc.type}{" "}
                          • {doc.file.name}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 font-noto-sans text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Information */}
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
                placeholder="Enter any additional notes"
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
              {isSubmitting ? "Creating..." : "Create Traveller"}
            </button>
            <Link
              href="/agency/dashboard/travellers"
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
