import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SkillSetu — Master the skills engineering careers need",
    short_name: "SkillSetu",
    description: "Career-first skill mastery for engineering students.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#4057e8",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
