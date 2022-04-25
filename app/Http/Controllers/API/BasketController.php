<?php namespace App\Http\Controllers\API;

use App\HardPriceSetter;
use Illuminate\Http\Request;
use App\Models\PostageWeight;

class BasketController
{
    public function addBonza(Request $request) : array {

        $basket = session('basket');
        $basket->addBonza( $request->all() );
        return [true];
    }

    public function addHelium(Request $request) : array {

        $basket = session('basket');
        $basket->addHelium( $request->all(), session('heliumSupplier', false) );
        return [true];
    }

    public function addPrintedWizardLatex(Request $request) : array {

        $basket = session('basket');
        $dataWithHardPrice = HardPriceSetter::printedLatexFromWizard(  json_decode( $request->input('json') ) );
        $basket->addPrintedLatexFromWiz( $dataWithHardPrice);

        return [true];
    }

    public function addPrintedWizardLatexGiant(Request $request) : array {

        $basket = session('basket');
        $basket->addPrintedLatexGiantFromWiz( json_decode( $request->input('json') ) );
        return [true];
    }

    public function addPrintedWizardFoil(Request $request) : array {

        $basket = session('basket');
        $dataWithHardPrice = HardPriceSetter::printedFoilFromWizard(  json_decode( $request->input('json') ) );
        $basket->addPrintedFoilFromWiz( $dataWithHardPrice );
        return [true];
    }

    public function removeProduct(Request $request) : array {

        $basket = session('basket');
        $basket->removeProduct( $request->input('arrayName'), $request->input('arrayKey') );

        return [
            'success' => true,
            'newArray' => $basket->{$request->input('arrayName')},
            'numberItems' => $basket->numberItems,
            'hireDeliveryDiscount' => $basket->hireDeliveryDiscount,
            'basketSubtotal'  => $basket->basketSubtotal,
            'totalPostageWeight' => $basket->totalPostageWeight,
            'totalPostageWeightPrice' => $basket->totalPostageWeightPrice,
            'postageWeights' => PostageWeight::getPrices($basket->totalPostageWeight),
            'totalPrice' => $basket->totalPrice,
            'expressFees' => $basket->expressFees,
            'hasBonzaProducts' => $basket->hasBonzaProducts,
            'hasBonzaPrintedProducts' => $basket->hasBonzaPrintedProducts
        ];
    }

    public function changeProductQuantity(Request $request) : array {

        $basket = session('basket');
        $basket->updateQuantity( $request->input('arrayName'), $request->input('arrayKey'), $request->input('quantity') );

        return [
            'success' => true,
            'product' => $basket->{$request->input('arrayName')}[$request->input('arrayKey')],
            'expressFees' => $basket->expressFees,
            'numberItems' => $basket->numberItems,
            'hireDeliveryDiscount' => $basket->hireDeliveryDiscount,
            'basketSubtotal'  => $basket->basketSubtotal,
            'totalPostageWeight' => $basket->totalPostageWeight,
            'totalPostageWeightPrice' => $basket->totalPostageWeightPrice,
            'postageWeights' => PostageWeight::getPrices($basket->totalPostageWeight),
            'totalPrice' => $basket->totalPrice
        ];
    }

    public function changePostageWeightId(Request $request) : array {

        $basket = session('basket');
        $basket->updateWeightPostageChoice( $request->input('postageWeightId') );

        return [
            'success' => true,
            'basketSubtotal'  => $basket->basketSubtotal,
            'totalPostageWeightPrice' => $basket->totalPostageWeightPrice,
            'totalPrice' => $basket->totalPrice
        ];
    }

    public function addDeliveryDate(Request $request) : array {

        $basket = session('basket');
        $basket->addBonzaProductsDeliveryDate( $request->input('deliveryDate') );

        return [
            'success' => true,
            'basketSubtotal'  => $basket->basketSubtotal,
            'totalPostageWeight' => $basket->totalPostageWeight,
            'totalPostageWeightPrice' => $basket->totalPostageWeightPrice,
            'postageWeights' => PostageWeight::getPrices($basket->totalPostageWeight),
            'totalPrice' => $basket->totalPrice,
            'expressFees' => $basket->expressFees,
            'expressFeeTotal' => $basket->expressFeeTotal,
            'deliveryDateWithin5WorkingDays' => $basket->deliveryDateWithin5WorkingDays,
            'printedLatexFromWizard' => $basket->printedLatexFromWizard
        ];
    }

    public function getBasketCount() : int {

        $basket = session('basket');
        return (integer) $basket->numberItems;
    }

}