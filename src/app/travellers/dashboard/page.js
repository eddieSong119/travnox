import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/travellers/account/register");
  }

  // 获取 traveller 信息
  const { data: traveller } = await supabase
    .from("travellers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // 检查是否有银行账户信息
  const { data: bankAccount } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("traveller_id", traveller?.id)
    .single();

  // 获取文档数量
  const { count: documentCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("traveller_id", traveller?.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-4">
          Welcome back, {traveller?.first_name || "Traveller"}!
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          This is your travel management dashboard
        </p>
      </div>

      {/* Quick overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Trip Status
              </p>
              <p className="text-primary-midnight font-pp-museum text-2xl font-[500]">
                Confirmed
              </p>
            </div>
            <div className="text-3xl">✈️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Bank Account
              </p>
              <p className="text-primary-midnight font-pp-museum text-2xl font-[500]">
                {bankAccount ? "Set" : "Not Set"}
              </p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-primary-steel">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-stone font-noto-sans text-sm mb-1">
                Documents
              </p>
              <p className="text-primary-midnight font-pp-museum text-2xl font-[500]">
                {documentCount || 0}
              </p>
            </div>
            <div className="text-3xl">📄</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg p-6 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/travellers/dashboard/payment"
            className="flex items-center justify-between p-4 border border-primary-steel rounded-lg hover:bg-primary-parchment transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💳</span>
              <span className="text-primary-midnight font-noto-sans font-medium">
                {bankAccount ? "Update Bank Account" : "Set Bank Account"}
              </span>
            </div>
            <span className="text-primary-stone">→</span>
          </a>

          <a
            href="/travellers/dashboard/documents"
            className="flex items-center justify-between p-4 border border-primary-steel rounded-lg hover:bg-primary-parchment transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📄</span>
              <span className="text-primary-midnight font-noto-sans font-medium">
                View Itineraries & Brochures
              </span>
            </div>
            <span className="text-primary-stone">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
