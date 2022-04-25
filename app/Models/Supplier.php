<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Log;

class Supplier extends Model
{
    protected $table = 'supplier';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function groups()
    {
        return $this->belongsToMany(SupplierGroup::class, 'suppliergroup_supplier', 'supplier_id', 'group_id');
    }

    public function scopeByGroup($query, $id){
        return $query->whereHas('groups', function ($q) use ($id) {
            $q->where('id', $id);
        });
    }

    public static function byDistance($postCodeFromDetails, $productID = null) {

        // Todo - do we need to return all the information in the result set. Far too much weight
        $suppliers = $productID ? self::byProductID( $productID ) : self::with('groups.products.details')->get();


        foreach ($suppliers as $key => $supplier) {
            $distance = self::calculatePostCodeDistances($postCodeFromDetails, $supplier);
            $suppliers[$key]->distance_km = $distance['km'];
            $suppliers[$key]->distance_miles = $distance['miles'];
        }

        // Sort the suppliers by distance
        $suppliers = $suppliers->sort( function($a, $b) {
            return ($a->distance_km * 100) - ($b->distance_km * 100);
        });

        // Get the 9 nearest by distance suppliers
        $suppliers = $suppliers->values()->slice(0, 9);

        // Make the products more accessible to view
        return $suppliers->map( function ($supplier) {

            $products = $supplier['groups'][0]['products'];

            // Sort them by price
            $supplier->products = $products->sort( function($a, $b) {
                return ($a['details'][0]->delivery_price * 100) - ($b['details'][0]->delivery_price * 100);
            });

            return self::cleanSupplier($supplier);
        });
    }

    public static function byProductID( $productID ){

        // Products are associated with a many through many to many relationship that eloquent doesn't support
        $supplierGroups = Product::find($productID)->supplierGroups()->get();

        // Can pick up from any supplier group
        if($supplierGroups->count() === 2){
            return self::with(['groups', 'groups.products' => function($q){
                $q->has('details');
            }, 'groups.products.details'])->get();
        }

        // Can only pick up from specific supplier group depots
        return self::ByGroup( $supplierGroups->first()->id )->with(['groups', 'groups.products' => function($q){
            $q->has('details');
        }, 'groups.products.details'])->get();

    }

    protected static function calculatePostCodeDistances($northingEastingA, $northingEastingB) {

        # postcode_a
        $gridNA = $northingEastingA->northing;
        $gridEA = $northingEastingA->easting;

        # postcode_b
        $gridNB = $northingEastingB->northing;
        $gridEB = $northingEastingB->easting;

        # take grid refs from each other
        $distanceN = $gridNA - $gridNB;
        $distanceE = $gridEA - $gridEB;

        # calculate the distance between the two
        $hypot = sqrt(($distanceN * $distanceN) + ($distanceE * $distanceE));

        $km = round($hypot / 1000, 2);
        $miles = round($km * 0.621371192237334, 2);

        $distance['km'] = $km;
        $distance['miles'] = $miles;

        return $distance;
    }

    // Removes some of the info that not needed - todo - need to do some of this on the sql level also
    protected static function cleanSupplier($supplier){

        $newSupplier = new \stdClass;
        $newSupplier->id = $supplier->id;
        $newSupplier->name = $supplier->name;
        $newSupplier->distance_km = $supplier->distance_km;
        $newSupplier->distance_miles = $supplier->distance_miles;
        $newSupplier->opening_hours = $supplier->opening_hours;
        $newSupplier->postcode = $supplier->postcode;
        $newSupplier->groupId = $supplier->groups()->first()->id;

        $newSupplier->products = self::cleanProducts($supplier->products);

        return $newSupplier;
    }

    // Removes some of the info that not needed - todo - need to do some of this on the sql level also
    protected static function cleanProducts($products){

        return $products->map( function ($product) {

            $newProduct = new \stdClass;
            $newProduct->id = $product->id;
            $newProduct->name = $product['details'][0]->name;

            return $newProduct;
        });

    }
}