<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CustomerConfirmationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $orderId;

    public function __construct($orderId)
    {
        $this->orderId = $orderId;
    }

    public function build()
    {
        return $this->from('info@balloonprinting.co.uk')->subject('Order Confirmation ID: '.$this->orderId.' - BalloonPrinting.co.uk')->view('mail/customerConfirmationEmail');
    }
}
