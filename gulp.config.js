module.exports = {
  // Settings: Turn on/off build features
  clean: true,
  styles: true,
  images: true,
  scripts: false,
  copy: true,
  reload: true,

  // Global project folder destinations
  input: "src/",
  html: "./",
  output: "dist/",

  // Styles
  stylesSrc: "src/sass/**/*.{scss,sass}",
  stylesDest: "dist/css/",

  // Images
  imagesSrc: "src/img/*.*",
  imagesDest: "dist/img/",

  // Scripts
  scriptsSrc: "src/js/*",
  scriptsDest: "dist/js/",

  // Copy
  copySrc: "src/copy/**/*",
  copyDest: "dist/",

  // reload
  reload: "./dist",
};
