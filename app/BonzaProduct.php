<?php namespace App;

use App\Models\OptionChoiceItem;
use App\Models\Product;

class BonzaProduct
{
    public $id;
    public $quantity;
    public $productName;
    public $description;
    public $refNum;

    public $unitPostageWeight;
    public $totalPostageWeight;
    public $totalPostageWeightKg;

    public $deliveryID;
    public $deliveryName;
    public $unitDeliveryPriceWithVat = 0;
    public $totalDeliveryPriceWithVat = 0;

    public $unitPriceWithVat = 0;
    public $totalPriceWithoutVat;
    public $totalVatAmount;
    public $totalPriceWithVat;

    public $pagePath;

    public function __construct($product) {

        $this->id = $product['id'];
        $this->quantity = $product['quantity'];
        $this->pagePath = $product['pagePath'];

        // Some products ask the customer to choose a delivery option on the product page
        if( isset( $product['deliveryOptionID'] ) ){
            $this->setDeliveryOptions( $product['deliveryOptionID'] );
        }

        $this->setProductOptions();

        $this->runPriceAndWeightCalculations();
    }

    public function updateQuantity($quantity) : void {

        $this->quantity += $quantity;
        $this->runPriceAndWeightCalculations();
    }

    public function changeQuantity($quantity) : void {

        $this->quantity = $quantity;
        $this->runPriceAndWeightCalculations();
    }

    protected function setDeliveryOptions($deliveryOptionID) : void {

        $this->deliveryID = $deliveryOptionID;
        $deliveryOption = OptionChoiceItem::find($deliveryOptionID);
        $this->deliveryName = $deliveryOption->name;
        $this->unitDeliveryPriceWithVat = $deliveryOption->price;
    }

    protected function setProductOptions() : void {

        $product = Product::find($this->id);

        $this->productName = $product->details[0]->name;
        $this->refNum = $product->ref_num;
        $this->unitPostageWeight = $product->postage_weight;
        $this->unitPriceWithVat = $product->details[0]->unit_price;

        $this->makeDescription();
    }

    // Makes a description for invoice
    protected function makeDescription() : void {

        $desc = $this->productName;

        if(! empty( $this->deliveryName ) ){
            $desc .= " with $this->deliveryName";
        }
        $this->description = $desc;
    }

    // Calculates all the price values
    protected function runPriceAndWeightCalculations() : void {

        $this->totalPostageWeight = $this->unitPostageWeight * $this->quantity;
        $this->totalPostageWeightKg = $this->totalPostageWeight / 1000;

        $this->totalDeliveryPriceWithVat = round($this->unitDeliveryPriceWithVat * $this->quantity, 2);
        $this->totalPriceWithVat = round($this->totalDeliveryPriceWithVat + ($this->unitPriceWithVat  * $this->quantity), 2);
        $this->totalPriceWithoutVat = round($this->totalPriceWithVat / 1.2, 2);

        $this->totalVatAmount = $this->totalPriceWithVat - $this->totalPriceWithoutVat;
    }
}