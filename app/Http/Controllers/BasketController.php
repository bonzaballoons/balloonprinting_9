<?php namespace App\Http\Controllers;

use App\BPCalender;
use Illuminate\Http\Request;
use JavaScript;
use App\Models\PostageWeight;

class BasketController extends Controller
{
    public function basket(Request $request)
    {
        $data['title'] = 'Your Basket - Balloon Printing UK';
        $data['navLink'] = 'basket';
        $data['meta_keywords'] = 'basket, cart';
        $data['meta_description'] = 'Your Balloon Printing Basket';
        $data['page_js'] = ['basket'];

        $basket = session('basket');

        JavaScript::put([
            'numberItems' => $basket->numberItems,
            'bonzaProducts' => $basket->bonzaProducts,
            'heliumHireCollections' => $basket->heliumHireCollections,
            'heliumHireDeliveries' => $basket->heliumHireDeliveries,
            'printedLatexFromWizard' => $basket->printedLatexFromWizard,
            'printedLatexGiantFromWizard' => $basket->printedLatexGiantFromWizard,
            'printedFoilFromWizard' => $basket->printedFoilFromWizard,
            'hasBonzaProducts' => $basket->hasBonzaProducts,
            'hasBonzaPrintedProducts' => $basket->hasBonzaPrintedProducts,
            'hireDeliveryDiscount' => $basket->hireDeliveryDiscount,
            'basketSubtotal'  => $basket->basketSubtotal,
            'totalPostageWeight' => $basket->totalPostageWeight,
            'totalPostageWeightPrice' => $basket->totalPostageWeightPrice,
            'totalPrice' => $basket->totalPrice,
            'heliumSupplier' => session('heliumSupplier', false),
            'depotPostcode' => session('depotPostcode', false),
            'postageWeights' => PostageWeight::getPrices($basket->totalPostageWeight),
            'bonzaProductsDeliveryDate' => $basket->bonzaProductsDeliveryDate,
            'deliveryDateWithin5WorkingDays' => $basket->deliveryDateWithin5WorkingDays,
            'expressFees' => $basket->expressFees,
            'expressFeeTotal' => $basket->expressFeeTotal,
            'minDate' => BPCalender::getNextAvailableDeliveryDate(),
            'excludeDates' => BPCalender::getExcludedDates(TRUE)
        ]);

        return view('basket/basket', $data);
    }
}
