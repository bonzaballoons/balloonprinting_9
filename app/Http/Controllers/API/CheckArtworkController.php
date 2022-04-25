<?php namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\ArtworkCheck;

class CheckArtworkController extends Controller
{

    public function send(Request $request) : array {

        Mail::to('info@balloonprinting.co.uk')->send( new ArtworkCheck($request) );

        return [true];
    }
}