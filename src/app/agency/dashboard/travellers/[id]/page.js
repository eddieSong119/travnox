"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TravellerDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [traveller, setTraveller] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const tripNameMap = {
    THE_NORTH: "The North",
    THE_SOUTH: "The South",
    CHUANYU: "Chuanyu",
  };

  useEffect(() => {
    fetchTravellerData();
  }, [id]);

  const fetchTravellerData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      // 获取旅客信息
      const { data: travellerData, error: travellerError } = await supabase
        .from("travellers")
        .select("*, agencies!inner(user_id)")
        .eq("id", id)
        .single();

      if (travellerError || !travellerData) {
        console.error("Error fetching traveller:", travellerError);
        router.push("/agency/dashboard/travellers");
        return;
      }

      // 验证这个旅客属于当前 agency
      if (travellerData.agencies.user_id !== user.id) {
        router.push("/agency/dashboard/travellers");
        return;
      }

      setTraveller(travellerData);

      // 获取文档
      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("traveller_id", id)
        .order("created_at", { ascending: false });

      setDocuments(docsData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this traveller? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("travellers").delete().eq("id", id);

      if (error) {
        throw error;
      }

      router.push("/agency/dashboard/travellers");
    } catch (error) {
      console.error("Error deleting traveller:", error);
      alert("Failed to delete traveller");
    }
  };

  // 格式化金额
  const formatCurrency = (amount, currency = "AUD") => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  // 获取订单状态样式
  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 获取支付状态样式
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-primary-midnight font-noto-sans">Loading...</p>
      </div>
    );
  }

  if (!traveller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-primary-midnight font-noto-sans">
          Traveller not found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Link
            href="/agency/dashboard/travellers"
            className="text-primary-terracotta font-noto-sans text-sm hover:underline mb-4 inline-block"
          >
            ← Back to Travellers
          </Link>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2]">
            {traveller.first_name} {traveller.last_name}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href={`/agency/dashboard/travellers/${id}/edit`}
            className="bg-primary-midnight text-primary-parchment font-noto-sans text-[14px] font-[500] py-2 px-4 rounded-full hover:bg-primary-stone transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-noto-sans text-[14px] font-[500] py-2 px-4 rounded-full hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Full Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.first_name} {traveller.last_name}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Email
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.email || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Phone
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.phone || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Passport Information */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Passport Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Passport Number
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.passport_number || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Nationality
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.nationality || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Date of Birth
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.date_of_birth
                ? new Date(traveller.date_of_birth).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Trip Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_name
                ? tripNameMap[traveller.trip_name] || traveller.trip_name
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Order Status
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusStyle(traveller.order_status)}`}
            >
              {traveller.order_status
                ? traveller.order_status.charAt(0).toUpperCase() +
                  traveller.order_status.slice(1)
                : "Not Set"}
            </span>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Trip Start Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_start_date
                ? new Date(traveller.trip_start_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Trip End Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_end_date
                ? new Date(traveller.trip_end_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Order Amount
            </p>
            <p className="text-primary-midnight font-noto-sans font-medium">
              {formatCurrency(traveller.order_amount, traveller.currency)}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Payment Status
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusStyle(traveller.payment_status)}`}
            >
              {traveller.payment_status
                ? traveller.payment_status.charAt(0).toUpperCase() +
                  traveller.payment_status.slice(1)
                : "Unpaid"}
            </span>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm mb-1">
              Payment Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.payment_date
                ? new Date(traveller.payment_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {traveller.notes && (
        <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
          <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-4">
            Notes
          </h2>
          <p className="text-primary-midnight font-noto-sans whitespace-pre-wrap">
            {traveller.notes}
          </p>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500]">
            Documents
          </h2>
          <Link
            href={`/agency/dashboard/travellers/${id}/documents`}
            className="text-primary-terracotta font-noto-sans text-sm hover:underline"
          >
            Manage Documents →
          </Link>
        </div>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border border-primary-steel rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <p className="text-primary-midnight font-noto-sans">
                      {doc.name}
                    </p>
                    <p className="text-primary-stone font-noto-sans text-sm">
                      {doc.type}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-terracotta hover:underline font-noto-sans text-sm"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-primary-stone font-noto-sans">
            No documents uploaded yet
          </p>
        )}
      </div>

      {/* Meta Information */}
      <div className="text-primary-stone font-noto-sans text-sm">
        <p>Created: {new Date(traveller.created_at).toLocaleString()}</p>
        <p>Last updated: {new Date(traveller.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
