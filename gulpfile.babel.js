import {spawn} from "child_process";
import fs from "fs";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import BrowserSync from "browser-sync";
import watch from "gulp-watch";
import gulp from "gulp";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import axios from "axios";

let AES = require("crypto-js/aes");
let SHA256 = require("crypto-js/sha256");

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

// Encrypt documents task, expects url and encrption pw as input
gulp.task("documents", ["documents"]);

// Remove previously compiled CSS file
gulp.task('truncate', function () {
    fs.truncate("./dist/css/main.css", (err) => {});
});

// SASS task
gulp.task('sass', function () {
    let processors = [
        autoprefixer({
            browsers: ['last 2 versions', '> 2%'] // last 2 versions or exceeding 2% market share
        }),
        cssnano()
    ];

    // compile sass to css and post-process
    gulp.src("./src/css/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream())
    ;
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

// task to encrypt documents, expects url and pw as input, i.e. gulp documents --url ... --pw ...
gulp.task('documents', function () {
    if (!arg.url || !arg.pw) {
        console.error("ERROR: arguments --url and --pw must be given!");
    } else {
        encryptDocuments(arg.url, arg.pw);
    }
});

// encrypt content from url using encrypt pw
function encryptDocuments(url, encryptPw) {
    axios.get(url)
        .then(function (response) {
            let docs = JSON.stringify(response.data);
            let encryptSalt = SHA256(encryptPw).toString();
            let ciphertext = AES.encrypt(docs, encryptSalt).toString();
            fs.writeFile("./site/static/documents.json", ciphertext, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("encrypted documents.json was created");
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

// fetch command line arguments
const arg = (argList => {

    let arg = {}, a, opt, thisOpt, curOpt;
    for (a = 0; a < argList.length; a++) {

        thisOpt = argList[a].trim();
        opt = thisOpt.replace(/^\-+/, '');

        if (opt === thisOpt) {

            // argument value
            if (curOpt) arg[curOpt] = opt;
            curOpt = null;

        }
        else {

            // argument name
            curOpt = opt;
            arg[curOpt] = true;

        }

    }

    return arg;

})(process.argv);