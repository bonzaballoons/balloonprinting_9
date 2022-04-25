<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ArtworkController extends Controller
{
    public function store(Request $request) : array
    {
        Log::info($request->file());


        return [ 'path' =>  $request->file()['file']->store('artwork', 's3') ];
    }


}
