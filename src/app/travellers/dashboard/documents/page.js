"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import DocumentCard from "@/components/travellers/DocumentCard";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/travellers/account/register");
        return;
      }

      const response = await fetch("/api/travellers/documents");
      const data = await response.json();

      if (response.ok) {
        setDocuments(data.documents || []);
      } else {
        setError(data.error || "Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError("Failed to fetch documents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const itineraries = documents.filter((doc) => doc.type === "itinerary");
  const brochures = documents.filter((doc) => doc.type === "brochure");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-primary-midnight font-noto-sans">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-4">
            Documents
          </h1>
        </div>
        <div className="bg-red-100 text-red-800 border border-red-300 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-primary-midnight font-pp-museum text-[32px] md:text-[48px] font-[500] leading-[1.2] mb-4">
          Documents
        </h1>
        <p className="text-primary-midnight font-noto-sans text-[16px] text-primary-stone">
          View and download your itineraries and brochures
        </p>
      </div>

      {/* Itineraries */}
      <div>
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-4">
          Itineraries
        </h2>
        {itineraries.length > 0 ? (
          <div className="space-y-4">
            {itineraries.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 border border-primary-steel text-center">
            <p className="text-primary-stone font-noto-sans">
              No itineraries available
            </p>
          </div>
        )}
      </div>

      {/* Brochures */}
      <div>
        <h2 className="text-primary-midnight font-pp-museum text-[24px] font-[500] mb-4">
          Brochures
        </h2>
        {brochures.length > 0 ? (
          <div className="space-y-4">
            {brochures.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 border border-primary-steel text-center">
            <p className="text-primary-stone font-noto-sans">
              No brochures available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
