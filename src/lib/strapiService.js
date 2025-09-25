/**
 * Strapi Service - Basic API operations
 * Provides reusable methods for fetching data from Strapi CMS
 */

class StrapiService {
  constructor() {
    this.baseUrl = process.env.STRAPI_URL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Fetch all content from a specific API endpoint with deep population
   * @param {string} endpoint - The API endpoint (e.g., 'home', 'articles', 'pages')
   * @param {Object} options - Additional fetch options
   * @returns {Promise<{data: any, error: string|null}>}
   */
  async fetchEndpoint(endpoint, options = {}) {
    try {
      // Remove leading slash if present to ensure consistent URL formatting
      const cleanEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;

      // Use populate=all to automatically populate all nested relations and fields
      const url = `${this.baseUrl}/api/${cleanEndpoint}?populate=all`;

      console.log(`Fetching data from: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: this.defaultHeaders,
        // Add cache and revalidation settings for Next.js
        next: { revalidate: 60 }, // Revalidate every 60 seconds
        ...options,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      return { data: data.data, meta: data.meta, error: null };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return { data: null, error: error.message };
    }
  }

  /**
   * Get the base URL for Strapi
   * @returns {string}
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Check if Strapi service is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.baseUrl;
  }
}

// Create and export a singleton instance
const strapiService = new StrapiService();

export default strapiService;
