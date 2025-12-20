import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 使用服务角色密钥来创建用户和管理数据
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { dealId, firstName, lastName, email, password } = body;

    // 验证必填字段
    if (!dealId || !firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // 检查 dealId 是否已经被使用
    const { data: existingTraveller, error: checkError } = await supabaseAdmin
      .from("travellers")
      .select("id")
      .eq("zoho_deal_id", dealId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 是"未找到行"的错误代码，这是正常的
      console.error("Error checking deal ID:", checkError);
      return NextResponse.json(
        { error: "Error validating deal ID" },
        { status: 500 }
      );
    }

    if (existingTraveller) {
      return NextResponse.json(
        { error: "This deal ID has already been used" },
        { status: 400 }
      );
    }

    // 创建 Supabase 用户
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // 自动确认邮箱
      });

    if (authError) {
      console.error("Error creating user:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to create user" },
        { status: 400 }
      );
    }

    // 创建 traveller 记录
    const { data: travellerData, error: travellerError } = await supabaseAdmin
      .from("travellers")
      .insert({
        user_id: authData.user.id,
        zoho_deal_id: dealId,
        first_name: firstName,
        last_name: lastName,
        email: email,
      })
      .select()
      .single();

    if (travellerError) {
      // 如果创建 traveller 失败，删除已创建的用户
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("Error creating traveller:", travellerError);
      return NextResponse.json(
        { error: "Failed to create traveller record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        traveller: travellerData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
