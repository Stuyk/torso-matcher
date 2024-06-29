import glob from "fast-glob";
import { getVotedImages } from "./vote";

export default defineEventHandler(async (event) => {
  const images = glob
    .sync("public/female-tops/**/*.png")
    .map((x) => x.replace("public/", ""));

  const votedImages = await getVotedImages();

  for (let i = images.length - 1; i >= 0; i--) {
    for (let votedImage of votedImages) {
      if (images[i] !== votedImage) {
        continue;
      }

      console.log(`Removed: ${images[i]}`);
      images.splice(i, 1);
    }
  }

  return images;
});
