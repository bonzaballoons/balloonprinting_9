<?php namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderDetailsController extends Controller
{
    public function storeOrderDetails(Request $request) : array {

        session('orderDetails')->addDetails( $request->input('orderDetails') );
        return ['success' => true];
    }

}