import axios from "axios";

let Masonry = require('masonry-layout'),
    imagesLoaded = require('imagesloaded'), // required by Masonry for image galleries
    SnowFlakes = require('magic-snowflakes'),
    AES = require("crypto-js/aes"),
    SHA256 = require("crypto-js/sha256"),
    ENCUTF8 = require("crypto-js/enc-utf8"),
    menu = document.getElementById('collapsible'),
    toggler = document.getElementById('toggler'),
    togglericon = document.getElementById('togglericon')
;

/**
 * crypto functions for doc downloads
 */
let docform = document.querySelector('#docform');
if (docform) {
    let docwrap = document.querySelector('#docwrap');
    let docpw = document.querySelector('#docpw');
    let ciphertext = '';

    axios.get("/documents.json")
        .then(function (response) {
            ciphertext = response.data;
            console.log(ciphertext);
        })
        .catch(function (error) {
            console.error(error);
        });

    docform.addEventListener('submit', function(e) {
        e.preventDefault();

        // Decrypt
        let decryptPw = docpw.value;
        let decryptSalt = SHA256(decryptPw).toString();
        let decryptedBytes  = AES.decrypt(ciphertext, decryptSalt).toString(ENCUTF8);

        let success = true;
        try {
            decryptedBytes = JSON.parse(decryptedBytes);
        }
        catch (err) {
            console.log('wrong password');
            success = false;
        }

        if (success) {
            docwrap.innerHTML = ''; // reset content
            // loops topics and add headings
            for (let i = 0; i < decryptedBytes.length; i++) {
                let topic = decryptedBytes[i];
                let headingNode = document.createElement('h3');
                headingNode.innerHTML = topic.title;
                docwrap.appendChild(headingNode);
                // loop documents within topic and add download link
                for (let j = 0; j < topic.documents.length; j++) {
                    let doc = topic.documents[j];
                    let spanNode = document.createElement('span');
                    let anchorNode = document.createElement('a');
                    anchorNode.href = doc.url;
                    anchorNode.innerHTML = doc.title;
                    spanNode.appendChild(anchorNode);
                    docwrap.appendChild(spanNode);
                }
            }
        }
    });
}



/**
 * initialize masonry layout for cards
 */
let grid = document.querySelector('.cards');
if (grid) {
    new Masonry(grid, {
        columnWidth: '.cards-sizer',
        itemSelector: '.card',
        percentPosition: true
    });
}

/**
 * initialize masonry layout for img galleries
 */
let gallery = document.querySelector('.gallery');
if (gallery) {
    let images = new Masonry(gallery, {
        columnWidth: '.images-sizer',
        itemSelector: '.image',
        percentPosition: true
    });

    // adjust layout after each img is loaded
    let loadedImages = document.querySelectorAll('.image');
    for (let i = 0; i < loadedImages.length; i++) {
        imagesLoaded(loadedImages[i], function() {
            images.layout();
        });
    }
}

/**
 * menu toggle on small screens
 */
if (toggler) {
    // toggle the navigation UI
    let toggleNavigation = function() {
        if(menu.classList.contains('expanded')) {
            // close nav
            menu.classList.remove('expanded');
            togglericon.classList.remove('expanded');
        } else {
            // open nav
            menu.classList.add('expanded');
            togglericon.classList.add('expanded');
        }
    };
    toggler.addEventListener('click', function() {
        toggleNavigation();
    });
}

/**
 * add snowflakes
 */
if (window.snowflakes) {
    SnowFlakes({
        container: document.body,
        count: 80,
        speed: 0.8,
        useRotate: true,
        useScale: true
    });
}
