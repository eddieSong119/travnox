import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 代理访问文档文件（带权限验证）
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/agency/login", request.url));
    }

    // 获取文档信息
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*, travellers(agency_id)")
      .eq("id", id)
      .single();

    if (docError || !document) {
      return new NextResponse("Document not found", { status: 404 });
    }

    // 检查是否为管理员
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let hasPermission = false;

    if (admin) {
      hasPermission = true;
    } else {
      // 检查是否为文档所属的 agency
      const { data: agency } = await supabase
        .from("agencies")
        .select("id")
        .eq("user_id", user.id)
        .eq("id", document.travellers.agency_id)
        .single();

      if (agency) {
        hasPermission = true;
      }
    }

    if (!hasPermission) {
      return new NextResponse("Access denied", { status: 403 });
    }

    // 重定向到实际的 blob URL
    return NextResponse.redirect(document.blob_url);
  } catch (error) {
    console.error("Error viewing document:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
