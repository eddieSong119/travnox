"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminAgenciesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAgencies();
  }, [showDeleted]);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      let query = supabase.from("agencies").select("*");

      if (showDeleted) {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setAgencies(data || []);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this agency? This will soft-delete the record."
      )
    )
      return;

    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      fetchAgencies();
    } catch (error) {
      console.error("Error deleting agency:", error);
      alert("Failed to delete agency");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (id) => {
    if (!confirm("Are you sure you want to restore this agency?")) return;

    setActionLoading(id);
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ deleted_at: null })
        .eq("id", id);

      if (error) throw error;
      fetchAgencies();
    } catch (error) {
      console.error("Error restoring agency:", error);
      alert("Failed to restore agency");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAgencies = agencies.filter((agency) => {
    const term = searchTerm.toLowerCase();
    return (
      agency.agency_name?.toLowerCase().includes(term) ||
      agency.contact_name?.toLowerCase().includes(term) ||
      agency.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
            Agencies
          </h1>
          <p className="text-primary-stone font-noto-sans text-[16px] mt-2">
            Manage all registered travel agencies
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-primary-steel shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agencies..."
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
            Loading agencies...
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="p-8 text-center text-primary-stone font-noto-sans">
            {searchTerm
              ? `No agencies found matching &quot;${searchTerm}&quot;`
              : showDeleted
                ? "No deleted agencies"
                : "No agencies registered yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-parchment border-b border-primary-steel">
                <tr>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Agency Name
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-primary-midnight font-noto-sans text-sm font-medium uppercase tracking-wider">
                    Email
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
                {filteredAgencies.map((agency) => (
                  <tr
                    key={agency.id}
                    onClick={() =>
                      router.push(`/admin/dashboard/agencies/${agency.id}`)
                    }
                    className={`hover:bg-primary-parchment transition-colors cursor-pointer ${
                      showDeleted ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {agency.agency_name}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {agency.contact_name}
                    </td>
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {agency.email}
                    </td>
                    <td className="px-6 py-4 text-primary-stone font-noto-sans text-sm">
                      {new Date(agency.created_at).toLocaleDateString()}
                    </td>
                    {showDeleted && (
                      <td className="px-6 py-4 text-red-600 font-noto-sans text-sm">
                        {new Date(agency.deleted_at).toLocaleDateString()}
                      </td>
                    )}
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/dashboard/agencies/${agency.id}/edit`}
                          className="text-primary-midnight hover:underline font-noto-sans text-sm"
                        >
                          Edit
                        </Link>
                        {showDeleted ? (
                          <button
                            onClick={() => handleRestore(agency.id)}
                            disabled={actionLoading === agency.id}
                            className="text-green-600 hover:underline font-noto-sans text-sm disabled:opacity-50"
                          >
                            {actionLoading === agency.id
                              ? "Restoring..."
                              : "Restore"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSoftDelete(agency.id)}
                            disabled={actionLoading === agency.id}
                            className="text-red-600 hover:underline font-noto-sans text-sm disabled:opacity-50"
                          >
                            {actionLoading === agency.id
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
