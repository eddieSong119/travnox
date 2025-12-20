import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// 这个 API 仅供开发/初始设置使用
// 在生产环境中应该禁用或添加额外的安全措施

export async function POST(request) {
  try {
    const { email, password, name, secretKey } = await request.json();

    // 简单的安全检查 - 需要一个 secret key
    // 在生产环境中，应该使用更安全的方式，或者完全禁用此端点
    if (secretKey !== process.env.ADMIN_CREATE_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // 使用 service role 来创建用户
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 创建 auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 创建 admin 记录
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .insert({
        user_id: authData.user.id,
        name,
        email,
        role: "admin",
      })
      .select()
      .single();

    if (adminError) {
      console.error("Admin creation error:", adminError);
      // 如果 admin 记录创建失败，删除 auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Admin created successfully",
      admin: {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
