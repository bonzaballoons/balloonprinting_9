<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class BonzaConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $basket;
    public $orderDetails;
    public $orderId;

    public function __construct($basket, $orderDetails, $orderId)
    {
        $this->basket = $basket;
        $this->orderDetails = $orderDetails;
        $this->orderId = $orderId;
    }

    public function build()
    {
        $customerName = $this->orderDetails['customerBillingFirstName'] .' '. $this->orderDetails['customerBillingSecondName'];
        return $this->from('info@balloonprinting.co.uk')->subject('Order Confirmation ID: '.$this->orderId.' - '.$customerName.' - BalloonPrinting.co.uk')->view('mail/bonzaConfirmationEmail');
    }
}
