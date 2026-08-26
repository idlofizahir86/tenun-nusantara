// ============================================================
// Pemetaan Aset per Pulau (sesuai dir_rencana.txt) + fallback.
// Path utama = path yang direncanakan; fallback = aset yang ada.
// ============================================================

export interface IslandAsset {
  background: string; // path rencana (mungkin belum ada)
  fallbackBackground: string; // aset yang pasti ada
  backgrounds?: {
    act1?: string;
    act2?: string;
    act3?: string;
    reflection?: string;
  };
}

export const ISLAND_ASSETS: Record<string, IslandAsset> = {
  candi: {
    background:
      "/assets/images/islands/candi/backgrounds/candi-act1-bg-pelataran-kabut-tebal.jpg",
    fallbackBackground: "/assets/images/landing/island-preview-candi.jpg",
    backgrounds: {
      act1: "/assets/images/islands/candi/backgrounds/candi-act1-bg-pelataran-kabut-tebal.jpg",
      act2: "/assets/images/islands/candi/backgrounds/candi-act2-bg-interior-cahaya.jpg",
      act3: "/assets/images/islands/candi/backgrounds/candi-act3-bg-ruang-hidrolik.jpg",
      reflection: "/assets/images/islands/candi/backgrounds/candi-act4-bg-api-unggun-malam.jpg",
    },
  },
  terapung: {
    background:
      "/assets/images/islands/pasar-terapung/backgrounds/terapung-act1-bg-dermaga-sungai.jpg",
    fallbackBackground: "/assets/images/landing/island-preview-pasar.jpg",
    backgrounds: {
      act1: "/assets/images/islands/pasar-terapung/backgrounds/terapung-act1-bg-dermaga-sungai.jpg",
      act2: "/assets/images/islands/pasar-terapung/backgrounds/terapung-act2-bg-pasar-air.jpg",
      act3: "/assets/images/islands/pasar-terapung/backgrounds/terapung-act3-bg-pelabuhan-senyap.jpg",
      reflection: "/assets/images/islands/pasar-terapung/backgrounds/terapung-act4-bg-matahari-terbenam.jpg",
    },
  },
  rimba: {
    background: "/assets/images/islands/rimba/backgrounds/rimba-act1-bg-kanopi-hutan.jpg",
    fallbackBackground: "/assets/images/landing/island-preview-rimba.jpg",
    backgrounds: {
      act1: "/assets/images/islands/rimba/backgrounds/rimba-act1-bg-kanopi-hutan.jpg",
      act2: "/assets/images/islands/rimba/backgrounds/rimba-act2-bg-tanah-lumpur.jpg",
      act3: "/assets/images/islands/rimba/backgrounds/rimba-act3-bg-sungai-desa.jpg",
      reflection: "/assets/images/islands/rimba/backgrounds/rimba-act4-bg-senja-kanopi.jpg",
    },
  },
  harmoni: {
    background: "/assets/images/islands/harmoni/backgrounds/harmoni-act1-bg-festival-seni.png",
    fallbackBackground: "/assets/images/landing/island-preview-harmoni.jpg",
    backgrounds: {
      act1: "/assets/images/islands/harmoni/backgrounds/harmoni-act1-bg-festival-seni.png",
      act2: "/assets/images/islands/harmoni/backgrounds/harmoni-act2-bg-panggung-gamelan.jpg",
      act3: "/assets/images/islands/harmoni/backgrounds/harmoni-act3-bg-ruang-tenun.jpg",
      reflection: "/assets/images/islands/harmoni/backgrounds/harmoni-act4-bg-malam-festival.jpg",
    },
  },
  aksara: {
    background: "/assets/images/islands/aksara/backgrounds/aksara-act1-bg-perpustakaan-kuno.jpg",
    fallbackBackground: "/assets/images/landing/island-preview-aksara.jpg",
    backgrounds: {
      act1: "/assets/images/islands/aksara/backgrounds/aksara-act1-bg-perpustakaan-kuno.jpg",
      act2: "/assets/images/islands/aksara/backgrounds/aksara-act2-bg-ruang-sastra.jpg",
      act3: "/assets/images/islands/aksara/backgrounds/aksara-act3-bg-panggung-wayang.jpg",
      reflection: "/assets/images/islands/aksara/backgrounds/aksara-act4-bg-perpustakaan-senja.jpg",
    },
  },
};

// Ambil aset untuk id pulau; default ke fallback.
export function getIslandAsset(id: string): IslandAsset {
  return (
    ISLAND_ASSETS[id] ?? {
      background: "/assets/images/landing/island-preview-candi.jpg",
      fallbackBackground: "/assets/images/landing/island-preview-candi.jpg",
    }
  );
}

// Background untuk babak tertentu (1/2/3). Fallback ke act1 lalu ke aset umum.
export function getActBackground(id: string, actNumber: number): string {
  const asset = ISLAND_ASSETS[id];
  const key = `act${actNumber}` as "act1" | "act2" | "act3";
  return (
    asset?.backgrounds?.[key] || asset?.background || asset?.fallbackBackground
  );
}

// Background untuk sesi Refleksi. Fallback ke act1 lalu ke aset umum.
export function getReflectionBackground(id: string): string {
  const asset = ISLAND_ASSETS[id];
  return (
    asset?.backgrounds?.reflection || asset?.background || asset?.fallbackBackground
  );
}
