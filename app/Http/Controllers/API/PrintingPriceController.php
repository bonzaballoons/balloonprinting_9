<?php

namespace App\Http\Controllers\API;
use App\PrintingPrices;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;

class PrintingPriceController extends Controller
{

    public function giantLatex(Request $request) : array {

        $data['numberBalloons'] = (integer) $request->input('numberBalloons');
        $data['sides'] = (integer) $request->input('sides');
        $data['size'] = (integer) $request->input('size');
        $data['typeSelectedName'] = $request->input('typeSelectedName');

        return PrintingPrices::giantLatex($data);
    }

    public function latex(Request $request) : array {

        $data['numberBalloons'] = (integer) $request->input('numberBalloons');
        $data['numberColours'] = (integer) $request->input('numberColours');
        $data['numberInkSwitches'] = (integer) $request->input('numberInkSwitches');
        $data['sides'] = (integer) $request->input('sides');
        $data['inkColourNames'] = $request->has('inkColourNames') ? explode(',', $request->input('inkColourNames') ) : [];
        $data['size'] = (integer) $request->input('size');
        $data['typeSelectedId'] = (integer) $request->input('typeSelectedId');

        return PrintingPrices::latex($data);
    }

    public function foil(Request $request) : array {

        $data['numberBalloons'] = (integer) $request->input('numberBalloons');
        $data['numberColours'] = (integer) $request->input('numberColours');
        $data['numberInkSwitches'] = (integer) $request->input('numberInkSwitches');
        $data['sides'] = (integer) $request->input('sides');
        $data['shapeSelected'] = $request->input('shapeSelected');
        $data['sideDesignType'] = $request->input('sideDesignType');

        return PrintingPrices::foil($data);
    }

}