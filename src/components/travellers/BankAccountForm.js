"use client";

import { useState, useEffect } from "react";

export default function BankAccountForm({
  initialData,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bsb: "",
    accountNumber: "",
    bankName: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        accountHolderName: initialData.account_holder_name || "",
        bsb: initialData.bsb || "",
        accountNumber: initialData.account_number || "",
        bankName: initialData.bank_name || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // 清除该字段的错误
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

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "Please enter account holder name";
    }

    if (!formData.bsb.trim()) {
      newErrors.bsb = "Please enter BSB";
    } else if (!/^\d{6}$/.test(formData.bsb.replace(/\s/g, ""))) {
      newErrors.bsb = "BSB must be 6 digits";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Please enter account number";
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account number must contain only digits";
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = "Please enter bank name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="accountHolderName"
          className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
        >
          ACCOUNT HOLDER NAME *
        </label>
        <input
          type="text"
          id="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          required
          placeholder="Enter account holder name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
            errors.accountHolderName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.accountHolderName && (
          <p className="text-red-500 text-sm">{errors.accountHolderName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="bsb"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            BSB *
          </label>
          <input
            type="text"
            id="bsb"
            value={formData.bsb}
            onChange={handleChange}
            required
            placeholder="000000"
            maxLength={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
              errors.bsb ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.bsb && <p className="text-red-500 text-sm">{errors.bsb}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="accountNumber"
            className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
          >
            ACCOUNT NUMBER *
          </label>
          <input
            type="text"
            id="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            required
            placeholder="Enter account number"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
              errors.accountNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-sm">{errors.accountNumber}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bankName"
          className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
        >
          BANK NAME *
        </label>
        <input
          type="text"
          id="bankName"
          value={formData.bankName}
          onChange={handleChange}
          required
          placeholder="Enter bank name"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white ${
            errors.bankName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.bankName && (
          <p className="text-red-500 text-sm">{errors.bankName}</p>
        )}
      </div>

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
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Information"
              : "Save Information"}
        </button>
      </div>
    </form>
  );
}
