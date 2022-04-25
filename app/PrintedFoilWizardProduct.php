<?php
/**
 * Created by PhpStorm.
 * User: robertgoodliffe
 * Date: 08/09/2018
 * Time: 12:34
 */

namespace App;


class PrintedFoilWizardProduct
{
    public $productName;
    public $description;
    public $quantity = 1;

    // Step 1 - Number and Express Fee
    public $numberBalloons;
    public $expressFeeId = 5;

    // Step 2 - Balloon Colours and Type
    public $typeSelectedName;
    public $coloursChosen;

    // Step 3 - Print Options
    public $sides;
    public $sideDesignType; // Defines the side type when printing on 2 sides of balloon: same or different
    public $side1OrSameInkColourNumber; // Number of artwork colours (1 to 8) on side 1
    public $side2InkColourNumber; // Number of artwork colours (1 to 8) on side 2
    public $inkChangeNumber;

    // Step 4 - Ink & Switch Colour / Pantones
    public $inkSwitchColourPantone;
    public $pantonesSide1List;
    public $pantonesSide2List;

    // Step 5
    public $uploadedArtwork;
    public $artworkText;
    public $artworkFont;

    // Pricing & Weights
    public $unitPostageWeight = 10;
    public $totalPostageWeight;
    public $totalPostageWeightKg;

    public $unitPriceWithVat;
    public $totalPriceWithoutVat;
    public $totalVatAmount;
    public $totalPriceWithVat;


    public function __construct($data) {

        // Step 1 - Number and Express Fee
        //////////////////////////////////
        $this->numberBalloons = $data->numberBalloons;

        // Step 2 - Balloon Colours and Type
        ////////////////////////////////////
        $this->typeSelectedName = $data->typeSelected->name;
        $this->coloursChosen = $data->coloursSelectedNameList;

        // Step 3 - Print Options
        /////////////////////////
        $this->sides = $data->sides;
        $this->side1OrSameInkColourNumber = $data->side1OrSameInkColourNumber; // Get the number of artwork colours on side 1

        // Check if Ink Switch
        if( ($this->sides === 1 && $this->side1OrSameInkColourNumber === 1) ||  ($this->sides === 2 && $this->sideDesignType === 'same' && $this->side1OrSameInkColourNumber === 1) ){
            $this->inkChangeNumber = $data->inkSwitch ? 1 : 0;
            $this->inkSwitchColourPantone = $data->inkSwitch ? $data->inkSwitchPantone : '';
        }

        if($this->sides === 2){
            $this->sideDesignType = $data->sideDesignType;
            if($this->sideDesignType === 'different'){
                $this->side2InkColourNumber = $data->side2InkColourNumber;
            }
        }

        // Step 4 - Ink & Switch Colour / Pantones
        ///////////////////////////////////////////
        $this->pantonesSide1List = $data->pantonesSide1List;
        $this->pantonesSide2List = $data->pantonesSide2List;

        // Step 5 - Artwork Uploads and Text Font
        ///////////////////////////////////////////
        $this->uploadedArtwork = $data->uploadedArtwork;
        $this->artworkText = $data->artworkText;
        $this->artworkFont = $data->artworkFont;

        // Pricing Details
        $this->unitPriceWithVat = $data->priceWithVat;

        // Make names and description for basket overview / invoice
        $this->productName = $this->numberBalloons.' Custom Foil Balloons';

        $this->makeDescription();

        $this->runPriceCalculations();
    }

    public function changeQuantity($quantity) : void {

        $this->quantity = $quantity;
        $this->makeDescription();
        $this->runPriceCalculations();
    }

    // Makes a description for quotes
    private function makeDescription() : void {

        $this->description = "$this->numberBalloons custom printed $this->typeSelectedName foil balloons, printed on";
        $this->description .= $this->sides === 1 ? ' 1 side ' : ' 2 sides';

        if( $this->sides === 2 && $this->sideDesignType === 'same') {
            $this->description .= ' with the same '.$this->side1OrSameInkColourNumber.' colour artwork design on both sides';
        }

        if(  $this->sides === 2 && $this->sideDesignType === 'different'){
            $this->description .= ' with a different design on either side ('.$this->side1OrSameInkColourNumber.' colour'.($this->side1OrSameInkColourNumber > 1 ? 's' : '').' on 1 side and '.$this->side2InkColourNumber.' colour'.($this->side2InkColourNumber > 1 ? 's' : '').' on the other)';
        }

        if( $this->inkChangeNumber){
            $this->description .= '. 1 ink colour switch included';
        }

        $this->description .= '.';

        if( $this->expressFeeId === 1 || $this->expressFeeId === 3){
            $this->description .= $this->expressFeeId === 1 ? ' 1 to 2 Working Day Express Fee Added.' : ' 3 to 4 Working Day Express Fee Added.';
        }
    }

    private function runPriceCalculations() : void {

        $this->totalPostageWeight = ( $this->unitPostageWeight * $this->numberBalloons ) * $this->quantity;
        $this->totalPostageWeightKg = $this->totalPostageWeight / 1000;

        $this->totalPriceWithVat = round($this->quantity * $this->unitPriceWithVat, 2);
        $this->totalPriceWithoutVat = round($this->totalPriceWithVat / 1.2, 2);
        $this->totalVatAmount = $this->totalPriceWithVat - $this->totalPriceWithoutVat;
    }
}