<?php namespace App;

use App\Models\OptionChoiceItem;
use App\Models\Product;

class HeliumHireProduct {

    public $id;
    public $quantity;
    public $pagePath;
    public $productName;
    public $description;
    public $refNum;

    public $isJumbo = FALSE;
    public $balloonTypeID;
    public $balloonType;
    public $collectedOrDelivered = 'delivery';
    public $depotGroupId;
    public $depotGroupsIdsCanCollectFrom;

    public $startDate;
    public $endDate;
    public $additionalWeeks = 0;
    public $additionalWeekPrice = 0;

    public $unitPriceWithVat = 0;
    public $totalPriceWithoutVat;
    public $totalPriceWithVat;
    public $totalVatAmount;

    public function __construct($product, $depotGroupId = NULL) {

        $this->id = $product['id'];
        $this->quantity = $product['quantity'];
        $this->pagePath = $product['pagePath'];
        $this->balloonTypeID = $product['balloonTypeID'];
        $this->balloonType = OptionChoiceItem::find($this->balloonTypeID)->name;

        // Set product details
        $productFromDB = Product::find($this->id);

        $this->productName = $productFromDB->details[0]->name;
        $this->refNum = $productFromDB->ref_num;

        if($productFromDB->containsJumbo){
            $this->isJumbo = TRUE;
        }

        if( $product['collectOrDeliveryPrice'] === 'collected' ){
            $this->depotGroupId = $depotGroupId;
            $this->depotGroupsIdsCanCollectFrom = $productFromDB->supplierGroups->pluck('id')->all();
        }

        // Set price depending on if collecting or delivering the cylinder - Default as delivery price
        $this->unitPriceWithVat = $productFromDB->details[0]->delivery_price;

        // However if collecting
        if( $product['collectOrDeliveryPrice'] === 'collected' ){

            $this->unitPriceWithVat = $this->depotGroupId === 1 ? $productFromDB->details[0]->boc_collect_price :  $productFromDB->details[0]->ap_collect_price;
            $this->collectedOrDelivered = 'collect';
        }

        // Set Date Info
        $this->startDate = $product['startDate'];
        $this->endDate = $product['endDate'];
        $this->additionalWeeks = $product['additionalWeeks'];
        $this->additionalWeekPrice = $product['additionalWeekPrice'];

        $this->runPriceCalculations();
        $this->makeDescription();
    }

    public function updateQuantity($quantity) : void {

        $this->quantity += $quantity;
        $this->runPriceCalculations();
    }

    public function changeQuantity($quantity) : void {

        $this->quantity = $quantity;
        $this->runPriceCalculations();
    }

    public function changeDepotGroupId($depotGroupId) : void {

        $this->depotGroupId = $depotGroupId;
        $product = Product::find($this->id);
        $this->unitPriceWithVat = $this->depotGroupId === 1 ? $product->details[0]->boc_collect_price : $product->details[0]->ap_collect_price;
        $this->runPriceCalculations();
    }

    private function runPriceCalculations() : void {

        $this->totalPriceWithVat = round( ( $this->additionalWeekPrice + $this->unitPriceWithVat ) * $this->quantity, 2 );
        $this->totalPriceWithoutVat = round( $this->totalPriceWithVat / 1.2, 2 );
        $this->totalVatAmount = $this->totalPriceWithVat - $this->totalPriceWithoutVat ;
    }

    private function makeDescription() : void {

        $description = $this->productName. " for $this->balloonType - $this->collectedOrDelivered";

        if( $this->collectedOrDelivered === 'collect' && $this->additionalWeeks > 0 ){
            $description .= "- with $this->additionalWeeks additional weeks";
        }
        $this->description = $description;
    }
}