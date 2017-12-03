let Minigrid = require("minigrid");

let grid = null;

/**
 * function to init the cards grid
 */
let init = () => {
    grid = new Minigrid({
        container: '.cards',
        item: '.card',
        gutter: 12
    });
    grid.mount();
};

/**
 * function to redrwa the cards grid
 */
let update = () => {
    grid.mount();
};

/**
 * register event listeners
 */
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', update);

