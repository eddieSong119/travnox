import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 验证用户是否为 agency
    const { data: agency, error: agencyError } = await supabase
      .from("agencies")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (agencyError || !agency) {
      return NextResponse.json({ error: "Agency not found" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const travellerId = formData.get("travellerId");
    const name = formData.get("name");
    const type = formData.get("type");

    if (!file || !travellerId || !name || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 验证旅客属于当前 agency
    const { data: traveller, error: travellerError } = await supabase
      .from("travellers")
      .select("id, agency_id")
      .eq("id", travellerId)
      .eq("agency_id", agency.id)
      .single();

    if (travellerError || !traveller) {
      return NextResponse.json(
        { error: "Traveller not found or not authorized" },
        { status: 403 }
      );
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG" },
        { status: 400 }
      );
    }

    // 上传到 Vercel Blob
    const blob = await put(
      `documents/${travellerId}/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
      }
    );

    // 保存到数据库
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .insert({
        traveller_id: travellerId,
        name: name,
        type: type,
        blob_url: blob.url,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save document record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Document uploaded successfully",
        document: document,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
