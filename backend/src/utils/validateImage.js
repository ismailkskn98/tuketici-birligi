const httpError = require("./httpError");

const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const documentMimes = [...imageMimes, "application/pdf"];

function startsWith(buffer, bytes) {
  return bytes.every((byte, index) => buffer[index] === byte);
}

function ascii(buffer, start, end) {
  return buffer.subarray(start, end).toString("ascii");
}

function detectMime(file) {
  const buffer = file.buffer || Buffer.alloc(0);

  if (buffer.length < 12) return "";

  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (ascii(buffer, 0, 4) === "RIFF" && ascii(buffer, 8, 12) === "WEBP") {
    return "image/webp";
  }
  if (ascii(buffer, 4, 8) === "ftyp") {
    const brand = ascii(buffer, 8, 12);
    if (brand === "avif" || brand === "avis") return "image/avif";
  }
  if (ascii(buffer, 0, 4) === "%PDF") return "application/pdf";

  return "";
}

async function validateUploadFile(file, allowedMimes = documentMimes) {
  if (!file) {
    throw httpError(400, "Dosya bulunamadı.");
  }

  const mime = detectMime(file);

  if (!allowedMimes.includes(mime)) {
    throw httpError(400, "Desteklenmeyen dosya tipi.");
  }

  return {
    ...file,
    mimetype: mime
  };
}

async function validateImage(file) {
  return validateUploadFile(file, imageMimes);
}

module.exports = {
  documentMimes,
  imageMimes,
  validateImage,
  validateUploadFile
};
