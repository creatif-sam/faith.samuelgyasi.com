import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Faith — Samuel Kobina Gyasi",
    short_name: "Faith",
    description:
      "A bilingual (EN/FR) space of faith, scripture, and sacred conviction. Samuel Kobina Gyasi — anchored in the Word, walking in purpose.",
    start_url: "/",
    display: "standalone",
    background_color: "#080807",
    theme_color: "#7b8ffc",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
