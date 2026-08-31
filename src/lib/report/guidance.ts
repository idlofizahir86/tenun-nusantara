"use client";

// ============================================================
// Data bimbingan (guidance) yang dipakai ulang lintas laporan:
// narasi per pulau, rekomendasi karir, dan langkah stimulasi.
// Sumber tunggal agar ortu & dashboard guru konsisten.
// ============================================================

export const ISLAND_BLURB: Record<string, { name: string; desc: string }> = {
  candi: {
    name: "Pulau Candi",
    desc: "Saat menyusun kepingan struktur candi, ia menunjukkan konsentrasi mendalam dan menganalisis pola geometri dengan teliti. Ini menandakan penalaran logis yang kuat.",
  },
  rimba: {
    name: "Pulau Rimba",
    desc: "Sangat peka dalam mengelompokkan ragam fauna dan menyelesaikan tantangan filtrasi. Kepedulian alamnya menonjol, merefleksikan kecerdasan ekologis alami.",
  },
  harmoni: {
    name: "Pulau Harmoni",
    desc: "Menyusun nada gamelan dan motif tenun dengan kepekaan rasa. Kemampuan ini menandakan bakat seni, kreativitas, dan apresiasi estetika yang indah.",
  },
  aksara: {
    name: "Pulau Aksara",
    desc: "Merangkai bait pantun, gurindam, dan alur wayang dengan luwes. Ini menunjukkan kecintaan pada bahasa, sastra, dan kemampuan bercerita.",
  },
  terapung: {
    name: "Pulau Pasar Terapung",
    desc: "Berkolaborasi, bertukar dagangan, dan menengahi perselisihan dengan adil. Ini merefleksikan kecerdasan interpersonal dan jiwa kepemimpinan.",
  },
};

export const CAREERS: Record<string, { title: string; tag: string; desc: string }> = {
  logika: {
    title: "Data Analyst / AI Ethicist",
    tag: "Logika-Matematika",
    desc: "Kemampuan memetakan pola dan memecahkan masalah kompleks sangat ideal untuk bidang Big Data dan teknologi masa depan.",
  },
  naturalis: {
    title: "Conservation Scientist",
    tag: "Naturalis",
    desc: "Kecintaan ekologis membuka jalan bagi kepemimpinan konservasi hutan, energi hijau, dan kelestarian lingkungan.",
  },
  visual: {
    title: "Creative Director",
    tag: "Seni-Kreativitas",
    desc: "Berbakat mengawinkan unsur tradisi nusantara ke dalam desain multimedia, gim, dan kriya kontemporer.",
  },
  linguistik: {
    title: "Penulis / Jurnalis",
    tag: "Linguistik",
    desc: "Kemampuan merangkai kata dan bercerita sangat cocok untuk dunia tulis-menulis, sastra, dan komunikasi.",
  },
  musikal: {
    title: "Komposer / Produser Musik",
    tag: "Musikal",
    desc: "Kepekaan nada dan irama dapat berkembang menjadi profesi seni pertunjukan dan produksi musik.",
  },
  sosial: {
    title: "Pemimpin Komunitas / Diplomat",
    tag: "Interpersonal",
    desc: "Kemampuan bekerja sama dan menengahi konflik ideal untuk kepemimpinan, diplomasi, dan organisasi.",
  },
  intrapersonal: {
    title: "Peneliti / Ilmuwan",
    tag: "Intrapersonal",
    desc: "Sifat reflektif dan mandiri cocok untuk riset, analisis mendalam, dan pengembangan diri.",
  },
  kinestetik: {
    title: "Atlet / Koreografer",
    tag: "Kinestetik",
    desc: "Kelincahan dan energi fisik dapat berkembang menjadi profesi olahraga, tari, dan praktik langsung.",
  },
};

export const NEXT_STEPS: Record<string, string[]> = {
  logika: [
    "Berikan buku bertema misteri detektif atau teka-teki logika matematika ringan di rumah.",
    "Ajak bermain puzzle, catur, atau permainan strategi yang melatih pola berpikir.",
    "Biasakan bertanya 'bagaimana' dan 'mengapa' agar nalar analitisnya terus terasah.",
  ],
  naturalis: [
    "Ajak berkunjung ke taman nasional atau kebun raya sambil mengamati flora-fauna.",
    "Berikan tanggung jawab merawat tanaman atau hewan peliharaan sederhana.",
    "Dukung kegiatan daur ulang dan peduli lingkungan di sekitar rumah.",
  ],
  linguistik: [
    "Sediakan banyak buku bacaan bergambar dan bacakan cerita setiap hari.",
    "Ajak bercerita ulang dan menulis jurnal atau cerita pendek sederhana.",
    "Dukung mengikuti lomba bercerita, membaca puisi, atau menulis.",
  ],
};
