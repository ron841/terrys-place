import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/audit", "/audit/"] }],
    sitemap: "https://terrys.place/sitemap.xml",
    host: "https://terrys.place",
  };
}
