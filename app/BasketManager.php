<?php namespace App;

use App\Models\PostageWeight;

class BasketManager {

    # OrderType
    public $orderType;

    # Products
    public $bonzaProducts = [];
    public $heliumHireCollections = [];
    public $heliumHireDeliveries = [];
    public $printedLatexFromWizard = [];
    public $printedLatexGiantFromWizard = [];
    public $printedFoilFromWizard = [];

    # Helpers to determine what info to show and which form partials are required
    public $hasBonzaProducts = false;
    public $hasBonzaPrintedProducts = false;
    public $hasHireCollect = false;
    public $hasHireDelivery = false;
    public $hasJumboCollectCylinder = false;

    # Helpers used to show number/discount of helium cylinders
    public $numDeliveryHireDiscount;
    public $numDeliveryHire;
    public $numCollectHire;

    # Delivery Date To Calculate Postage Cost and Express Fees
    public $bonzaProductsDeliveryDate;
    public $deliveryDateWithin5WorkingDays = false;

    # Express Fees & Ids
    public $expressFeeId = 5;
    public $expressFees;
    public $expressFeeTotal;

    # Postage Weight & costs
    public $totalPostageWeight;
    public $postageWeightId = 9;
    public $postageWeightName;
    public $totalPostageWeightPrice;

    # Total Items in Basket
    public $numberItems = 0;

    # Prices and Discounts
    public $hireDeliveryDiscount = 0;
    public $totalDeliveryPrice;

    public $basketSubtotal;
    public $totalPrice = 0;

    public function addBonza($product) : void {

        $notInBasket = true;

        foreach($this->bonzaProducts as $storedProduct){

            $inStoredProduct = false;

            if( $storedProduct->id === $product['id'] ){

                $notInBasket = false;
                $inStoredProduct = true;

                // stored product has a delivery option and so does product adding, so we need to check to see if
                // they are the same delivery option
                if( !empty( $storedProduct->deliveryID ) && isset( $product['deliveryOption'] ) ){

                    if($storedProduct->deliveryID !== $product['deliveryOption']){
                        $notInBasket = true;
                        $inStoredProduct = false;
                    }
                }

                // if the stored item doesn't have a delivery option and the product we are having does,
                // we need to add a new product
                if( empty( $storedProduct->deliveryID ) && isset( $product['deliveryOption'] ) ){
                    $notInBasket = true;
                    $inStoredProduct = false;
                }
            }

            if ($inStoredProduct) {
                $storedProduct->updateQuantity($product['quantity']);
                break;
            }
        }

        if($notInBasket){
            $this->bonzaProducts[] = new BonzaProduct($product);
        }

        $this->runCalculations();
    }

    public function addHelium($product, $supplier) : void {

        $objectToCheck = $product['collectOrDeliveryPrice'] === 'collected' ? 'heliumHireCollections' : 'heliumHireDeliveries';

        // Checks to see if the product and it's associated options have already been added to the basket
        foreach( $this->$objectToCheck as $storedProduct ){

            if( $storedProduct->id === $product['id'] ) {

                $balloonTypeIsSame = $product['balloonTypeID'] === $storedProduct->balloonTypeID;
                $startDateIsSame = $product['startDate'] === $storedProduct->startDate;
                $endDateIsSame = $product['endDate'] === $storedProduct->endDate;

                if ($balloonTypeIsSame && $startDateIsSame && $endDateIsSame ) {
                    // Product and associated options are in basket so we update
                    $storedProduct->updateQuantity( $product['quantity'] );
                    $this->runCalculations();
                    return;
                }
            }
        }

        $depotGroupId = $supplier !== NULL ? $supplier['groupId'] : NULL;
        $this->{$objectToCheck}[] = new HeliumHireProduct($product, $depotGroupId);
        $this->runCalculations();
    }

    public function addPrintedLatexFromWiz($data) : void {

        $this->printedLatexFromWizard[] = new PrintedLatexWizardProduct($data);
        $this->runCalculations();
    }

    public function addPrintedLatexGiantFromWiz($data) : void {

        $this->printedLatexGiantFromWizard[] = new PrintedLatexGiantWizardProduct($data);
        $this->runCalculations();
    }

    public function addPrintedFoilFromWiz($data) : void {

        $this->printedFoilFromWizard[] = new PrintedFoilWizardProduct($data);
        $this->runCalculations();
    }

    public function removeProduct($arrayCategory, $arrayKey) : void {

        $array = $this->$arrayCategory;
        unset($array[$arrayKey]);
        $this->$arrayCategory = $array;

        $this->runCalculations();
    }

    public function updateQuantity($productArray, $productKey, $value) : void {

        $this->{$productArray}[$productKey]->changeQuantity($value);
        $this->runCalculations();
    }

    public function updateWeightPostageChoice($postageWeightId) : void {

        $this->postageWeightId = $postageWeightId;
        $this->runCalculations();
    }

    public function addBonzaProductsDeliveryDate($deliveryDate) : void {

        $this->bonzaProductsDeliveryDate = $deliveryDate;
        $this->expressFeeId = PrintingExpressFee::getIdFromDate($deliveryDate);
        $this->deliveryDateWithin5WorkingDays = $this->expressFeeId !== 5;

        $this->runCalculations();
    }

    public function removeHeliumHireCollectionsThatCantBePickedUpFromDepot($depotGroupId) : void {

        foreach($this->heliumHireCollections as $key => $product){

            if ( ! \in_array($depotGroupId, $product->depotGroupsIdsCanCollectFrom, true) ){
                unset( $this->heliumHireCollections[$key] );
            }
        }

        foreach($this->heliumHireCollections as $key => $heliumHireProduct){

            $heliumHireProduct->changeDepotGroupId($depotGroupId);
        }

        $this->runCalculations();
    }

    // Runs all the calculations and logic in basket depending on products in basket.
    // e.g. price, weight, delivery discount
    private function runCalculations() : void {

        $this->numDeliveryHireDiscount = 0; // Calculate number of delivery hire cylinders discounts
        $this->hireDeliveryDiscount = 0;

        $this->numDeliveryHire = 0;
        $this->numCollectHire = 0;

        $this->basketSubtotal = 0;
        $this->totalPrice = 0;
        $this->totalDeliveryPrice = 0;
        $this->totalPostageWeight = 0;
        $this->totalPostageWeightPrice = 0;
        $this->numberItems = 0;

        $this->hasBonzaProducts = false;
        $this->hasBonzaPrintedProducts = false;
        $this->hasHireCollect = false;
        $this->hasHireDelivery = false;
        $this->hasJumboCollectCylinder = false;

        $this->expressFees = [];
        $this->expressFeeTotal = 0;

        foreach($this->bonzaProducts as $product){

            $this->hasBonzaProducts = true;
            $this->numberItems += $product->quantity;
            $this->totalPostageWeight += $product->totalPostageWeight;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        foreach($this->heliumHireDeliveries as $product){

            $this->hasHireDelivery = true;
            $this->numDeliveryHireDiscount += $product->quantity -1;
            $this->numberItems += $product->quantity;
            $this->numDeliveryHire += $product->quantity;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        foreach($this->heliumHireCollections as $product){

            if($product->isJumbo){
                $this->hasJumboCollectCylinder = true;
            }
            $this->hasHireCollect = true;
            $this->numberItems += $product->quantity;
            $this->numCollectHire += $product->quantity;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        foreach($this->printedLatexFromWizard as $product){

            $product->changeExpressFeeId($this->expressFeeId);

            $this->expressFees[] = [ 'name' => $product->productName, 'fee' => $product->expressFeeWithVat ];
            $this->expressFeeTotal += $product->expressFeeWithVat;
            $this->hasBonzaProducts = true;
            $this->hasBonzaPrintedProducts = true;
            $this->numberItems += $product->quantity;
            $this->totalPostageWeight += $product->totalPostageWeight;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        foreach($this->printedLatexGiantFromWizard as $product){

            $this->hasBonzaProducts = true;
            $this->hasBonzaPrintedProducts = true;
            $this->numberItems += $product->quantity;
            $this->totalPostageWeight += $product->totalPostageWeight;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        foreach($this->printedFoilFromWizard as $product){

            $this->hasBonzaProducts = true;
            $this->hasBonzaPrintedProducts = true;
            $this->numberItems += $product->quantity;
            $this->totalPostageWeight += $product->totalPostageWeight;
            $this->basketSubtotal += $product->totalPriceWithVat;
        }

        // Get hire delivery discount
        if($this->numDeliveryHireDiscount > 0){

            $this->hireDeliveryDiscount = 20 * ($this->numDeliveryHireDiscount - 1);
            $this->basketSubtotal -= $this->hireDeliveryDiscount;
        }

        // Works out weight postage price
        if( $this->totalPostageWeight ){

            $postageWeight = PostageWeight::getPrice($this->postageWeightId, $this->totalPostageWeight);

            $this->postageWeightName = $postageWeight['name'];
            $this->totalPostageWeightPrice = $postageWeight['price'] * 1;
        }

        //Works out total basket price including any delivery
        $this->totalPrice = $this->basketSubtotal + $this->totalPostageWeightPrice;
    }
}