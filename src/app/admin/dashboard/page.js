import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 获取当前管理员信息
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 获取统计数据 - 使用 service role 来绕过 RLS
  const { count: totalAgencies } = await supabase
    .from("agencies")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  const { count: deletedAgencies } = await supabase
    .from("agencies")
    .select("*", { count: "exact", head: true })
    .not("deleted_at", "is", null);

  const { count: totalTravellers } = await supabase
    .from("travellers")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  const { count: deletedTravellers } = await supabase
    .from("travellers")
    .select("*", { count: "exact", head: true })
    .not("deleted_at", "is", null);

  // 获取最近注册的 agencies
  const { data: recentAgencies } = await supabase
    .from("agencies")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  // 获取最近添加的 travellers
  const { data: recentTravellers } = await supabase
    .from("travellers")
    .select("*, agencies(agency_name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[40px] font-[500] leading-[1.2]">
          Admin Dashboard
        </h1>
        <p className="text-primary-stone font-noto-sans text-[16px] mt-2">
          Welcome back, {admin?.name || "Admin"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-primary-steel shadow-sm">
          <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider">
            Active Agencies
          </p>
          <p className="text-primary-midnight font-pp-museum text-[36px] font-medium mt-2">
            {totalAgencies || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-primary-steel shadow-sm">
          <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider">
            Deleted Agencies
          </p>
          <p className="text-red-600 font-pp-museum text-[36px] font-medium mt-2">
            {deletedAgencies || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-primary-steel shadow-sm">
          <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider">
            Active Travellers
          </p>
          <p className="text-primary-midnight font-pp-museum text-[36px] font-medium mt-2">
            {totalTravellers || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-primary-steel shadow-sm">
          <p className="text-primary-stone font-noto-sans text-sm uppercase tracking-wider">
            Deleted Travellers
          </p>
          <p className="text-red-600 font-pp-museum text-[36px] font-medium mt-2">
            {deletedTravellers || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/dashboard/agencies"
          className="bg-primary-midnight text-white rounded-xl p-6 hover:bg-primary-stone hover:text-primary-midnight transition-colors"
        >
          <h3 className="font-pp-museum text-[20px] font-medium">
            Manage Agencies
          </h3>
          <p className="font-noto-sans text-sm mt-2 opacity-80">
            View, edit, and manage all registered agencies
          </p>
        </Link>
        <Link
          href="/admin/dashboard/travellers"
          className="bg-primary-terracotta text-white rounded-xl p-6 hover:bg-primary-stone hover:text-primary-midnight transition-colors"
        >
          <h3 className="font-pp-museum text-[20px] font-medium">
            Manage Travellers
          </h3>
          <p className="font-noto-sans text-sm mt-2 opacity-80">
            View and manage all traveller records
          </p>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agencies */}
        <div className="bg-white rounded-xl border border-primary-steel shadow-sm">
          <div className="p-6 border-b border-primary-steel">
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium">
              Recent Agencies
            </h2>
          </div>
          <div className="divide-y divide-primary-steel">
            {recentAgencies && recentAgencies.length > 0 ? (
              recentAgencies.map((agency) => (
                <Link
                  key={agency.id}
                  href={`/admin/dashboard/agencies/${agency.id}`}
                  className="block p-4 hover:bg-primary-parchment transition-colors"
                >
                  <p className="text-primary-midnight font-noto-sans font-medium">
                    {agency.agency_name}
                  </p>
                  <p className="text-primary-stone font-noto-sans text-sm">
                    {agency.contact_name} • {agency.email}
                  </p>
                </Link>
              ))
            ) : (
              <div className="p-4 text-primary-stone font-noto-sans">
                No agencies registered yet.
              </div>
            )}
          </div>
        </div>

        {/* Recent Travellers */}
        <div className="bg-white rounded-xl border border-primary-steel shadow-sm">
          <div className="p-6 border-b border-primary-steel">
            <h2 className="text-primary-midnight font-pp-museum text-[20px] font-medium">
              Recent Travellers
            </h2>
          </div>
          <div className="divide-y divide-primary-steel">
            {recentTravellers && recentTravellers.length > 0 ? (
              recentTravellers.map((traveller) => (
                <Link
                  key={traveller.id}
                  href={`/admin/dashboard/travellers/${traveller.id}`}
                  className="block p-4 hover:bg-primary-parchment transition-colors"
                >
                  <p className="text-primary-midnight font-noto-sans font-medium">
                    {traveller.first_name} {traveller.last_name}
                  </p>
                  <p className="text-primary-stone font-noto-sans text-sm">
                    {traveller.agencies?.agency_name || "Unknown Agency"} •{" "}
                    {traveller.trip_name || "No trip assigned"}
                  </p>
                </Link>
              ))
            ) : (
              <div className="p-4 text-primary-stone font-noto-sans">
                No travellers added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
