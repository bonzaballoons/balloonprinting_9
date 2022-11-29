<?php

// todo - jumbo for helium
// todo - speedy fee description for order notes
// todo - validate if customer goes straight to order details
// todo - standard fee for basket without foil or latex
// todo - exclude dates in caleneder for bh, bp
// todo - add check for ink colours, commas, and &
// todo - when going back on order details, doesn't fill in the details

Route::get('/', 'GeneralPagesController@index');
Route::get('contact', 'GeneralPagesController@contact');
Route::post('contactThankYou', 'GeneralPagesController@contactThankYou');
Route::get('about', 'GeneralPagesController@about');
Route::get('portfolio', 'GeneralPagesController@portfolio');
Route::get('sitemap', 'GeneralPagesController@sitemap');
Route::get('privacy', 'GeneralPagesController@privacy');
Route::get('terms', 'GeneralPagesController@terms');

Route::get('prices/latex_printed', 'PricesController@latexPrinted');
Route::get('prices/foil_printed', 'PricesController@foilPrinted');
Route::get('prices/giant_latex_printed', 'PricesController@giantLatexPrinted');
Route::get('prices/helium', 'PricesController@helium');
Route::get('prices/promotional_balloon_in_a_box', 'PricesController@promotionalBalloonInABox');
Route::get('prices/accessories', 'PricesController@accessories');

Route::get('info/printing/artwork_guidelines', 'InfoController@printing_artworkGuidelines');
Route::get('info/printing/how_we_print_on_balloons', 'InfoController@printing_howWePrintOnBalloons');
Route::get('info/printing/balloon_colour_charts', 'InfoController@printing_balloonColourCharts');
Route::get('info/printing/ink_colour_charts', 'InfoController@printing_inkColourCharts');
Route::get('info/printing/sizing_gas_volumes', 'InfoController@printing_sizingGasVolumes');
Route::get('info/printing/free_artwork_checking', 'InfoController@printing_freeArtworkChecking');
Route::get('info/helium/overview', 'InfoController@helium_overview');
Route::get('info/helium/depot_locator', 'InfoController@helium_depotLocator');
Route::get('info/helium/price_comparison', 'InfoController@helium_priceComparison');
Route::get('info/helium/safety', 'InfoController@helium_safety');
Route::get('info/helium/how_much_helium', 'InfoController@helium_howMuchHelium');

Route::get('info/how_tos', 'InfoController@howTos');
Route::get('info/faqs', 'InfoController@faqs');
Route::get('info/testimonials', 'InfoController@testimonials');
Route::get('info/case_studies', 'InfoController@caseStudies');

Route::get('product_list/{name}/{id}', 'CategoryController@display');
Route::get('product/{name}/{id}', 'ProductController@display');

Route::get('basket', 'BasketController@basket');

Route::get('order/details','OrderController@details');
Route::get('order/overview','OrderController@overview');
Route::any('order/success/{orderID}','OrderController@success');
Route::any('order/failure','OrderController@failure');

Route::post('artwork', 'ArtworkController@store');
Route::delete('artwork/{fileName}', 'ArtworkController@delete');
