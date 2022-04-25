<?php namespace App;

use Illuminate\Support\Facades\DB;

class OrderTools
{

    // Todo - throw exception here if doesn't update
    public static function updateOrderInfo($orderId, $crypt_values) : bool {

        $data = ['total_cost' => $crypt_values['Amount'] ];
        $data['payment_status_id'] = $crypt_values['Status'] === 'OK' ? 4 : 1;

        return (bool) DB::table('orders')->where('id', $orderId)->update($data);
    }

    // Example structure of vendor text code - brandName_orderID_randomKey
    public static function getOrderIdFromVendorTxCode($vendorTxCode){

        $txCode = explode('_', $vendorTxCode);
        return $txCode[1];
    }

    // Todo - make phone number dynamic
    public static function createErrorReasonSentence($status, $orderId) : string {

        if ($status === 'NOTAUTHED') {
            return 'You payment was declined by the bank. This could be due to insufficient funds, or incorrect card details. To avoid adding all your order details again, please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
        }

        if ($status === 'ABORT') {
            return 'You canceled your order on the payment page.  To avoid adding all your order details again, or if you wish to change your order and resubmit it, or you have any other questions or concerns about ordering online please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
        }

        if ($status === 'REJECTED') {
            return 'Your order did not meet our minimum fraud screening requirements. If you have questions about our fraud screening rules, or wish to contact us to discuss this, please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
        }

        if ($status === 'INVALID' ||  $status === 'MALFORMED') {
            return 'We could not process your order because we have been unable to register your transaction with our Payment Gateway. You can place the order over the telephone instead.  To avoid adding all your order details again, please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
        }

        if ($status === 'ERROR') {
            return 'We could not process your order because our Payment Gateway service was experiencing difficulties. You can place the order over the telephone instead. To avoid adding all your order details again, please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
        }

        return 'The transaction process failed. Please contact us with the date and time of your order and we will investigate. To avoid adding all your order details again, please give us a call on '.env('SITE_PHONE_NUMBER')." and quote reference: BP$orderId.";
    }

}