export default async function resizeImage({
  targetSizeKb = 200,
  file,
  setImageFile,
}: {
  targetSizeKb: number;
  file: any;
  setImageFile: (imageFile: string | null) => void;
}) {
  const reader = new FileReader();
  reader.onload = async (event) => {
    event.preventDefault();
    const img = new Image();
    img.src =
      event.target && typeof event.target.result == "string"
        ? event.target.result
        : "";
    (img.onload = async () => {
      event.preventDefault();
      const elem = document.createElement("canvas");
      elem.width = img.width;
      elem.height = img.height;
      const ctx = elem.getContext("2d");
      if (!ctx) {
        return;
      }
      // img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        elem.width,
        elem.height
      );
      let MAX_QUALITY = 1;
      let MIN_QUALITY = 0;
      let QUALITY = MAX_QUALITY;
      let blobSizeKB = 0;
      let blob;
      while (MAX_QUALITY - MIN_QUALITY > 0.01) {
        blob = await new Promise<Blob | null>((resolve) => {
          ctx.canvas.toBlob((blob) => resolve(blob), "image/jpeg", QUALITY);
        });
        if (!blob) {
          return;
        }
        blobSizeKB = blob.size / 1024;
        if (blobSizeKB > targetSizeKb) {
          MAX_QUALITY = QUALITY;
        } else {
          MIN_QUALITY = QUALITY;
        }
        QUALITY = (MAX_QUALITY + MIN_QUALITY) / 2;
      }
      if (!blob) {
        return;
      }
      const newFile = new File([blob], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      const newFileReader = new FileReader();

      newFileReader.onloadend = () => {
        setImageFile(
          typeof newFileReader.result === "string" ? newFileReader.result : null
        );
      };

      newFileReader.readAsDataURL(newFile);
    }),
      (reader.onerror = (error) => console.log(error));
  };
  reader.readAsDataURL(file);
}
