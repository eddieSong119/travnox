"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminAgencyDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const supabase = createClient();
  const [agency, setAgency] = useState(null);
  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAgencyData();
  }, [resolvedParams.id]);

  const fetchAgencyData = async () => {
    try {
      // Fetch agency
      const { data: agencyData, error: agencyError } = await supabase
        .from("agencies")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (agencyError) throw agencyError;
      setAgency(agencyData);

      // Fetch travellers under this agency
      const { data: travellersData, error: travellersError } = await supabase
        .from("travellers")
        .select("*")
        .eq("agency_id", resolvedParams.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (travellersError) throw travellersError;
      setTravellers(travellersData || []);
    } catch (error) {
      console.error("Error fetching agency:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this agency? This will soft-delete the record."
      )
    )
      return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", resolvedParams.id);

      if (error) throw error;
      router.push("/admin/dashboard/agencies");
    } catch (error) {
      console.error("Error deleting agency:", error);
      alert("Failed to delete agency");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!confirm("Are you sure you want to restore this agency?")) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ deleted_at: null })
        .eq("id", resolvedParams.id);

      if (error) throw error;
      fetchAgencyData();
    } catch (error) {
      console.error("Error restoring agency:", error);
      alert("Failed to restore agency");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-primary-stone font-noto-sans">Loading agency...</p>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-primary-stone font-noto-sans">Agency not found.</p>
      </div>
    );
  }

  const isDeleted = agency.deleted_at !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard/agencies"
            className="text-primary-stone font-noto-sans text-sm hover:underline mb-2 inline-block"
          >
            ← Back to Agencies
          </Link>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
            {agency.agency_name}
          </h1>
          {isDeleted && (
            <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-noto-sans">
              Deleted on {new Date(agency.deleted_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/dashboard/agencies/${agency.id}/edit`}
            className="px-4 py-2 bg-primary-midnight text-white rounded-lg font-noto-sans text-sm hover:bg-primary-stone hover:text-primary-midnight transition-colors"
          >
            Edit Agency
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

      {/* Agency Details */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm p-6">
        <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium mb-4">
          Agency Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Agency Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.agency_name}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Contact Name
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.contact_name}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Email
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.email}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Phone
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.phone || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Address
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.address || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Business License
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {agency.business_license || "-"}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Created At
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {new Date(agency.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider mb-1">
              Last Updated
            </p>
            <p className="text-primary-midnight font-noto-sans">
              {new Date(agency.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Travellers List */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm">
        <div className="p-6 border-b border-primary-steel flex items-center justify-between">
          <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium">
            Travellers ({travellers.length})
          </h2>
        </div>
        {travellers.length === 0 ? (
          <div className="p-6 text-center text-primary-stone font-noto-sans">
            No travellers registered under this agency.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-parchment border-b border-primary-steel">
                <tr>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-steel">
                {travellers.map((traveller) => (
                  <tr
                    key={traveller.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/travellers/${traveller.id}`)
                    }
                    className="hover:bg-primary-parchment transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.first_name} {traveller.last_name}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.trip_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          traveller.order_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : traveller.order_status === "confirmed"
                              ? "bg-blue-100 text-blue-800"
                              : traveller.order_status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {traveller.order_status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
