let Masonry = require('masonry-layout'),
    imagesLoaded = require('imagesloaded'), // required by Masonry for image galleries
    SnowFlakes = require('magic-snowflakes'),
    menu = document.getElementById('collapsible'),
    toggler = document.getElementById('toggler'),
    togglericon = document.getElementById('togglericon')
;

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
 * init Snowflakes
 */

SnowFlakes({
    container: document.body,
    count: 80,
    speed: 0.8,
    useRotate: true,
    useScale: true
});
