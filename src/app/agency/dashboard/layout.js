import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AgencySidebar from "@/components/agency/Sidebar";

export default async function AgencyDashboardLayout({ children }) {
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

  return (
    <div className="min-h-screen bg-primary-parchment">
      <AgencySidebar user={user} agency={agency} />
      <div className="md:ml-64 pt-16 md:pt-0">
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
