import fs from "fs";
import gulp from "gulp";
import axios from "axios";

let AES = require("crypto-js/aes");
let SHA256 = require("crypto-js/sha256");

// Encrypt documents task, expects url and encrption pw as input
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
        } else {
            // argument name
            curOpt = opt;
            arg[curOpt] = true;
        }
    }

    return arg;
})(process.argv);
