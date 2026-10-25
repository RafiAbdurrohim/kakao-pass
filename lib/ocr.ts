// OCR gratis di browser (Tesseract.js). Hanya memberi saran angka; petani tetap bisa mengoreksi.
export async function readNumber(dataUrl: string): Promise<string | null> {
  try {
    const T = await import("tesseract.js");
    const w = await T.createWorker("eng");
    await w.setParameters({ tessedit_char_whitelist: "0123456789.,", tessedit_pageseg_mode: T.PSM.SINGLE_LINE });
    const { data } = await w.recognize(dataUrl);
    await w.terminate();
    const m = data.text.replace(/,/g, ".").match(/\d{1,3}\.\d{1,2}|\d{1,3}/g);
    if (!m) return null;
    return m.find((x) => x.includes(".")) ?? m[0];
  } catch {
    return null;
  }
}
