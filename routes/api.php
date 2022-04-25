<?php

Route::get('heliumSearchSuppliers/{postcode}/{productID?}', 'API\HeliumController@searchSuppliers');
Route::post('heliumAddSupplierToSession', 'API\HeliumController@addSupplierToSession');

Route::get('latexPrintingPrice', 'API\PrintingPriceController@latex');
Route::get('giantLatexPrintingPrice', 'API\PrintingPriceController@giantLatex');
Route::get('foilPrintingPrice', 'API\PrintingPriceController@foil');

Route::post('printingCheckArtwork', 'API\CheckArtworkController@send');

Route::post('basketAddPrintedWizardLatex', 'API\BasketController@addPrintedWizardLatex');
Route::post('basketAddPrintedWizardLatexGiant', 'API\BasketController@addPrintedWizardLatexGiant');
Route::post('basketAddPrintedWizardFoil', 'API\BasketController@addPrintedWizardFoil');
Route::post('basketAddHelium', 'API\BasketController@addHelium');
Route::post('basketAddBonza', 'API\BasketController@addBonza');

Route::post('basketRemoveProduct', 'API\BasketController@removeProduct');
Route::post('basketChangeProductQuantity', 'API\BasketController@changeProductQuantity');
Route::post('basketChangePostageWeightId', 'API\BasketController@changePostageWeightId');
Route::post('basketAddDeliveryDate', 'API\BasketController@addDeliveryDate');

Route::post('orderDetails','API\OrderDetailsController@storeOrderDetails');

Route::get('basketCount', 'API\BasketController@getBasketCount');
