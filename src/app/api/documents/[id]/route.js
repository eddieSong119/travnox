import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 获取文档（带权限验证）
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 获取文档信息
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*, travellers(agency_id)")
      .eq("id", id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // 检查是否为管理员
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (admin) {
      // 管理员可以访问所有文档
      return NextResponse.json({ url: document.blob_url });
    }

    // 检查是否为文档所属的 agency
    const { data: agency } = await supabase
      .from("agencies")
      .select("id")
      .eq("user_id", user.id)
      .eq("id", document.travellers.agency_id)
      .single();

    if (!agency) {
      return NextResponse.json(
        { error: "You do not have permission to access this document" },
        { status: 403 }
      );
    }

    // 返回文档 URL
    return NextResponse.json({ url: document.blob_url });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 删除文档（带权限验证）
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 获取文档信息
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*, travellers(agency_id)")
      .eq("id", id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
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
      return NextResponse.json(
        { error: "You do not have permission to delete this document" },
        { status: 403 }
      );
    }

    // 删除数据库记录（Blob 文件会保留，但无法被访问）
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
