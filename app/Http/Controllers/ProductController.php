<?php namespace App\Http\Controllers;

use App\BHCalender;
use App\Models\OptionChoice;
use App\Models\Product;
use Illuminate\Http\Request;
use JavaScript;

class ProductController extends Controller
{

    private $product;

    // Todo add and research Keywords
    public function display($name, $id)
    {
        // Todo - Order By Price Ascending

        // Get the Base Product
        $product = Product::join('productdetails as pd', 'product.id', '=', 'pd.product_id')->with('optionChoices.items', 'alerts', 'types', 'categories.menus')->find($id);

        if(! $product ){
            abort(404);
        }

        $data['title'] = $product->name.' - Balloon Printing UK';
        $data['meta_keywords'] = !empty( $product->meta_key ) ? $product->meta_key : $name;
        $data['meta_description'] = !empty( $product->meta_desc ) ? $product->meta_desc : $product->name.' Product Page';


        // Todo - Need to put in a view here for products that are discontinued, paused or out of stock.

        $this->product = $product;
        $data['product'] = $product;

//        $sideBarSessionData = $this->getSideBarFlashData($request);
//        $data = array_merge($data, $sideBarSessionData);

        // Check to see if we have an associated category for related products tab.

        //Todo - not working for BH if don't go through cat
//        if( $data['catID'] ){
//            $data['relatedProducts'] = Product::select('id', 'ref_num')
//                ->where('id', '!=', $id)->with('details')
//                ->InStock()->IsActive()->ByCategory($data['catID'])
//                ->get();
//        }

        $typeData = $this->getDataByProductType( collect( $product['types'] )->pluck('id')->toArray() );

        $data = array_merge($data, $typeData['data']);

        return view('product/display'.$typeData['displayName'], $data);
    }

    // Helpers for this class
    private function getDataByProductType($typeArray){

        // Hire Helium - Database ID 12
        if( in_array('12', $typeArray) ) {
            $data['data'] = $this->getHeliumHireData();
            $data['displayName'] = 'HeliumHire';
            return $data;
        }

        // Standard Bonza Product
        $data['data'] = $this->getBonzaData();
        $data['displayName'] = 'Bonza';
        return $data;

    }

    private function getHeliumHireData(){

        $BHCalenderDates = BHCalender::getStartEndDates();

        $passToJs = [
            'excludeDates' => $BHCalenderDates['excludeDates'],
            'hireDeliveryMinDate' => $BHCalenderDates['hireDeliveryStartDatePicker'],
            'hireCollectMinDate' => $BHCalenderDates['hireCollectStartDatePicker'],
            'hireDeliveryMaxDate' => $BHCalenderDates['hireDeliveryReturnDatePicker'],
            'hireCollectMaxDate' => $BHCalenderDates['hireCollectReturnDatePicker'],
            'postcode' => session('depotPostcode', ''),
            'supplier' => session('heliumSupplier', false),
            'deliveryPrice' => $this->product->details->first()->delivery_price,
            'bocCollectPrice' => $this->product->details->first()->boc_collect_price,
            'apCollectPrice' => $this->product->details->first()->ap_collect_price,
            'collectPriceRange' => NULL,
            'collectPrice' => NULL,
        ];

        // If the cylinder has two prices, select the lowest
        if( $this->product->details->first()->ap_collect_price !== NULL && $this->product->details->first()->boc_collect_price !== NULL ){
            $passToJs['collectPriceRange'] = '£'.$this->product->details->first()->ap_collect_price.' to £'.$this->product->details->first()->boc_collect_price;
            $passToJs['supplierGroupIdsCanCollectFrom'] = [1,2];
        }else {
            $passToJs['collectPrice'] = $this->product->details->first()->ap_collect_price ?? $this->product->details->first()->boc_collect_price;
            $passToJs['supplierGroupIdsCanCollectFrom'] = $this->product->details->first()->boc_collect_price ? [1] : [2];
        }

        JavaScript::put($passToJs);

        $data['page_js'] = ['heliumProduct'];
        return $data;
    }

    private function getBonzaData(){

        $data['page_js'] = ['bonzaProduct'];

        return $data;
    }

//    private function getSideBarFlashData($request){
//
//        $data['catID'] = '';
//        $data['menuID'] = '';
//
//        // See if the user has been on a category page before hand, so we can expand the menu appropriately.
//        if ( $request->session()->has('catID') ) {
//
//            // We re-flash the session in case the customer reloads the page
//            $request->session()->reflash();
//
//            $data['catID'] = session('catID');
//            $data['menuID'] = session('menuID');
//
//            return $data;
//        }
//
//        // If there is no session data we just use the first associated category and menu relationship from the loaded product
//        // We do this because products can be related to multiple categories
//
//        // Check that the product has a category. Might not if dealing with paused, discontinued balloons;
//        if( ! empty( $this->product['categories'] ) ){
//            $data['catID'] = $this->product['categories'][0]->id;
//            $data['menuID'] = $this->product['categories'][0]['menus'][0]->id;
//        }
//
//        return $data;
//
//    }

}