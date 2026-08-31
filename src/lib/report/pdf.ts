// ============================================================
// Konversi laporan (HTML mandiri) menjadi PDF otomatis di browser.
//
// Mengapa pendekatan ini: versi lama merasterisasi SELURUH laporan
// (elemen setinggi ~20.000px) menjadi satu kanvas besar via html2canvas,
// lalu di-slice manual. Di production kanvas raksasa itu membuat html2canvas
// hang/lempar error → jatuh ke fallback .html.
//
// Solusi: pakai jsPDF .html() yang mem-paginate INTERNALLY menjadi potongan
// per-halaman A4 (kanvas kecil ~820x600px per halaman), sehingga selalu
// tuntas. Konten dirender di iframe tersembunyi agar <head>/<style> ikut
// diterapkan dan aturan body (font, padding) tetap berlaku.
// Fallback: bila gagal, unduh sebagai .html.
// ============================================================

const PAGE_FORMAT = "a4";
const CONTENT_WIDTH_MM = 190; // A4 (210mm) dikurangi margin kiri+kanan 10mm
const RENDER_WIDTH_PX = 860; // lebar iframe agar memuat laporan siswa & ortu

export function downloadHtmlFallback(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.replace(/\.pdf$/i, ".html");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Rendern string HTML lengkap menjadi PDF dan unduh otomatis sebagai .pdf. */
export async function downloadHtmlAsPdf(html: string, filename: string): Promise<void> {
  try {
    // Muat jsPDF secara dinamis agar hanya berjalan di sisi klien saat dibutuhkan.
    // Metode .html() di jsPDF mengimpor html2canvas secara internal.
    const { jsPDF } = await import("jspdf");

    // Render HTML di iframe tersembunyi (off-screen, tetap memiliki layout)
    // agar <style>/<head> ikut diterapkan dan aturan body tetap berlaku.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-100000px";
    iframe.style.top = "0";
    iframe.style.width = `${RENDER_WIDTH_PX}px`;
    iframe.style.height = "4000px";
    iframe.style.border = "0";
    iframe.style.zIndex = "-1";
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    // Tunggu dokumen & style di dalam iframe siap (srcdoc memuat cepat).
    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      // Jaring pengaman bila peristiwa load terlewat.
      setTimeout(resolve, 400);
    });
    const body = iframe.contentDocument?.body;
    if (!body) {
      document.body.removeChild(iframe);
      downloadHtmlFallback(html, filename);
      return;
    }
    await (body.ownerDocument.fonts?.ready || Promise.resolve()).catch(() => {});
    await new Promise((r) => setTimeout(r, 120));

    // jsPDF .html() mem-paginate internal per halaman A4 — selalu tuntas
    // untuk konten berapa pun tingginya, tanpa kanvas raksasa.
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: PAGE_FORMAT });
    await pdf.html(body, {
      margin: [10, 10, 10, 10],
      width: CONTENT_WIDTH_MM,
      windowWidth: RENDER_WIDTH_PX,
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      },
    });

    document.body.removeChild(iframe);
    pdf.save(filename);
  } catch (err) {
    console.error("Gagal membuat PDF:", err);
    downloadHtmlFallback(html, filename);
  }
}
