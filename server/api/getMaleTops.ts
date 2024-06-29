import glob from "fast-glob";
import { getVotedImages } from "./vote";

export default defineEventHandler(async (event) => {
  const images = glob
    .sync("public/male-tops/**/*.png")
    .map((x) => x.replace("public/", ""));

  const copyOfImages = [...images];
  const votedImages = await getVotedImages();

  for (let i = images.length - 1; i >= 0; i--) {
    for (let votedImage of votedImages) {
      if (images[i] !== votedImage) {
        continue;
      }

      images.splice(i, 1);
    }
  }

  if (images.length <= 0) {
    return copyOfImages;
  }

  return images;
});
