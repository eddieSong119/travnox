"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const tripNameMap = {
  THE_NORTH: "The North",
  THE_SOUTH: "The South",
  CHUANYU: "Chuanyu",
};

export default function AdminTravellersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchTravellers();
  }, [showDeleted]);

  const fetchTravellers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("travellers")
        .select("*, agencies(agency_name)");

      if (showDeleted) {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setTravellers(data || []);
    } catch (error) {
      console.error("Error fetching travellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this traveller? This will soft-delete the record."
      )
    )
      return;

    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("travellers")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      fetchTravellers();
    } catch (error) {
      console.error("Error deleting traveller:", error);
      alert("Failed to delete traveller");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (id) => {
    if (!confirm("Are you sure you want to restore this traveller?")) return;

    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("travellers")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;
      fetchTravellers();
    } catch (error) {
      console.error("Error restoring traveller:", error);
      alert("Failed to restore traveller");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTravellers = travellers.filter((traveller) => {
    const term = searchTerm.toLowerCase();
    return (
      traveller.first_name?.toLowerCase().includes(term) ||
      traveller.last_name?.toLowerCase().includes(term) ||
      traveller.email?.toLowerCase().includes(term) ||
      traveller.agencies?.agency_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
            Travellers
          </h1>
          <p className="text-primary-stone font-noto-sans text-[16px] mt-2">
            Manage all traveller records across agencies
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-primary-steel shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search travellers or agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="w-4 h-4 text-primary-terracotta rounded focus:ring-primary-terracotta"
              />
              <span className="font-noto-sans text-sm text-primary-midnight">
                Show Deleted Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-primary-steel shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-primary-stone font-noto-sans">
            Loading travellers...
          </div>
        ) : filteredTravellers.length === 0 ? (
          <div className="p-8 text-center text-primary-stone font-noto-sans">
            {searchTerm
              ? `No travellers found matching &quot;${searchTerm}&quot;`
              : showDeleted
                ? "No deleted travellers"
                : "No travellers registered yet"}
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
                    Agency
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Created
                  </th>
                  {showDeleted && (
                    <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                      Deleted
                    </th>
                  )}
                  <th className="px-6 py-4 text-right text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-steel">
                {filteredTravellers.map((traveller) => (
                  <tr
                    key={traveller.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/travellers/${traveller.id}`)
                    }
                    className={`hover:bg-primary-parchment transition-colors cursor-pointer ${
                      showDeleted ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.first_name} {traveller.last_name}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.agencies?.agency_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.trip_name
                        ? tripNameMap[traveller.trip_name] ||
                          traveller.trip_name
                        : "-"}
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
                    <td className="px-6 py-4 text-primary-stone font-noto-sans text-sm">
                      {new Date(traveller.created_at).toLocaleDateString()}
                    </td>
                    {showDeleted && (
                      <td className="px-6 py-4 text-red-600 font-noto-sans text-sm">
                        {new Date(traveller.deleted_at).toLocaleDateString()}
                      </td>
                    )}
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/dashboard/travellers/${traveller.id}/edit`}
                          className="text-primary-midnight hover:underline font-noto-sans text-sm"
                        >
                          Edit
                        </Link>
                        {showDeleted ? (
                          <button
                            onClick={() => handleRestore(traveller.id)}
                            disabled={actionLoading === traveller.id}
                            className="text-green-600 hover:underline font-noto-sans text-sm disabled:opacity-50"
                          >
                            {actionLoading === traveller.id
                              ? "Restoring..."
                              : "Restore"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSoftDelete(traveller.id)}
                            disabled={actionLoading === traveller.id}
                            className="text-red-600 hover:underline font-noto-sans text-sm disabled:opacity-50"
                          >
                            {actionLoading === traveller.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
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
