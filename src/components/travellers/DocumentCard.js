"use client";

export default function DocumentCard({ document }) {
  const handleDownload = () => {
    if (document.blob_url) {
      window.open(document.blob_url, "_blank");
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case "itinerary":
        return "📋";
      case "brochure":
        return "📖";
      default:
        return "📄";
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case "itinerary":
        return "Itinerary";
      case "brochure":
        return "Brochure";
      default:
        return "Document";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-primary-steel hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-4xl">{getDocumentIcon(document.type)}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-primary-midnight font-pp-museum text-[20px] font-[500] mb-1">
              {document.name}
            </h3>
            <p className="text-primary-stone font-noto-sans text-sm mb-2">
              {getDocumentTypeLabel(document.type)}
            </p>
            <p className="text-primary-stone font-noto-sans text-xs">
              Created:{" "}
              {new Date(document.created_at).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="ml-4 px-4 py-2 bg-primary-terracotta text-white font-noto-sans font-medium rounded-lg hover:bg-primary-midnight transition-colors"
        >
          Download
        </button>
      </div>
    </div>
  );
}
