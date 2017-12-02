import gulp from "gulp";
import {spawn} from "child_process";
import fs from "fs";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import BrowserSync from "browser-sync";
import watch from "gulp-watch";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task("build", ["truncate", "sass", "js"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["truncate", "sass", "js"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Remove previously compiled CSS file
gulp.task('truncate', function () {
    fs.truncate("./dist/css/main.css", (err) => {});
});

// SASS task
gulp.task('sass', function () {
    // compile sass to css
    gulp.src("./src/css/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest("./dist/css"));

    // post-process compiled CSS with PostCSS
    gulp.src("./dist/css/main.css")
        .pipe(postcss([]))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

// Compile Javascript
gulp.task("js", (cb) => {
    const myConfig = Object.assign({}, webpackConfig);

    webpack(myConfig, (err, stats) => {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            colors: true,
            progress: true
        }));
        browserSync.reload();
        cb();
    });
});

// Development server with browsersync
gulp.task("server", ["hugo", "truncate", "sass", "js"], () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    watch("./src/js/**/*.js", () => { gulp.start(["js"]) });
    watch("./src/css/**/*.scss", () => { gulp.start(["truncate", "sass"]) });
    watch("./site/**/*", () => { gulp.start(["hugo"]) });
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
    const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

    process.env.NODE_ENV = environment;

    return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
        if (code === 0) {
            browserSync.reload();
            cb();
        } else {
            browserSync.notify("Hugo build failed :(");
            cb("Hugo build failed");
        }
    });
}
