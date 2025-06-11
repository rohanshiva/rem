import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rem",
    short_name: "Rem",
    description: "remember your dreams",
    start_url: "/",
    display: "standalone",
    background_color: "#fefefe",
    theme_color: "#fefefe",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-720x1280.webp",
        type: "image/webp",
        sizes: "720x1280",
        form_factor: "narrow",
      },
      {
        src: "/screenshot-1280x720.webp",
        type: "image/webp",
        sizes: "1280x720",
        form_factor: "wide",
      },
    ],
  };
}
