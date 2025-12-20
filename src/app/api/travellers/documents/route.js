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

    // 获取文档列表
    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select("*")
      .eq("traveller_id", traveller.id)
      .order("created_at", { ascending: false });

    if (documentsError) {
      console.error("Error fetching documents:", documentsError);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documents: documents || [],
    });
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
