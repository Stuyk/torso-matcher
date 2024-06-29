import glob from "fast-glob";

export default defineEventHandler((event) => {
  return glob
    .sync("public/male-torsos/**/*.png")
    .map((x) => x.replace("public/", ""));
});
