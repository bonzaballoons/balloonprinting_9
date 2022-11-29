<?php namespace App;

use App\Mail\BonzaConfirmationEmail;
use App\Mail\CustomerConfirmationEmail;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
use GoogleTagManager;

class OrderTools
{

    public static function executePostSuccessAdmin($orderId){

        $order = Order::find($orderId);
        $runAdmin = $order && !$order->email_sent;
        $basket = session('basket', false);
        $orderDetails = (array) session('orderDetails');

        // First we check to see if session data is still there, this is to prevent errors when switching from two session only method.
        // Can remove after a few weeks have passed as orders will always have had the session data saved to the order table.
        // This also allows staff to input orders on website

        if($basket){
            $basket = (array) $basket;

        }else if(!empty($order->temp_helium)){
            $savedSessionData = json_decode($order->temp_helium);
            $basket = $savedSessionData['basket'];
            $orderDetails = $savedSessionData['orderDetails'];

        }else{
            $runAdmin = false;
        }

        if( $runAdmin ){

            GoogleTagManager::set('conversionAmount', $basket['totalPrice']);
            Mail::to('info@balloonprinting.co.uk')->send( new BonzaConfirmationEmail($basket, $orderDetails, $orderId) );
            Mail::to($orderDetails['customerContactEmail'])->send( new CustomerConfirmationEmail($orderId) );
            $order->email_sent = 1;
            $order->save();
        }
    }

}
