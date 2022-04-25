<?php namespace App;

class PrintedLatexWizardProduct
{
    public $productName;
    public $description;
    public $quantity = 1;

    // Pane 1
    public $numberBalloons;
    public $expressFeeId = 5;
    public $expressFeeWithoutVat = 0;
    public $expressFeeWithVat = 0;
    public $expressFeeDescription = '';

    // Pane 2
    public $typeSelected;
    public $coloursChosen;

    // Pane 3
    public $size;
    public $sides;
    public $artworkColours;
    public $inkChanges;

    // Pane 4
    public $artworkColourPantones = [];
    public $artworkColourNameList;
    public $side1Pantone;
    public $side2Pantone;
    public $inkSwitchPantone;

    // Pane 5
    public $uploadedArtwork;
    public $artworkText;
    public $artworkFont;

    // Pricing & Weights
    public $unitPostageWeight;
    public $totalPostageWeight;
    public $totalPostageWeightKg;

    public $unitPriceWithVat;
    public $totalVatAmount;
    public $totalPriceWithoutVat;
    public $totalPriceWithVat;

    public function __construct($data) {

        // Pane 1
        $this->numberBalloons = $data->numberBalloons;

        // Pane 2
        $this->typeSelected = $data->typeSelected;
        $this->coloursChosen = $data->coloursSelectedNameList;

        // Pane 3
        $this->size = $data->sizeSelected;
        $this->sides = $data->printingOptionSelected->sideNum;
        $this->artworkColours = $data->printingOptionSelected->artworkColours;

        // Pane 4
        if( $data->displayPantone1234 ){

            $this->artworkColourNameList = $data->pantone1234NameList;
            $this->artworkColourPantones[] = $data->pantone1;

            if( $data->displayPantone2 ){
                $this->artworkColourPantones[] = $data->pantone2;
            }

            if( $data->displayPantone3 ){
                $this->artworkColourPantones[] = $data->pantone3;
            }

            if( $data->displayPantone4 ){
                $this->artworkColourPantones[] = $data->pantone4;
            }
        }

        if( $data->printingOptionSelected->id === 3){
            $this->side1Pantone = $data->side1Pantone;
            $this->side2Pantone = $data->side2Pantone;
        }

        if( $data->printingOptionSelected->inkChanges ){
            $this->inkChanges = $data->printingOptionSelected->inkChanges;
            $this->inkSwitchPantone = $data->inkSwitchPantone;
        }

        // Pane 5
        $this->uploadedArtwork = $data->uploadedArtwork;
        $this->artworkText = $data->artworkText;
        $this->artworkFont = $data->artworkFont;

        // Global
        $this->unitPostageWeight = $this->size === 10 ? 2.7 : 3.6; // 10 inch 2.7g , 12 inch 3.6 g
        $this->unitPriceWithVat = $data->priceWithVat;
        $this->productName = "$this->numberBalloons Custom Printed Latex Balloons";
        $this->makeDescription();
        $this->runPriceAndWeightCalculations();
    }

    public function changeQuantity($quantity) : void {

        $this->quantity = $quantity;
        $this->runPriceAndWeightCalculations();
    }

    private function makeDescription() : void {

        $this->description = "$this->numberBalloons custom printed $this->size Inch latex balloons, printed on ";
        $this->description .= $this->sides === 1 ? '1 side ' : '2 sides ';
        $this->description .= 'with ';
        $this->description .= $this->artworkColours === 1 ? '1 artwork colour' : "$this->artworkColours artwork colours";

        if($this->inkChanges === 1) {
            $this->description .= ' and an ink colour switch';
        }
        $this->description .= '.';
    }

    public function changeExpressFeeId($id) : void {

        $this->expressFeeId = $id;

        if( $this->expressFeeId === 1 ){
            $this->expressFeeDescription = ' Next working day.';
        }

        if( $this->expressFeeId === 2 ){
            $this->expressFeeDescription = ' 2 working days.';
        }

        if( $this->expressFeeId === 3 ){
            $this->expressFeeDescription = ' 3 to 4 working days.';
        }

        $this->runPriceAndWeightCalculations();
    }

    private function runPriceAndWeightCalculations() : void {

        $this->totalPostageWeight = ( $this->unitPostageWeight * $this->numberBalloons ) * $this->quantity;
        $this->totalPostageWeightKg = $this->totalPostageWeight / 1000;

        $totalPriceWithVATBeforeExpressFees = round($this->quantity * $this->unitPriceWithVat, 2);

        $expressFee = PrintingExpressFee::calculateFromId($this->expressFeeId, $totalPriceWithVATBeforeExpressFees);

        $this->expressFeeWithoutVat = $expressFee['withoutVat'];
        $this->expressFeeWithVat = $expressFee['withVat'];

        $this->totalPriceWithVat = $totalPriceWithVATBeforeExpressFees + $this->expressFeeWithVat;
        $this->totalPriceWithoutVat = $this->totalPriceWithVat / 1.2;
        $this->totalVatAmount = $this->totalPriceWithVat - $this->totalPriceWithoutVat ;
    }
}