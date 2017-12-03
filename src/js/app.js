let Minigrid = require("minigrid");

let cardGrid = null;
let imgGrid = null;

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
 * function to redrwa the cards grid
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
 * register event listeners
 */
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', update);

