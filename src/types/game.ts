// ============================================================
// Tipe untuk Kerangka Game Pulau (Island Game Framework)
// ============================================================

export type MinigameType =
  | "observe"
  | "puzzle"
  | "puzzle16"
  | "pipe"
  | "pattern"
  | "choice"
  | "sequence"
  | "match"
  | "barter"
  | "tune"
  | "stage"
  | "mediate"
  | "filter"
  | "weave"
  | "verse";

// Pertanyaan asesmen tersembunyi (interupsi)
export interface AssessmentQuestion {
  id: string;
  prompt: string;
  category: string; // label kategori (mis. "Analitis & Pola")
  icon?: string;
  options: {
    label: string; // "Pilihan A"
    text: string;
    trait: string; // trait yang diukur (untuk telemetry/scoring)
  }[];
}

// Data spesifik per jenis mini-game
export type MinigamePayload =
  | {
      type: "observe";
      target: string; // objek yang dicari, mis. "Pilar"
      total: number; // total objek target
      items: {
        id: string;
        label: string;
        kind: "target" | "distractor";
        emoji?: string;
        image?: string; // path aset gambar (fallback ke emoji)
      }[];
      question: string; // pertanyaan naratif setelah semua ditemukan
      options: { label: string; text: string; trait: string }[];
    }
  | {
      type: "puzzle";
      patterns: {
        id: string;
        name: string; // jenis pola (Simetri Rotasi, Fraktal, Flora, Aksara)
        emoji: string; // relief yang benar
        image?: string; // path gambar pola (fallback ke emoji)
        options: { id: string; emoji: string; label: string; image?: string }[];
      }[];
    }
  | {
      type: "puzzle16";
      master: string; // path gambar acuan (foto utuh)
      pieces: { id: string; slot: number; image: string; label?: string }[]; // 16 keping
    }
  | {
      type: "pipe";
      target: string; // tujuan air, mis. "Poros Timbangan"
      slots: { id: string; required: string; label: string; image: string }[]; // pipa yang harus dipasang
      pieces: { id: string; label: string; image: string }[]; // pipa pilihan (gambar)
    }
  | {
      type: "pattern";
      slots: number; // jumlah slot kosong yang harus diisi
      pieces: string[]; // label/kunci potongan yang tersedia
      solution: (number | null)[]; // indeks potongan per slot (null = belum terisi)
    }
  | {
      type: "choice";
      question: string;
      options: { id: string; text: string; correct: boolean }[];
    }
  | {
      type: "sequence";
      items: { id: string; label: string }[];
      correctOrder: string[];
    }
  | {
      type: "match";
      pairs: {
        id: string;
        left: { label: string; emoji?: string; image?: string };
        right: { label: string; emoji?: string; image?: string };
      }[];
    }
  | {
      type: "barter";
      target: number; // total nilai yang harus dicapai
      targetLabel: string; // deskripsi target, mis. "10 keranjang hasil"
      items: { id: string; label: string; emoji?: string; image?: string; value: number }[];
    }
  | {
      type: "tune";
      notes: {
        id: string;
        name: string; // nama nada, mis. "Pelog 1"
        emoji?: string;
        image?: string; // gambar alat gamelan
        target: number; // posisi nada yang benar (0-100)
      }[];
    }
  | {
      type: "stage";
      steps: { id: string; label: string; emoji?: string; image?: string; description?: string }[];
      correctOrder: string[];
    }
  | {
      type: "mediate";
      goal: number; // target kesepakatan (0-100)
      rounds: {
        id: string;
        situation: string; // konflik yang digambarkan
        imageA?: string; // gambar karakter pihak pertama
        imageB?: string; // gambar karakter pihak kedua
        options: {
          id: string;
          text: string;
          effect: number; // +kesepakatan (positif/0/negatif)
          tone: "baik" | "netral" | "buruk";
        }[];
      }[];
    }
  | {
      type: "filter";
      layers: { id: string; name: string; emoji?: string; image?: string; description?: string }[];
      correctOrder: string[]; // urutan lapisan penyaring (atas->bawah)
    }
  | {
      type: "weave";
      patterns: {
        id: string;
        name: string; // nama motif tenun
        targetEmoji: string; // motif/benang yang benar (fallback)
        targetImage?: string; // gambar motif yang benar (jika ada)
        options: { id: string; emoji: string; label: string; image?: string }[];
      }[];
    }
  | {
      type: "verse";
      stanzas: {
        id: string;
        title: string; // "Pantun 1"
        image?: string; // ilustrasi tambahan (opsional)
        lines: string[]; // bait dengan satu bagian kosong "__"
        options: { id: string; text: string; correct: boolean }[];
      }[];
    };

export interface MinigameConfig {
  id: string;
  type: MinigameType;
  title: string;
  instructions: string;
  hint: string;
  nalaDialog: string; // narasi pengantar dari NALA
  game: MinigamePayload;
  assessment: AssessmentQuestion[]; // 3 pertanyaan interupsi
}

export interface ActConfig {
  number: 1 | 2 | 3;
  minigame: MinigameConfig;
}

export interface ReflectionConfig {
  theme: string; // contoh: "Sesi Api Unggun"
  title: string;
  intro: string;
  questions: string[]; // NALA bertanya alasan jawaban asesmen
}

export interface IslandConfig {
  id: string;
  name: string;
  category: string;
  background: string; // url gambar background
  accent: string; // warna aksen (hex)
  acts: ActConfig[];
  reflection: ReflectionConfig;
}
