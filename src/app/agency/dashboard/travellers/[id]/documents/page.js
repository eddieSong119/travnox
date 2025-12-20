"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TravellerDocumentsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [traveller, setTraveller] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "other",
    file: null,
  });

  const documentTypes = [
    { value: "itinerary", label: "Itinerary" },
    { value: "brochure", label: "Brochure" },
    { value: "passport", label: "Passport" },
    { value: "visa", label: "Visa" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/agency/login");
        return;
      }

      // 获取旅客信息
      const { data: travellerData, error: travellerError } = await supabase
        .from("travellers")
        .select("*, agencies!inner(user_id)")
        .eq("id", id)
        .single();

      if (travellerError || !travellerData) {
        console.error("Error fetching traveller:", travellerError);
        router.push("/agency/dashboard/travellers");
        return;
      }

      // 验证这个旅客属于当前 agency
      if (travellerData.agencies.user_id !== user.id) {
        router.push("/agency/dashboard/travellers");
        return;
      }

      setTraveller(travellerData);

      // 获取文档
      const { data: docsData } = await supabase
        .from("documents")
        .select("*")
        .eq("traveller_id", id)
        .order("created_at", { ascending: false });

      setDocuments(docsData || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        file,
        name: newDocument.name || file.name,
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!newDocument.file) {
      setUploadStatus({
        type: "error",
        message: "Please select a file to upload",
      });
      return;
    }

    if (!newDocument.name.trim()) {
      setUploadStatus({
        type: "error",
        message: "Please enter a document name",
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // 上传文件到 Vercel Blob
      const formData = new FormData();
      formData.append("file", newDocument.file);
      formData.append("travellerId", id);
      formData.append("name", newDocument.name);
      formData.append("type", newDocument.type);

      const response = await fetch("/api/agency/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Document uploaded successfully",
        });
        setNewDocument({ name: "", type: "other", file: null });
        // Reset file input
        const fileInput = document.getElementById("file");
        if (fileInput) fileInput.value = "";
        // Refresh documents list
        fetchData();
      } else {
        setUploadStatus({
          type: "error",
          message: data.error || "Failed to upload document",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: "Failed to upload document. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId);

      if (error) {
        throw error;
      }

      setDocuments(documents.filter((d) => d.id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("Failed to delete document");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-primary-midnight font-noto-sans">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/agency/dashboard/travellers/${id}`}
          className="text-primary-terracotta font-noto-sans text-sm hover:underline mb-4 inline-block"
        >
          ← Back to Traveller
        </Link>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-2">
          Documents
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          Manage documents for {traveller?.first_name} {traveller?.last_name}
        </p>
      </div>

      {/* Upload new document */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Upload New Document
        </h2>
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
              >
                DOCUMENT NAME *
              </label>
              <input
                type="text"
                id="name"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, name: e.target.value })
                }
                placeholder="Enter document name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="type"
                className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
              >
                DOCUMENT TYPE
              </label>
              <select
                id="type"
                value={newDocument.type}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="file"
              className="block text-[#262B2F] font-noto-sans text-base font-medium tracking-[1.6px]"
            >
              FILE *
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-terracotta focus:border-transparent transition-colors bg-white"
            />
            <p className="text-sm text-primary-stone">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
            </p>
          </div>

          {uploadStatus && (
            <div
              className={`p-4 rounded-lg ${
                uploadStatus.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className={`bg-primary-terracotta text-primary-parchment font-noto-sans text-[16px] font-[500] leading-[1.6] tracking-[1.6px] py-3 px-6 rounded-full transition-colors ${
              uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-midnight"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* Documents list */}
      <div className="bg-white rounded-lg p-6 md:p-8 border border-primary-steel">
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-6">
          Uploaded Documents
        </h2>
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-primary-steel rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {doc.type === "passport"
                      ? "🛂"
                      : doc.type === "visa"
                        ? "📋"
                        : doc.type === "itinerary"
                          ? "📅"
                          : doc.type === "brochure"
                            ? "📖"
                            : "📄"}
                  </span>
                  <div>
                    <p className="text-primary-midnight font-noto-sans font-medium">
                      {doc.name}
                    </p>
                    <p className="text-primary-stone font-noto-sans text-sm">
                      {documentTypes.find((t) => t.value === doc.type)?.label ||
                        doc.type}{" "}
                      • {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <a
                    href={doc.blob_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-terracotta hover:underline font-noto-sans text-sm"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:underline font-noto-sans text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-primary-stone font-noto-sans text-center py-8">
            No documents uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}

