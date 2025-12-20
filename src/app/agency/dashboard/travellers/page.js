"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TravellersListPage() {
  const router = useRouter();
  const supabase = createClient();
  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTravellers();
  }, []);

  const fetchTravellers = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      // 获取 agency
      const { data: agency } = await supabase
        .from("agencies")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agency) {
        router.push("/agency/login");
        return;
      }

      // 获取所有旅客
      const { data, error } = await supabase
        .from("travellers")
        .select("*")
        .eq("agency_id", agency.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching travellers:", error);
      } else {
        setTravellers(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTravellers = travellers.filter((traveller) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      traveller.first_name?.toLowerCase().includes(searchLower) ||
      traveller.last_name?.toLowerCase().includes(searchLower) ||
      traveller.email?.toLowerCase().includes(searchLower) ||
      traveller.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this traveller?")) {
      return;
    }

    try {
      const { error } = await supabase.from("travellers").delete().eq("id", id);

      if (error) {
        console.error("Error deleting traveller:", error);
        alert("Failed to delete traveller");
      } else {
        setTravellers(travellers.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete traveller");
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-2">
            Travellers
          </h1>
          <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
            Manage your traveller records
          </p>
        </div>
        <Link
          href="/agency/dashboard/travellers/new"
          className="inline-flex items-center justify-center bg-primary-terracotta text-primary-parchment font-noto-sans text-[14px] font-[500] py-3 px-6 rounded-full hover:bg-primary-midnight transition-colors"
        >
          + Add Traveller
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-primary-steel">
        <input
          type="text"
          placeholder="Search travellers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors"
        />
      </div>

      {/* Travellers list */}
      {filteredTravellers.length > 0 ? (
        <div className="bg-white rounded-lg border border-primary-steel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-parchment border-b border-primary-steel">
                <tr>
                  <th className="text-left px-6 py-4 text-primary-midnight font-noto-sans font-medium text-sm">
                    Name
                  </th>
                  <th className="text-left px-6 py-4 text-primary-midnight font-noto-sans font-medium text-sm">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-primary-midnight font-noto-sans font-medium text-sm">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-primary-midnight font-noto-sans font-medium text-sm">
                    Added
                  </th>
                  <th className="text-right px-6 py-4 text-primary-midnight font-noto-sans font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-steel">
                {filteredTravellers.map((traveller) => (
                  <tr
                    key={traveller.id}
                    onClick={() =>
                      router.push(
                        `/agency/dashboard/travellers/${traveller.id}`
                      )
                    }
                    className="hover:bg-primary-parchment transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-primary-midnight font-noto-sans">
                      {traveller.first_name} {traveller.last_name}
                    </td>
                    <td className="px-6 py-4 text-primary-stone font-noto-sans">
                      {traveller.email || "-"}
                    </td>
                    <td className="px-6 py-4 text-primary-stone font-noto-sans">
                      {traveller.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-primary-stone font-noto-sans text-sm">
                      {new Date(traveller.created_at).toLocaleDateString()}
                    </td>
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/agency/dashboard/travellers/${traveller.id}/edit`}
                          className="text-primary-midnight hover:underline font-noto-sans text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(traveller.id)}
                          className="text-red-600 hover:underline font-noto-sans text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 border border-primary-steel text-center">
          {searchTerm ? (
            <p className="text-primary-stone font-noto-sans">
              No travellers found matching &quot;{searchTerm}&quot;
            </p>
          ) : (
            <>
              <p className="text-primary-stone font-noto-sans mb-4">
                No travellers added yet
              </p>
              <Link
                href="/agency/dashboard/travellers/new"
                className="inline-block bg-primary-terracotta text-primary-parchment font-noto-sans text-[14px] font-[500] py-2 px-4 rounded-full hover:bg-primary-midnight transition-colors"
              >
                Add Your First Traveller
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
