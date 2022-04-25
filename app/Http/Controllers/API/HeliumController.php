<?php namespace App\Http\Controllers\API;

use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\PostcodeBig;

class HeliumController extends Controller
{
    public function searchSuppliers($postcode, $productID = NULL){

        $postcode = trim($postcode);

        // Check to see if postcode is in our database
        $postCodeFromDetails = PostCodeBig::where('postcode', '=', $postcode)->first();

        if( $postCodeFromDetails ){

            // Save postcode to a session so user doesn't have to add it twice
            session( ['depotPostcode' => $postcode] );

            $data['suppliers'] = Supplier::byDistance($postCodeFromDetails, $productID);
            return $data;
        }

        $data['postcodeNotFound'] = true;
        return $data;
    }

    public function addSupplierToSession(Request $request) : array {

        $basket = session('basket');
        $basket->removeHeliumHireCollectionsThatCantBePickedUpFromDepot( $request->input('supplier')['groupId'] );
        session( ['heliumSupplier' => $request->input('supplier') ] );

        return [true];
    }
}
