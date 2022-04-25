<?php namespace App;

class OrderDetailsRepository{

    public $customerContactFullName;
    public $customerContactEmail;
    public $customerContactPhone;

    public $deliveryBonzaFullName;
    public $deliveryBonzaAdd1;
    public $deliveryBonzaAdd2;
    public $deliveryBonzaCityTown;
    public $deliveryBonzaPostCode;
    public $deliveryBonzaCountry = 'United Kingdom';

    public $heliumSupplier;
    public $heliumStorageAdd1;
    public $heliumStorageAdd2;
    public $heliumStorageCityTown;
    public $heliumStoragePostCode;

    public $hireDeliveryCustomerName;
    public $hireDeliveryCustomerPhone;
    public $hireDeliveryAdd1;
    public $hireDeliveryAdd2;
    public $hireDeliveryCityTown;
    public $hireDeliveryPostCode;

    public $termsChecked;

    public function addDetails(array $request) : void {

        foreach($request as $key => $value){
            if( property_exists($this, $key) ){
                $this->$key = $value;
            }
        }
    }
}
