<?php

namespace App;

// As prices are often submitted viw javascript, this class makes sure that they haven't been manipulated on the client side

class HardPriceSetter
{
    public static function bonza($product){

    }

    public static function heliumCollection($product, $supplier){

    }

    public static function heliumDelivery($product){

    }

    public static function printedLatexFromWizard($product){

        $data['numberBalloons'] = (integer) $product->numberBalloons;
        $data['numberColours'] = (integer) $product->printingOptionSelected->artworkColours;
        $data['numberInkSwitches'] = (integer) $product->printingOptionSelected->inkChanges;
        $data['sides'] = (integer) $product->printingOptionSelected->sideNum;
        $data['inkColourNames'] = ! empty( $product->inkColourNames ) ? explode(',', $product->inkColourNames ) : [];
        $data['size'] = (integer) $product->sizeSelected;
        $data['typeSelectedId'] = (integer) $product->typeSelected->id;

        $prices = PrintingPrices::latex($data);
        $product->priceWithVat = $prices['totalPriceWithVat'];

        return $product;
    }

    public static function printedLatexGiantFromWizard($product){



    }

    public static function printedFoilFromWizard($product){

        $data['numberBalloons'] = (integer) $product->numberBalloons;
        $data['numberColours'] = (integer) $product->numberColours;
        $data['numberInkSwitches'] = (integer) $product->numberInkSwitches;
        $data['sides'] = (integer) $product->sides;
        $data['shapeSelected'] = $product->typeSelected->folder;
        $data['sideDesignType'] = $product->sideDesignType;

        $prices = PrintingPrices::foil($data);
        $product->priceWithVat = $prices['totalPriceWithVat'];

        return $product;
    }
}