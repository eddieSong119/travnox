"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const tripNameMap = {
  THE_NORTH: "The North",
  THE_SOUTH: "The South",
  CHUANYU: "Chuanyu",
};

export default function AdminTravellerDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [traveller, setTraveller] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTravellerData();
  }, [resolvedParams.id]);

  const fetchTravellerData = async () => {
    try {
      // Fetch traveller
      const { data: travellerData, error: travellerError } = await supabase
        .from("travellers")
        .select("*, agencies(agency_name, email)")
        .eq("id", resolvedParams.id)
        .single();

      if (travellerError) throw travellerError;
      setTraveller(travellerData);

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("*")
        .eq("traveller_id", resolvedParams.id)
        .order("created_at", { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);
    } catch (error) {
      console.error("Error fetching traveller:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this traveller? This will soft-delete the record."
      )
    )
      return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("travellers")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", resolvedParams.id);

      if (error) throw error;
      router.push("/admin/dashboard/travellers");
    } catch (error) {
      console.error("Error deleting traveller:", error);
      alert("Failed to delete traveller");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm("Are you sure you want to restore this traveller?")) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("travellers")
        .update({ deleted_at: null })
        .eq("id", resolvedParams.id);

      if (error) throw error;
      fetchTravellerData();
    } catch (error) {
      console.error("Error restoring traveller:", error);
      alert("Failed to restore traveller");
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: currency || "AUD",
    }).format(amount);
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-blue-100 text-blue-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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

  if (!traveller) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-primary-stone font-noto-sans">
          Traveller not found.
        </p>
      </div>
    );
  }

  const isDeleted = traveller.deleted_at !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard/travellers"
            className="text-primary-stone font-noto-sans text-sm hover:underline mb-2 inline-block"
          >
            ← Back to Travellers
          </Link>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
            {traveller.first_name} {traveller.last_name}
          </h1>
          {isDeleted && (
            <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-noto-sans">
              Deleted on {new Date(traveller.deleted_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/dashboard/travellers/${traveller.id}/edit`}
            className="px-4 py-2 bg-primary-midnight text-white rounded-lg font-noto-sans text-sm hover:bg-primary-stone hover:text-primary-midnight transition-colors"
          >
            Edit Traveller
          </Link>
          {isDeleted ? (
            <button
              onClick={handleRestore}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-noto-sans text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Restoring..." : "Restore"}
            </button>
          ) : (
            <button
              onClick={handleSoftDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-noto-sans text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>

      {/* Agency Link */}
      {traveller.agencies && (
        <div className="bg-primary-midnight/10 rounded-xl p-4">
          <p className="text-primary-midnight font-noto-sans text-sm">
            Agency:{" "}
            <Link
              href={`/admin/dashboard/agencies/${traveller.agency_id}`}
              className="font-medium hover:underline"
            >
              {traveller.agencies.agency_name}
            </Link>
          </p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
        <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Full Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.first_name} {traveller.last_name}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Email
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.email || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Phone
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.phone || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Date of Birth
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.date_of_birth
                ? new Date(traveller.date_of_birth).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Passport Number
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.passport_number || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Nationality
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.nationality || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
        <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Trip Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_name
                ? tripNameMap[traveller.trip_name] || traveller.trip_name
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Order Status
            </p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusStyle(traveller.order_status)}`}
            >
              {traveller.order_status || "pending"}
            </span>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Trip Start Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_start_date
                ? new Date(traveller.trip_start_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Trip End Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.trip_end_date
                ? new Date(traveller.trip_end_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Order Amount
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {formatCurrency(traveller.order_amount, traveller.currency)}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Payment Status
            </p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusStyle(traveller.payment_status)}`}
            >
              {traveller.payment_status || "unpaid"}
            </span>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Payment Date
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.payment_date
                ? new Date(traveller.payment_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Commission Rate
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.commission_rate
                ? `${traveller.commission_rate}%`
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Commission Amount
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {formatCurrency(traveller.commission_amount, traveller.currency)}
            </p>
          </div>
        </div>
        {traveller.notes && (
          <div className="mt-6">
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Notes
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {traveller.notes}
            </p>
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm">
        <div className="p-6 border-b border-primary-steel">
          <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium">
            Documents ({documents.length})
          </h2>
        </div>
        {documents.length === 0 ? (
          <div className="p-6 text-center text-primary-stone font-noto-sans">
            No documents uploaded.
          </div>
        ) : (
          <div className="divide-y divide-primary-steel">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-primary-midnight font-noto-sans font-medium">
                    {doc.name}
                  </p>
                  <p className="text-primary-stone font-noto-sans text-sm">
                    {doc.type} • {new Date(doc.created_at).toLocaleDateString()}
                  </p>
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
        )}
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
        <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
          Record Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Created At
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {new Date(traveller.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Last Updated
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {new Date(traveller.updated_at).toLocaleString()}
            </p>
          </div>
          {traveller.zoho_deal_id && (
            <div>
              <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
                Zoho Deal ID
              </p>
              <p className="text-primary-midnight font-noto-sans">
                {traveller.zoho_deal_id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
