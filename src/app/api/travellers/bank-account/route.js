import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 获取 traveller ID
    const { data: traveller, error: travellerError } = await supabase
      .from("travellers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (travellerError || !traveller) {
      return NextResponse.json(
        { error: "Traveller record not found" },
        { status: 404 }
      );
    }

    // 获取银行账户信息
    const { data: bankAccount, error: bankAccountError } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("traveller_id", traveller.id)
      .single();

    if (bankAccountError && bankAccountError.code !== "PGRST116") {
      // PGRST116 是"未找到行"的错误代码
      console.error("Error fetching bank account:", bankAccountError);
      return NextResponse.json(
        { error: "Failed to fetch bank account information" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bankAccount: bankAccount || null,
    });
  } catch (error) {
    console.error("Bank account API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accountHolderName, bsb, accountNumber, bankName } = body;

    // 验证必填字段
    if (!accountHolderName || !bsb || !accountNumber || !bankName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 验证 BSB 格式
    if (!/^\d{6}$/.test(bsb.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "BSB must be 6 digits" },
        { status: 400 }
      );
    }

    // 获取 traveller ID
    const { data: traveller, error: travellerError } = await supabase
      .from("travellers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (travellerError || !traveller) {
      return NextResponse.json(
        { error: "Traveller record not found" },
        { status: 404 }
      );
    }

    // 检查是否已存在银行账户
    const { data: existingAccount } = await supabase
      .from("bank_accounts")
      .select("id")
      .eq("traveller_id", traveller.id)
      .single();

    let bankAccount;

    if (existingAccount) {
      // 更新现有账户
      const { data, error } = await supabase
        .from("bank_accounts")
        .update({
          account_holder_name: accountHolderName,
          bsb: bsb.replace(/\s/g, ""),
          account_number: accountNumber,
          bank_name: bankName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAccount.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      bankAccount = data;
    } else {
      // 创建新账户
      const { data, error } = await supabase
        .from("bank_accounts")
        .insert({
          traveller_id: traveller.id,
          account_holder_name: accountHolderName,
          bsb: bsb.replace(/\s/g, ""),
          account_number: accountNumber,
          bank_name: bankName,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      bankAccount = data;
    }

    return NextResponse.json({
      message: "Bank account information saved",
      bankAccount,
    });
  } catch (error) {
    console.error("Bank account API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save bank account information" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  // PUT 方法使用与 POST 相同的逻辑
  return POST(request);
}
