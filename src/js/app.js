let Minigrid = require("minigrid"),
    cardGrid = null,
    imgGrid = null,
    scrollTimer = null,
    menu = document.getElementById('menu'),
    toggler = document.getElementById('toggler')
;

/**
 * function to init the cards grid
 */
let init = () => {
    // card grids (lists)
    if (document.getElementsByClassName('cards').length) {
        cardGrid = new Minigrid({
            container: '.cards',
            item: '.card',
            gutter: 12
        });
        cardGrid.mount();
    }

    // image grids (galleries)
    if (document.getElementsByClassName('gallery').length) {
        imgGrid = new Minigrid({
            container: '.gallery',
            item: '.image',
            gutter: 12
        });
        if (imgGrid) {
            let imgs = document.images;
            [].forEach.call( imgs, function( img ) {
                img.addEventListener( 'load', () => { imgGrid.mount() }, false );
            } );
        }
    }
};

/**
 * function to redraw the cards grid
 */
let update = () => {
    if (cardGrid) {
        cardGrid.mount();
    }
    if (imgGrid) {
        imgGrid.mount();
    }
};

/**
 * delayed scroll callback
 */
let scroll = () => {
    if(scrollTimer) {
        window.clearTimeout(scrollTimer);
    }

    scrollTimer = window.setTimeout(function() {
        update();
    }, 200);
};

/**
 * register event listeners
 */
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', update);
document.addEventListener('load', update);
window.addEventListener('scroll', scroll);

/**
 * menu toggle on small screens
 */
    // toggle the navigation UI
let toggleNavigation = function() {
    if(menu.classList.contains('expanded')) {
        // close nav
        menu.classList.remove('expanded');
    } else {
        // open nav
        menu.classList.add('expanded');
    }
};
toggler.addEventListener('click', function() {
    toggleNavigation();
});