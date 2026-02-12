import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Awasthi Classes - Best Coaching for Government Exams in Hindaun",
    short_name: "Awasthi Classes",
    description:
      "Top coaching center in Hindaun for REET, Patwari, SSC, LDC, Rajasthan Police, Railway, CET exams. Expert teachers and proven results.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#7c3aed",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
