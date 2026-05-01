import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://terrys.place/sitemap.xml",
    host: "https://terrys.place",
  };
}
