function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export async function getCroppedImageFile(
  imageSrc,
  cropPixels,
  fileName = "hero-image.jpg",
  {
    mimeType = "image/jpeg",
    quality = 0.92,
    maxWidth,
    maxHeight,
  } = {},
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const scale = Math.min(
    1,
    maxWidth ? maxWidth / cropPixels.width : 1,
    maxHeight ? maxHeight / cropPixels.height : 1,
  );

  canvas.width = Math.max(1, Math.round(cropPixels.width * scale));
  canvas.height = Math.max(1, Math.round(cropPixels.height * scale));

  const context = canvas.getContext("2d");

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });

  if (!blob) {
    throw new Error("Kırpılmış görsel oluşturulamadı.");
  }

  return new File([blob], fileName, {
    type: mimeType
  });
}
