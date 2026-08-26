export const siteConfig = {
  name: "Tenun Nusantara",
  tagline: "Merajut Bakat, Menenun Masa Depan",
  description:
    "Platform gamifikasi naratif Nusantara untuk pemetaan minat bakat anak usia 7-14 tahun bersama NALA",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: "ATEAM",
  
  links: {
    github: "", // Optional
    twitter: "", // Optional
  },

  contact: {
    email: "hello@tenunnusantara.id",
  },
} as const;