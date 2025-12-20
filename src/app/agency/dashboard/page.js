import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AgencyDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/agency/login");
  }

  // 获取 agency 信息
  const { data: agency } = await supabase
    .from("agencies")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!agency) {
    redirect("/agency/login");
  }

  // 获取旅客数量
  const { count: travellerCount } = await supabase
    .from("travellers")
    .select("*", { count: "exact", head: true })
    .eq("agency_id", agency.id);

  // 获取最近添加的旅客
  const { data: recentTravellers } = await supabase
    .from("travellers")
    .select("*")
    .eq("agency_id", agency.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-4">
          Welcome, {agency.agency_name}!
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Manage your travellers and view their information
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Total Travellers
              </p>
              <p className="text-primary-midnight font-pp-museum text-3xl font-[500]">
                {travellerCount || 0}
              </p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Agency Status
              </p>
              <p className="text-primary-midnight font-pp-museum text-2xl font-[500]">
                Active
              </p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Contact
              </p>
              <p className="text-primary-midnight font-pp-museum text-lg font-[500] truncate">
                {agency.contact_name}
              </p>
            </div>
            <div className="text-3xl">📞</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg p-6 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/agency/dashboard/travellers/new"
            className="flex items-center justify-between p-4 border border-primary-steel rounded-lg hover:bg-primary-parchment transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">➕</span>
              <span className="text-primary-midnight font-noto-sans font-medium">
                Add New Traveller
              </span>
            </div>
            <span className="text-primary-stone">→</span>
          </Link>

          <Link
            href="/agency/dashboard/travellers"
            className="flex items-center justify-between p-4 border border-primary-steel rounded-lg hover:bg-primary-parchment transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <span className="text-primary-midnight font-noto-sans font-medium">
                View All Travellers
              </span>
            </div>
            <span className="text-primary-stone">→</span>
          </Link>
        </div>
      </div>

      {/* Recent travellers */}
      <div className="bg-white rounded-lg p-6 border border-primary-steel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500]">
            Recent Travellers
          </h2>
          <Link
            href="/agency/dashboard/travellers"
            className="text-primary-terracotta font-noto-sans text-sm hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentTravellers && recentTravellers.length > 0 ? (
          <div className="space-y-3">
            {recentTravellers.map((traveller) => (
              <Link
                key={traveller.id}
                href={`/agency/dashboard/travellers/${traveller.id}`}
                className="flex items-center justify-between p-4 border border-primary-steel rounded-lg hover:bg-primary-parchment transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary-terracotta flex items-center justify-center text-white font-noto-sans font-medium">
                    {traveller.first_name?.[0] || "T"}
                  </div>
                  <div>
                    <p className="text-primary-midnight font-noto-sans font-medium">
                      {traveller.first_name} {traveller.last_name}
                    </p>
                    <p className="text-primary-stone font-noto-sans text-sm">
                      {traveller.email || "No email"}
                    </p>
                  </div>
                </div>
                <span className="text-primary-stone">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-primary-stone font-noto-sans mb-4">
              No travellers added yet
            </p>
            <Link
              href="/agency/dashboard/travellers/new"
              className="inline-block bg-primary-terracotta text-primary-parchment font-noto-sans text-[14px] font-[500] py-2 px-4 rounded-full hover:bg-primary-midnight transition-colors"
            >
              Add Your First Traveller
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

