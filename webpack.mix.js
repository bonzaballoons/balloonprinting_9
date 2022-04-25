const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js').vue()
    .js('resources/js/artworkChecker.js', 'public/js/artworkChecker.js')
    .js('resources/js/latexWizard.js', 'public/js/latexWizard.js')
    .js('resources/js/giantLatexWizard.js', 'public/js/giantLatexWizard.js')
    .js('resources/js/foilWizard.js', 'public/js/foilWizard.js')
    .js('resources/js/bonzaProduct.js', 'public/js/bonzaProduct.js')
    .js('resources/js/heliumProduct.js', 'public/js/heliumProduct.js')
    .js('resources/js/colourCharts.js', 'public/js/colourCharts.js')
    .js('resources/js/reviewWidget.js', 'public/js/reviewWidget.js')
    .js('resources/js/basket.js', 'public/js/basket.js')
    .js('resources/js/orderDetails.js', 'public/js/orderDetails.js')
    .js('resources/js/orderOverview.js', 'public/js/orderOverview.js')
    .js('resources/js/rocketChat.js', 'public/js/rocketChat.js')
    .sass('resources/css/app.scss', 'public/css', [
        //
    ]);

mix.version();
