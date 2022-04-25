<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ArtworkCheck extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $dateRequestMade;
    public $name;
    public $email;
    public $artworkLinks = [];

    public function __construct( $request )
    {
        $this->dateRequestMade = Carbon::now()->toDayDateTimeString();
        $this->name = $request['name'];
        $this->email = $request['email'];

        foreach( (array) $request['uploadedArtwork'] as $artwork ){
            $this->artworkLinks[] = s3ImgFullPathTransform( $artwork['s3Path'] );
        }
    }

    public function build()
    {
        return $this->from('info@balloonprinting.co.uk')->subject('Artwork Checking Request - '.$this->name.' - '.$this->dateRequestMade.' - BalloonPrinting.co.uk')->view('mail/artworkCheckEmail');
    }
}