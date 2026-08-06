function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export async function getCroppedImageFile(imageSrc, cropPixels, fileName = "hero-image.jpg") {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;

  const context = canvas.getContext("2d");

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    cropPixels.width,
    cropPixels.height
  );

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.92);
  });

  if (!blob) {
    throw new Error("Kırpılmış görsel oluşturulamadı.");
  }

  return new File([blob], fileName, {
    type: "image/jpeg"
  });
}
