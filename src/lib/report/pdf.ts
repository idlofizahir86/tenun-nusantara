// ============================================================
// Konversi laporan (HTML mandiri) menjadi PDF otomatis di browser.
// Merender HTML ke iframe tersembunyi → html2canvas → jsPDF (A4,
// multi-halaman). Fallback: bila gagal, unduh sebagai .html.
// ============================================================

const PAGE_FORMAT = "a4";
const MARGIN_MM = 10;

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
    // Muat lib secara dinamis agar hanya berjalan di sisi klien saat dibutuhkan.
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import("jspdf"),
      import("html2canvas").then((m) => m.default),
    ]);

    // Render HTML di iframe tersembunyi agar <style>/<head> ikut diterapkan.
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-10000px";
    iframe.style.top = "0";
    iframe.style.width = "860px";
    iframe.style.height = "20000px";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    if (!doc || !doc.body) {
      document.body.removeChild(iframe);
      downloadHtmlFallback(html, filename);
      return;
    }

    // Tunggu gambar & font selesai.
    const waitImages = (): Promise<void> =>
      new Promise((resolve) => {
        const imgs = Array.from(doc.querySelectorAll("img"));
        const pending = imgs.filter((img) => !img.complete);
        if (pending.length === 0) return resolve();
        let settled = false;
        const done = () => {
          if (!settled) {
            settled = true;
            resolve();
          }
        };
        pending.forEach((img) => {
          img.onload = done;
          img.onerror = done;
        });
        setTimeout(done, 1500);
      });
    await Promise.all([waitImages(), (doc.fonts?.ready || Promise.resolve()).catch(() => {})]);
    await new Promise((r) => setTimeout(r, 250));

    const body = doc.body;
    const scale = 2;
    const canvas = await html2canvas(body, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: body.scrollWidth,
      width: body.scrollWidth,
      height: body.scrollHeight,
    });

    document.body.removeChild(iframe);

    // Potong kanvas menjadi halaman A4.
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: PAGE_FORMAT });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const contentW = pageW - 2 * MARGIN_MM;
    const scalePxToMm = contentW / canvas.width;
    const sliceHpx = Math.floor((pageH - 2 * MARGIN_MM) / scalePxToMm);

    let offset = 0;
    let first = true;
    while (offset < canvas.height) {
      if (!first) pdf.addPage();
      const h = Math.min(sliceHpx, canvas.height - offset);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = Math.max(1, h);
      slice.getContext("2d")!.drawImage(canvas, 0, offset, canvas.width, h, 0, 0, canvas.width, h);
      pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", MARGIN_MM, MARGIN_MM, contentW, h * scalePxToMm);
      offset += h;
      first = false;
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Gagal membuat PDF:", err);
    downloadHtmlFallback(html, filename);
  }
}
