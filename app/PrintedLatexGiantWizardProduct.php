<?php namespace App;

class PrintedLatexGiantWizardProduct
{
    public $productName;
    public $description;
    public $quantity = 1;

    public $numberBalloons;

    public $typeSelected;
    public $coloursChosen;
    public $size;
    public $sides;
    public $artworkInkColour;

    public $uploadedArtwork;
    public $artworkText;
    public $artworkFont;

    public $unitPostageWeight;
    public $totalPostageWeight;
    public $totalPostageWeightKg;

    public $unitPriceWithVat;
    public $totalVatAmount;
    public $totalPriceWithoutVat;
    public $totalPriceWithVat;

    public function __construct($data) {

        $this->numberBalloons = $data->numberBalloons;
        $this->typeSelected = $data->giantLatexTypeSelected;
        $this->coloursChosen = $data->coloursSelectedNameList;
        $this->size = $data->sizeOptionSelected;
        $this->sides = $data->sideOptionSelected;
        $this->artworkInkColour = $data->artworkInkColour;
        $this->uploadedArtwork = $data->uploadedArtwork;
        $this->artworkText = $data->artworkText;
        $this->artworkFont = $data->artworkFont;

        $this->unitPostageWeight = $this->size === 2 ? 25 : 55; // 2 ft 25g , 3ft 55g
        $this->unitPriceWithVat = $data->priceWithVat;
        $this->productName = "$this->numberBalloons Giant Custom Printed Latex Balloons";
        $this->makeDescription();
        $this->runPriceAndWeightCalculations();
    }

    public function changeQuantity($quantity) : void {

        $this->quantity = $quantity;
        $this->runPriceAndWeightCalculations();
    }

    private function makeDescription() : void {

        $this->description = "$this->numberBalloons giant custom printed ".$this->size.'ft latex balloons, printed on ';
        $this->description .= $this->sides === 1 ? '1 side ' : '2 sides ';
        $this->description .= 'with 1 artwork colour.';
    }

    private function runPriceAndWeightCalculations() : void {

        $this->totalPostageWeight = ( $this->unitPostageWeight * $this->numberBalloons ) * $this->quantity;
        $this->totalPostageWeightKg = $this->totalPostageWeight / 1000;

        $this->totalPriceWithVat = round($this->quantity * $this->unitPriceWithVat, 2);
        $this->totalPriceWithoutVat = $this->totalPriceWithVat / 1.2;
        $this->totalVatAmount = $this->totalPriceWithVat - $this->totalPriceWithoutVat ;
    }
}