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
        return $this->from('info@balloonprinting.co.uk')->subject('NEW ORDER - ID:'.$this->orderId.' - '.$this->orderDetails['customerContactFullName'].' - BalloonPrinting.co.uk')->view('mail/bonzaConfirmationEmail');
    }
}
