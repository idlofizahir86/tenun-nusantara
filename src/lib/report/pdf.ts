// ============================================================
// Konversi laporan (HTML mandiri) menjadi PDF di browser.
//
// Mengapa pendekatan ini: versi lama merasterisasi SELURUH laporan
// (elemen setinggi ~20.000px) menjadi satu kanvas besar via html2canvas,
// lalu di-slice manual → hang/lempar error di konten tinggi.
// Versi kedua memakai jsPDF .html() (html2canvas internal) yang ternyata
// masih memproduksi paginasi rusak (ratusan/dua-belas halaman dengan isi
// terpotong dan banyak spasi kosong) pada laporan yang panjang.
//
// Solusi (versi ini): pakai mesin print bawaan browser (print-to-PDF).
// Laporan HTML mandiri dirender di iframe tersembunyi lalu dicetak via
// contentWindow.print(). Mesin print browser mem-paginate dengan benar
// (A4, @page, break-inside), tanpa batasan tinggi konten, dan hasilnya
// konsisten dengan "Save as PDF" standar.
// Fallback: bila gagal, unduh sebagai .html.
// ============================================================

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

/** Tambahkan aturan print (A4 + pecah halaman rapi) ke dokumen laporan. */
function injectPrintStyle(doc: Document): void {
  const style = doc.createElement("style");
  style.textContent = `
    @page { size: A4; margin: 12mm; }
    html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { margin: 0; padding: 0; }
    .kv, .stat, .top-card, .island-card, .step, table tr { break-inside: avoid; page-break-inside: avoid; }
    h1, h2, h3, h4 { break-after: avoid; page-break-after: avoid; }
  `;
  doc.head.appendChild(style);
}

/** Rendern string HTML lengkap menjadi PDF via mesin print browser (print-to-PDF). */
export async function downloadHtmlAsPdf(html: string, filename: string): Promise<void> {
  let iframe: HTMLIFrameElement | null = null;
  try {
    // Render HTML di iframe tersembunyi (off-screen, tetap punya layout)
    // agar <head>/<style> ikut diterapkan dan mesin print mem-paginate benar.
    iframe = document.createElement("iframe");
    // Posisikan di luar layar namun tetap dirender (tidak display:none) agar
    // mesin print mem-paginate isinya dengan benar.
    iframe.style.position = "fixed";
    iframe.style.left = "-100000px";
    iframe.style.top = "0";
    iframe.style.width = `${RENDER_WIDTH_PX}px`;
    iframe.style.height = "auto";
    iframe.style.border = "0";
    iframe.style.zIndex = "-1";
    iframe.style.visibility = "visible";
    iframe.setAttribute("aria-hidden", "true");
    iframe.title = filename;
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    // Tunggu dokumen & style di dalam iframe siap (srcdoc memuat cepat).
    await new Promise<void>((resolve) => {
      iframe!.onload = () => resolve();
      // Jaring pengaman bila peristiwa load terlewat.
      setTimeout(resolve, 500);
    });

    const contentDoc = iframe.contentDocument;
    if (!contentDoc || !iframe.contentWindow) {
      document.body.removeChild(iframe);
      downloadHtmlFallback(html, filename);
      return;
    }

    // Pastikan aturan A4 & pecah halaman yang rapi dipakai saat mencetak.
    injectPrintStyle(contentDoc);

    await (contentDoc.fonts?.ready || Promise.resolve()).catch(() => {});
    await new Promise((r) => setTimeout(r, 250));

    // Mesin print browser menghasilkan PDF berpagina benar (A4) tanpa batas
    // tinggi konten. Pengguna memilih "Simpan sebagai PDF" di dialog print.
    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    // Hapus iframe setelah dialog print ditutup (segera setelahnya aman).
    setTimeout(() => {
      if (iframe && iframe.parentNode) document.body.removeChild(iframe);
    }, 1000);
    iframe = null;
  } catch (err) {
    console.error("Gagal membuat PDF:", err);
    if (iframe && iframe.parentNode) document.body.removeChild(iframe);
    downloadHtmlFallback(html, filename);
  }
}
