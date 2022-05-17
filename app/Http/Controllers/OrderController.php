<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Website;
use App\Models\Order;
use GoogleTagManager;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use App\Mail\BonzaConfirmationEmail;

class OrderController extends Controller
{
    public function details(Request $request) {

        $data['title'] = 'Order Details - Balloon Printing UK';
        $data['meta_keywords'] = 'order, details, address, delivery, postage';
        $data['meta_description'] = 'Add The Details Before Placing The Order';

        $basket = session('basket');

        $data['hasBonzaProducts'] = $basket->hasBonzaProducts;
        $data['hasHireCollect'] = $basket->hasHireCollect;
        $data['hasHireDelivery'] = $basket->hasHireDelivery;

        \JavaScript::put([
            'basketDetails' => get_object_vars( session('basket') ),
            'heliumSupplier' => session('heliumSupplier', false),
            'orderDetails' => get_object_vars( session('orderDetails') )
        ]);

        $data['terms'] = Website::find(env('WEBSITE_ID'))->terms;
        $data['page_js'] = ['orderDetails'];

        return view('order/details', $data);
    }

    public function overview()
    {
        $data['title'] = 'Order Overview - Balloon Printing UK';
        $data['meta_keywords'] = 'order, overview, review';
        $data['meta_description'] = 'Review The Details Before Placing The Order';

        $basket = session('basket');
        $orderDetails = session('orderDetails');
        $orderId = Order::addOrder($basket, $orderDetails);
        session(['orderId' => $orderId]);

        Stripe::setApiKey( env('STRIPE_SECRET_KEY') );

        $lineItems = [];


        foreach($basket->heliumHireCollections as $product){
            $lineItems[] = [
                'name' => $product->productName,
                'amount' => round($product->totalPriceWithVat / $product->quantity, 2) * 100,
                'currency' => 'gbp',
                'quantity' => $product->quantity
            ];
        }

        foreach($basket->heliumHireDeliveries as $product){
            $lineItems[] = [
                'name' => $product->productName,
                'amount' => round($product->totalPriceWithVat / $product->quantity, 2) * 100,
                'currency' => 'gbp',
                'quantity' => $product->quantity
            ];
        }

        foreach($basket->bonzaProducts as $product){
            $lineItems[] = [
                'name' => $product->productName,
                'amount' => round($product->totalPriceWithVat / $product->quantity, 2) * 100,
                'currency' => 'gbp',
                'quantity' => $product->quantity
            ];
        }

        $printProducts = $basket->printedLatexFromWizard + $basket->printedLatexGiantFromWizard + $basket->printedFoilFromWizard;

        foreach($printProducts as $product){
            $lineItems[] = [
                'name' => $product->productName,
                'amount' => round($product->unitPriceWithVat, 2) * 100,
                'currency' => 'gbp',
                'quantity' => $product->quantity
            ];
        }

        foreach($basket->expressFees as $expressFee){

            if( $expressFee['fee'] > 0){
                $lineItems[] = [
                    'name' => 'Express Fee for '.$expressFee['name'],
                    'amount' => round($expressFee['fee'], 2) * 100,
                    'currency' => 'gbp',
                    'quantity' => 1
                ];
            }
        }

        if($basket->totalPostageWeightPrice > 0){
            $lineItems[] = [
                'name' => $basket->postageWeightName,
                'amount' => round($basket->totalPostageWeightPrice, 2) * 100,
                'currency' => 'gbp',
                'quantity' => 1
            ];
        }

        $session = \Stripe\Checkout\Session::create([
            'client_reference_id' => $orderId,
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'success_url' => url('order/success'),
            'cancel_url' => url('order/cancelled'),
        ]);

        \JavaScript::put([
            'checkoutSessionID' => $session->id,
            'stripePubKey' => env('STRIPE_PUB_KEY')
        ]);

        $data['loadStripe'] = true;
        $data['basket'] = $basket;
        $data['orderDetails'] = $orderDetails;
        $data['page_js'] = ['orderOverview'];

        return view('order/overview', $data);
    }

    public function success(Request $request)
    {
        $data['title'] = 'Order Success - Balloon Printing UK';
        $data['meta_keywords'] = 'success, order';
        $data['meta_description'] = 'Balloon Printing Order Success';
        $data['orderId'] = session('orderId', false);

        if( ! Order::adminBeenDone($data['orderId']) ){
            $basket = session('basket');
            GoogleTagManager::set('conversionAmount', $basket->totalPrice);
            Mail::to('info@customballoons.co.uk')->send( new BonzaConfirmationEmail( (array) $basket, (array) session('orderDetails'), $data['orderId'] ) );
            $request->session()->forget('basket');

            $order = Order::find($data['orderId']);
            $order->email_sent = 1;
            $order->save();
        }

        return view('order/success', $data);
    }

    public function cancelled(Request $request)
    {
        $data['title'] = 'Order Failure - Balloon Printing UK';
        $data['meta_keywords'] = 'failure, order';
        $data['meta_description'] = 'There has been a problem processing your balloon printing order';

        // Todo - do we send an email to sales / solve to do a follow up
        // Todo - Link for customer to do it again.

        return view('order/cancelled', $data);
    }
}
