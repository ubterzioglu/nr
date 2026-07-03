import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";

export interface CertificateInput {
  fullName: string;
  eventTitle: string;
  /** "12 Temmuz 2026" biçiminde hazır tarih etiketi. */
  dateLabel: string;
  code: string;
  /** QR'ın açacağı doğrulama adresi. */
  verifyUrl: string;
}

/** Kısa, okunabilir sertifika doğrulama kodu: NX-XXXXXXXX */
export function generateCertificateCode(): string {
  return `NX-${randomBytes(4).toString("hex").toUpperCase()}`;
}

// Marka renkleri (MASTER.md): primary #1D6FFF, dark #050B1A, accent #5CC8FF
const PRIMARY = rgb(0x1d / 255, 0x6f / 255, 0xff / 255);
const DARK = rgb(0x05 / 255, 0x0b / 255, 0x1a / 255);
const MUTED = rgb(0x47 / 255, 0x55 / 255, 0x69 / 255);

async function loadFont(fileName: string): Promise<Uint8Array> {
  const fontPath = path.join(process.cwd(), "public", "fonts", fileName);
  return new Uint8Array(await readFile(fontPath));
}

/**
 * A4 yatay katılım sertifikası üretir (varsayılan kod içi tasarım).
 * Tasarım ekibinden hazır şablon PDF geldiğinde bu fonksiyon şablon
 * üzerine isim/QR basacak şekilde genişletilecek — çağıran taraf değişmez.
 */
export async function generateCertificatePdf(
  input: CertificateInput
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const [regular, bold] = await Promise.all([
    pdf.embedFont(await loadFont("DejaVuSans.ttf"), { subset: true }),
    pdf.embedFont(await loadFont("DejaVuSans-Bold.ttf"), { subset: true }),
  ]);

  // A4 yatay (pt)
  const page = pdf.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();
  const centerX = width / 2;

  // Zemin + çerçeve
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: PRIMARY,
    borderWidth: 2,
  });
  page.drawRectangle({
    x: 32,
    y: 32,
    width: width - 64,
    height: height - 64,
    borderColor: DARK,
    borderWidth: 0.75,
  });

  const drawCentered = (
    text: string,
    y: number,
    size: number,
    font = regular,
    color = DARK
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: centerX - textWidth / 2, y, size, font, color });
  };

  // Marka
  drawCentered("NEXRISE", height - 110, 30, bold, DARK);
  drawCentered("Rise of the Next Generation", height - 132, 11, regular, MUTED);

  // Başlık
  drawCentered("KATILIM SERTİFİKASI", height - 195, 24, bold, PRIMARY);

  // Gövde
  drawCentered("Bu sertifika", height - 245, 12, regular, MUTED);
  drawCentered(input.fullName, height - 290, 34, bold, DARK);
  drawCentered("adına düzenlenmiş olup, aşağıdaki etkinliğe katılımını belgeler:", height - 320, 12, regular, MUTED);
  drawCentered(input.eventTitle, height - 355, 18, bold, DARK);
  drawCentered(input.dateLabel, height - 380, 12, regular, MUTED);

  // QR (doğrulama)
  const qrDataUrl = await QRCode.toDataURL(input.verifyUrl, {
    margin: 0,
    width: 240,
  });
  const qrImage = await pdf.embedPng(qrDataUrl);
  const qrSize = 84;
  page.drawImage(qrImage, {
    x: width - 64 - qrSize,
    y: 56,
    width: qrSize,
    height: qrSize,
  });

  // Doğrulama bilgisi
  page.drawText(`Doğrulama Kodu: ${input.code}`, {
    x: 64,
    y: 96,
    size: 11,
    font: bold,
    color: DARK,
  });
  page.drawText(input.verifyUrl, {
    x: 64,
    y: 78,
    size: 9,
    font: regular,
    color: MUTED,
  });
  page.drawText("Bu sertifikanın geçerliliğini QR kod veya doğrulama kodu ile kontrol edebilirsiniz.", {
    x: 64,
    y: 60,
    size: 9,
    font: regular,
    color: MUTED,
  });

  return pdf.save();
}
