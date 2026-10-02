#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { taiPdfTuFlipbook } from "./index.mjs";

const [, , url, outPath] = process.argv;
if (!url || !outPath) {
  console.error("Dung: npx flipbook-pdf-extractor <url-flipbook> <duong-dan-luu.pdf>");
  process.exit(1);
}

try {
  const { pdfUrl, buffer } = await taiPdfTuFlipbook(url);
  console.log("Tim thay:", pdfUrl);
  writeFileSync(outPath, buffer);
  console.log(`Da luu ${outPath} - ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
} catch (err) {
  console.error(err.message);
  process.exit(2);
}
