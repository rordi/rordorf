# Hugo-based site for [rordorf.org](https://www.rordorf.org)

Originally based on Victor Hugo, the Hugo boilerplate for creating truly epic websites. I supercharged Victor Hugo with
support for SCSS and improved CSS post-processing with autoprefixing and CSS minification.


Victor Hugo is the boilerplate for using [Hugo](https://gohugo.io/) as a static site generator and [Gulp](https://gulpjs.com/) +
[Webpack](https://webpack.js.org/) as your asset pipeline.

Victor Hugo is setup to use [PostCSS](http://postcss.org/) and [Babel](https://babeljs.io/) for CSS and JavaScript compiling/transpiling.

## Usage

### Prerequisites

You need to have the latest/LTS [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) versions
installed in order to use Victor Hugo.

Next step, clone this repository and run:

```bash
npm install
```

This will take some time and will install all packages necessary to run Victor Hugo and it's tasks.

### Development

While developing your website, use:

```bash
npm start
```

or

```bash
gulp server
```

Then visit http://localhost:3000/ *- or a new browser windows popped-up already -* to preview your new website. BrowserSync
will automatically reload the CSS or refresh the whole page, when stylesheet, javascript or content changes.

### Static build

To build a static version of the website inside the `/dist` folder, run:

```bash
npm run build
```

To get a preview of posts or articles not yet published, run:

```bash
npm run build-preview
```

## Structure

```
|--site                // Everything in here will be built with hugo
|  |--content          // Pages and collections - ask if you need extra pages
|  |--data             // YAML data files with any data for use in examples
|  |--layouts          // This is where all templates go
|  |  |--partials      // This is where includes live
|  |  |--index.html    // The index page
|  |--static           // Files in here ends up in the public folder
|--src                 // Files that will pass through the asset pipeline
|  |--css              // CSS files in the root of this folder will end up in /css/...
|  |--js               // app.js will be compiled to /app.js with babel
```

## Basic Concepts

You can read more about Hugo's template language in their documentation here:

https://gohugo.io/templates/overview/

The most useful page there is the one about the available functions:

https://gohugo.io/templates/functions/

For assets that are completely static and don't need to go through the asset pipeline,
use the `site/static` folder. Images, font-files, etc, all go there.

Files in the static folder ends up in the web root. So a file called `site/static/favicon.ico`
will end up being available as `/favicon.ico` and so on...

The `src/js/app.js` file is the entrypoint for webpack and will be built to `/dist/app.js`.

You can use **ES6** and use both relative imports or import libraries from npm.

Any SCSS file directly under the `src/css/` folder will get compiled with SASS, be autoprefixed and minified to
`/dist/css/{filename}.css`. Import statements will be resolved as part of the SASS build.

## Environment variables

To seperate the development and production *- aka build -* stages, all gulp tasks run with a node environment variable
named either `development` or `production`.

You can access the environment variable inside the theme files with `getenv "NODE_ENV"`. See the following example for
a conditional statement:

    {{ if eq (getenv "NODE_ENV") "development" }}You're in development!{{ end }}

All tasks starting with *build* set the environment variable to `production` - the other will set it to `development`.
