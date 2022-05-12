<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Http\Request;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Carbon;

class ContactUs extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $phone;
    public $email;
    public $c_message;

    public function __construct(Request $request)
    {
        $this->name = $request->input('customer_name');
        $this->phone = $request->input('customer_phone');
        $this->email = $request->input('customer_email');
        $this->c_message = $request->input('customer_message');
    }

    public function build()
    {
        return $this->from('info@balloonprinting.co.uk', 'BALLOON PRINTING UK')->subject('Quote / Contact Us From '. $this->name .' at '. Carbon::now()->toDayDateTimeString() .' - BalloonPrinting.co.uk')->view('mail/contactEmail');
    }
}
