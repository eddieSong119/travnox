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
    const { agencyName, contactName, email, phone, password } = body;

    // 验证必填字段
    if (!agencyName || !contactName || !email || !password) {
      return NextResponse.json(
        {
          error: "Agency name, contact name, email, and password are required",
        },
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

    // 检查 email 是否已被使用
    const { data: existingAgency, error: checkError } = await supabaseAdmin
      .from("agencies")
      .select("id")
      .eq("email", email)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking email:", checkError);
      return NextResponse.json(
        { error: "Error validating email" },
        { status: 500 }
      );
    }

    if (existingAgency) {
      return NextResponse.json(
        { error: "An agency with this email already exists" },
        { status: 400 }
      );
    }

    // 创建 Supabase 用户
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Error creating user:", authError);
      return NextResponse.json(
        { error: authError.message || "Failed to create user" },
        { status: 400 }
      );
    }

    // 创建 agency 记录
    const { data: agencyData, error: agencyError } = await supabaseAdmin
      .from("agencies")
      .insert({
        user_id: authData.user.id,
        agency_name: agencyName,
        contact_name: contactName,
        email: email,
        phone: phone || null,
      })
      .select()
      .single();

    if (agencyError) {
      // 如果创建 agency 失败，删除已创建的用户
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error("Error creating agency:", agencyError);
      return NextResponse.json(
        { error: "Failed to create agency record" },
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
        agency: agencyData,
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

