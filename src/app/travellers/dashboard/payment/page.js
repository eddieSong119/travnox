"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import BankAccountForm from "@/components/travellers/BankAccountForm";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const supabase = createClient();
  const [bankAccount, setBankAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fetchBankAccount();
  }, []);

  const fetchBankAccount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/travellers/account/register");
        return;
      }

      // 获取 traveller ID
      const { data: traveller } = await supabase
        .from("travellers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!traveller) {
        return;
      }

      // 获取银行账户信息
      const response = await fetch("/api/travellers/bank-account");
      const data = await response.json();

      if (response.ok && data.bankAccount) {
        setBankAccount(data.bankAccount);
      }
    } catch (error) {
      console.error("Error fetching bank account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/travellers/bank-account", {
        method: bankAccount ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountHolderName: formData.accountHolderName,
          bsb: formData.bsb.replace(/\s/g, ""),
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Bank account information saved",
        });
        setBankAccount(data.bankAccount);
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to save. Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to save. Please try again later.",
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
          Bank Account Information
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Manage your payment bank account information
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <BankAccountForm
          initialData={bankAccount}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
