import glob from "fast-glob";

const femaleTops = glob.sync("./**/female-tops/*.png");

console.log(femaleTops);
