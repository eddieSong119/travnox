export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://travnox.com.au";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
