// Remember to change your settings -- gulp.config.js

// Gulp Packages
const { gulp, src, dest, watch, series, parallel } = require("gulp");

// CSS related plugins
const sass = require("gulp-sass");
const minifycss = require("gulp-uglifycss");
const autoprefixer = require("gulp-autoprefixer");

// Images plugins
const imagemin = require("gulp-imagemin");

// JS related plugins.
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

// Utility packages
const browserSync = require("browser-sync").create();
const cache = require("gulp-cache");
const del = require("del");
const filter = require("gulp-filter");
const lineec = require("gulp-line-ending-corrector");
const remember = require("gulp-remember");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");

// Configuration
const config = require("./gulp.config");

// Clean tasks
const cleanDist = (done) => {
  if (!config.clean) return done();
  del.sync([config.output]);
  done();
};

// Task: styles
const buildStyles = (done) => {
  if (!config.styles) return done();

  return src(config.stylesSrc, { allowEmpty: true })
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "expanded",
        sourceComments: true,
      })
    )
    .on("error", sass.logError)
    .pipe(sourcemaps.write({ includeContent: false }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./"))
    .pipe(dest(config.stylesDest))
    .pipe(filter("**/*.css"))
    .pipe(browserSync.stream())
    .pipe(rename({ suffix: ".min" }))
    .pipe(minifycss({ uglyComments: true }))
    .pipe(lineec())
    .pipe(dest(config.stylesDest))
    .pipe(filter("**/*.css"))
    .pipe(browserSync.stream());
};

// Images tasks
const buildImgs = (done) => {
  if (!config.images) return done();

  return src(config.imagesSrc)
    .pipe(
      cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 3 }),
          imagemin.svgo({
            plugins: [{ removeViewBos: true }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(dest(config.imagesDest));
};

// Copy static files into output folder
const copyFiles = (done) => {

  // Make sure this feature is activated before running
  if (!config.copy) return done();

  // Copy static files
  return src(config.copySrc)
    .pipe(dest(config.copyDest));

};

// Building JS Scripts
const buildScripts = (done) => {
  if (!config.scripts) return done();
  return src(config.scriptsSrc)
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(remember(config.scriptsSrc))
    .pipe(concat("app.js"))
    .pipe(lineec())
    .pipe(dest(config.scriptsDest))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(lineec())
    .pipe(dest(config.scriptsDest));
};

// Watch for changes to the src directory
const startServer = function (done) {
  if (!config.reload) return done();

  // Initialize BrowserSync
  browserSync.init({
    server: {
      baseDir: config.reload,
    },
  });
  done();
};

// Reload the browser when files change
const reloadBrowser = (done) => {
  if (!config.reload) return done();
  browserSync.reload();
  done();
};

// Watching sources
const watchSource = (done) => {
  watch(config.input, series(exports.default, reloadBrowser));
  done();
};

// Export task
exports.default = series(
  parallel(cleanDist, buildStyles, buildScripts, buildImgs, copyFiles)
);

// Watch and reload
// Gulp watch
exports.watch = series(exports.default, startServer, watchSource);
