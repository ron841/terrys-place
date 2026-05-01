import type { MetadataRoute } from "next";

const ROUTES = ["", "menu", "about", "specials", "sports", "visit", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://terrys.place";
  const today = new Date().toISOString().split("T")[0];
  return ROUTES.map((path) => ({
    url: path === "" ? `${base}/` : `${base}/${path}`,
    lastModified: today,
    changeFrequency: path === "" ? "weekly" : path === "menu" ? "monthly" : "monthly",
    priority: path === "" ? 1.0 : path === "menu" ? 0.9 : 0.7,
  }));
}
