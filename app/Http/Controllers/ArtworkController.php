<?php namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ArtworkController extends Controller
{
    public function store(Request $request) : array
    {
        return [ 'path' =>  $request->file()['file']->store('artwork', 's3') ];
    }
}

