# flipbook-pdf-extractor

Lấy lại file PDF **gốc** từ một link flipbook (Heyzine và các dịch vụ cùng kiểu
"upload PDF rồi hiện lật trang") — không cần API chính thức, không cần nút
"Download" công khai, không phải tự chụp/ghép ảnh từng trang.

## Vì sao cần

Nhiều dịch vụ flipbook (Heyzine, và tương tự) lưu **nguyên file PDF đã
upload**, chỉ hiển thị bằng JavaScript. Trình duyệt vẫn phải tải file PDF gốc
về máy để hiển thị từng trang — chỉ là link đó không xuất hiện trong HTML
tĩnh và không có API công khai để lấy lại. Công cụ này mở trang bằng trình
duyệt thật (Playwright), bắt đúng lúc file `.pdf` được tải về, rồi tải lại
file đó.

**Lưu ý:** nếu dịch vụ đó thật sự chỉ lưu *ảnh* từng trang (không upload PDF
gốc) thì công cụ này sẽ báo không tìm thấy — xem mục "Khi không tìm thấy" bên
dưới.

## Cài đặt

```bash
npm install flipbook-pdf-extractor
npx playwright install chromium
```

## Dùng qua dòng lệnh

```bash
npx flipbook-pdf-extractor "https://heyzine.com/flip-book/xxx.html" "./ten-file.pdf"
```

## Dùng như thư viện

```js
import { taiPdfTuFlipbook, timUrlPdf } from "flipbook-pdf-extractor";

const { pdfUrl, buffer } = await taiPdfTuFlipbook("https://heyzine.com/flip-book/xxx.html");
// buffer là nội dung file PDF gốc, pdfUrl là link CDN gốc tìm thấy được

// Hoặc chỉ muốn lấy link, tự tải bằng công cụ khác:
const urls = await timUrlPdf("https://heyzine.com/flip-book/xxx.html");
```

## Khi không tìm thấy file `.pdf` nào

Dịch vụ đó có thể chỉ lưu ảnh từng trang. Hướng còn lại (chưa có trong gói
này): bắt network response lọc ảnh (`.jpg`/`.png`/`.webp`) thay vì `.pdf`,
rồi ghép thành PDF bằng `pdf-lib` hoặc tương tự — chất lượng sẽ kém hơn bản
gốc vì ảnh đã bị nén lại.

## Giấy phép

MIT
