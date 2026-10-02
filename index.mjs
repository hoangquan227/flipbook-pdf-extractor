/**
 * Lay lai file PDF goc tu mot link flipbook (Heyzine va cac dich vu cung kieu
 * "upload PDF roi hien lat trang") bang cach bat network response tra ve
 * *.pdf khi trinh duyet that tai trang.
 *
 * Phat hien: nhieu dich vu flipbook luu NGUYEN file PDF da upload, chi hien
 * thi bang JS - file goc van duoc trinh duyet tai ve de hien, chi la khong
 * lo link do trong HTML tinh va khong co API chinh thuc de lay lai.
 */
import { chromium } from "playwright";

/**
 * Tim cac URL *.pdf duoc tai khi mo mot trang flipbook.
 * @param {string} url Link flipbook (vd https://heyzine.com/flip-book/xxx.html)
 * @param {{ timeoutMs?: number, waitAfterLoadMs?: number }} [options]
 * @returns {Promise<string[]>} Danh sach URL pdf tim thay (co the rong)
 */
export async function timUrlPdf(url, options = {}) {
  const { timeoutMs = 30000, waitAfterLoadMs = 3000 } = options;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const pdfUrls = new Set();
    page.on("response", (r) => {
      const u = r.url();
      if (/\.pdf(\?|$)/i.test(u)) pdfUrls.add(u);
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    await page.waitForTimeout(waitAfterLoadMs);
    return [...pdfUrls];
  } finally {
    await browser.close();
  }
}

/**
 * Tai file PDF goc tu mot link flipbook ve may, tra ve Buffer.
 * Nem loi neu khong tim thay file .pdf nao (dich vu do co the chi luu anh).
 * @param {string} flipbookUrl
 * @param {{ timeoutMs?: number, waitAfterLoadMs?: number }} [options]
 * @returns {Promise<{ pdfUrl: string, buffer: Buffer }>}
 */
export async function taiPdfTuFlipbook(flipbookUrl, options = {}) {
  const urls = await timUrlPdf(flipbookUrl, options);
  if (urls.length === 0) {
    throw new Error(
      "Khong tim thay link .pdf nao khi tai trang - dich vu nay co the chi " +
        "hien ANH tung trang (khong upload PDF goc). Can huong khac (bat anh " +
        "tung trang roi ghep lai), chua co trong goi nay.",
    );
  }
  const pdfUrl = urls[0];
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`Tai PDF that bai - HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return { pdfUrl, buffer };
}
