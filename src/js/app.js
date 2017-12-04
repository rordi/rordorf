let Minigrid = require("minigrid"),
    cardGrid = null,
    imgGrid = null,
    scrollTimer = null
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
window.addEventListener('scroll', scroll);

