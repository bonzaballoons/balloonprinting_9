<?php namespace App;

class PrintingPrices
{
    public static function giantLatex($data) : array {

        $pricePerBalloon = self::getGiantLatexPricePerBalloon($data);
        $totalBalloonPrice = $pricePerBalloon * $data['numberBalloons'];
        $totalScreenPrice = 40 * $data['sides'];

        $totalPriceWithoutVat = $totalBalloonPrice + $totalScreenPrice;
        $totalPriceWithVat = $totalPriceWithoutVat * 1.2;
        $pricePerBalloon = $totalPriceWithVat / $data['numberBalloons'];

        return [
            'totalPriceWithoutVat' => (float) $totalPriceWithoutVat,
            'totalPriceWithVat' => $totalPriceWithVat,
            'pricePerBalloon' => (float) $pricePerBalloon
        ];
    }

    public static function latex($data) : array {

        $priceJobCharge = $data['numberColours'] > 1 ? $data['numberColours'] * 3: 0;
        $pricePerBalloon = self::getLatexPricePerBalloon($data);
        $pricePerScreen = 40;
        $pricePerInkChange = 20;

        $totalBalloonPrice = $pricePerBalloon * $data['numberBalloons'];
        $totalScreenPrice = $data['sides'] === 2 ? $pricePerScreen * 2 : $pricePerScreen * $data['numberColours']; // If 2 sides, you can only have one colour with 2 screens
        $totalInkChanges =  $pricePerInkChange * ($data['numberInkSwitches'] * $data['sides']);

        $totalInkColourPrice = self::inkColourPriceWithoutVat( $data['inkColourNames'] );

        $totalPriceWithoutVat = $priceJobCharge + $totalBalloonPrice + $totalScreenPrice + $totalInkChanges + $totalInkColourPrice;

        $expressFeesAndDates = self::getExpressFeesAndDates( $totalPriceWithoutVat );

        $totalPriceWithVat = $totalPriceWithoutVat * 1.2;
        $pricePerBalloon = $totalPriceWithVat / $data['numberBalloons'];

        return [
            'expressFeesAndDates' => $expressFeesAndDates,
            'totalPriceWithoutVat' => (float) $totalPriceWithoutVat,
            'totalPriceWithVat' => $totalPriceWithVat,
            'pricePerBalloon' => (float) $pricePerBalloon
        ];
    }

    public static function foil($data) : array {

        $pricePerInkChange = 20;
        $totalInkChanges =  $pricePerInkChange * $data['numberInkSwitches'];
        $screenPrice = self::getFoilScreenPrice( $data['sides'], $data['numberColours'], $data['sideDesignType'] );
        $totalBalloonPrice = self::getFoilPricePerBalloon($data) * $data['numberBalloons'];

        $totalPriceWithoutVat =  $totalBalloonPrice + $screenPrice + $totalInkChanges;

        $totalPriceWithVat = $totalPriceWithoutVat * 1.2;
        $pricePerBalloon = $totalPriceWithVat / $data['numberBalloons'];

        return [
            'totalPriceWithoutVat' => (float) $totalPriceWithoutVat,
            'totalPriceWithVat' => $totalPriceWithVat,
            'pricePerBalloon' => (float) $pricePerBalloon
        ];
    }

    private static function getFoilScreenPrice($sides, $numberColours, $sideDesignType){

        if( $sides === 1 ){
            return 40 * $numberColours;
        }
        return $sideDesignType === 'same' ? 40 : 80;
    }

    private static function getFoilPricePerBalloon($data) : float {

        $circleHeart = [
            '1c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 1.50],
                ['min' => 25, 'max'=> 49, 'ppb'=> 1.25],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.10],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.00],
                ['min' => 250, 'max'=> 499, 'ppb'=> 0.95],
                ['min' => 500, 'max'=> 999, 'ppb'=> 0.85],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 0.85]
            ],
            '1c2sSame' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.50],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.00],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.75],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.65],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.60],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.50],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.40]
            ],
            '1c2sDifferent' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.50],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.00],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.75],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.65],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.60],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.50],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.40]
            ],
            '2c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.00],
                ['min' => 25, 'max'=> 49, 'ppb'=> 1.75],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.40],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.30],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.25],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.20],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.10]
            ],
            '3c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.45],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.20],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.70],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.65],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.60],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.50],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.40]
            ],
            '4c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.75],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.50],
                ['min' => 50, 'max'=> 99, 'ppb'=> 2.10],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.95],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.90],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.80],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.65]
            ]
        ];
        $star = [
            '1c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 1.60],
                ['min' => 25, 'max'=> 49, 'ppb'=> 1.35],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.20],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.10],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.05],
                ['min' => 500, 'max'=> 999, 'ppb'=> 0.95],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 0.95]
            ],
            '1c2sSame' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.60],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.10],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.85],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.75],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.70],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.60],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.50]
            ],
            '1c2sDifferent' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.60],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.10],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.85],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.75],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.70],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.60],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.50]
            ],
            '2c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.10],
                ['min' => 25, 'max'=> 49, 'ppb'=> 1.85],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.50],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.40],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.35],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.30],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.20]
            ],
            '3c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.55],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.30],
                ['min' => 50, 'max'=> 99, 'ppb'=> 1.80],
                ['min' => 100, 'max'=> 249, 'ppb'=> 1.75],
                ['min' => 250, 'max'=> 499, 'ppb'=> 1.70],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.60],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.50]
            ],
            '4c1s' => [
                ['min' => 1, 'max'=> 24, 'ppb'=> 2.85],
                ['min' => 25, 'max'=> 49, 'ppb'=> 2.60],
                ['min' => 50, 'max'=> 99, 'ppb'=> 2.20],
                ['min' => 100, 'max'=> 249, 'ppb'=> 2.05],
                ['min' => 250, 'max'=> 499, 'ppb'=> 2.00],
                ['min' => 500, 'max'=> 999, 'ppb'=> 1.90],
                ['min' => 1000, 'max'=> 1000000, 'ppb'=> 1.75]
            ]
        ];

        $bracketIndex = $data['numberColours'].'c'.$data['sides'].'s';
        if($data['sides'] === 2){
            $bracketIndex .= $data['sideDesignType'] === 'same' ? 'Same' : 'Different';
        }
        $shapeBracket = $data['shapeSelected'] === 'stars' ? $star : $circleHeart;

        $pricePerBalloon = 0;
        foreach( (array) $shapeBracket[$bracketIndex] as $bracket){
            if( self::testRange($data['numberBalloons'], $bracket['min'], $bracket['max']) ){
                $pricePerBalloon = $bracket['ppb'];
                break;
            }
        }
        return $pricePerBalloon;
    }

    private static function inkColourPriceWithoutVat(array $inkColourNames){

        $freeBracket = ['White', 'Black'];
        $threePoundBracket = ['Red', 'Dark Blue', 'Blue', 'Orange', 'Yellow', 'Green', 'Purple'];
        $sixPoundBracket = ['Gold', 'Silver'];

        $totalPrice = 0;

        foreach ($inkColourNames as $inkColourName){

            $inkColourName = ucwords( strtolower($inkColourName) );

            if ( \in_array( $inkColourName, $freeBracket, TRUE ) ){
                $totalPrice += 0;
            }
            elseif ( \in_array( $inkColourName, $threePoundBracket, TRUE ) ){
                $totalPrice += 2.5;
            }
            elseif ( \in_array( $inkColourName, $sixPoundBracket, TRUE ) ){
                $totalPrice += 5;
            }
            else{
                $totalPrice += 7.5;
            }
        }
        return $totalPrice;
    }

    private static function getExpressFeesAndDates($totalPriceWithoutVat) : array {

        $feeAndDates = [];

        // next working day - Â£25 & 20%
        $totalPriceIncludingFeeWithoutVat = ( $totalPriceWithoutVat * 1.2 ) + 25;
        $feeAndDates[1]['expressFeeWithoutVat'] = $totalPriceIncludingFeeWithoutVat - $totalPriceWithoutVat;
        $feeAndDates[1]['expressFeeWithVat'] = $feeAndDates[1]['expressFeeWithoutVat'] * 1.2;
        $feeAndDates[1]['dateString'] = BPCalender::getNeededByDateString(1);

        // 2 working days - Â£20 & 20%
        $totalPriceIncludingFeeWithoutVat = ( $totalPriceWithoutVat * 1.2 ) + 20;
        $feeAndDates[2]['expressFeeWithoutVat'] = $totalPriceIncludingFeeWithoutVat - $totalPriceWithoutVat;
        $feeAndDates[2]['expressFeeWithVat'] = $feeAndDates[2]['expressFeeWithoutVat'] * 1.2;
        $feeAndDates[2]['dateString'] = BPCalender::getNeededByDateString(2);

        // 3 To 4 Working Days - Â£10 & 10%
        $totalPriceIncludingFeeWithoutVat = ( $totalPriceWithoutVat * 1.10 ) + 10;
        $feeAndDates[3]['expressFeeWithoutVat'] = $totalPriceIncludingFeeWithoutVat - $totalPriceWithoutVat;
        $feeAndDates[3]['expressFeeWithVat'] = $feeAndDates[3]['expressFeeWithoutVat'] * 1.2;
        $feeAndDates[3]['dateString'] = BPCalender::getNeededByDateString(3);

        // 5 Working Days & Beyond - Free
        $feeAndDates[5]['expressFeeWithoutVat'] = 0;
        $feeAndDates[5]['dateString'] = BPCalender::getNeededByDateString(5);

        return $feeAndDates;
    }

    private static function getLatexPricePerBalloon($data) : float {

        // Defaults to 12" Pastel/Standard, 12" Crystal/Transparent & 10" Metallic/Pearl - 9p per balloon
        $price = 0.09;

        // 10" Pastel/Standard or 10" Crystal/Transparent - 8p per balloon
        if( $data['typeSelectedId'] === 1 || $data['typeSelectedId'] === 5 ){
            $price = 0.08;
        }

        // 12" Metallic / Pearl Latex - 10p per balloon
        if( $data['typeSelectedId'] === 4){
            $price = 0.10;
        }
        return $price;
    }

    private static function getGiantLatexPricePerBalloon($data) : float {

        if( $data['typeSelectedName'] === 'Pastel' ){

            if( $data['size'] === 2 ){
                return $data['sides'] === 1 ? 9 : 13.5;
            }
            // 3ft
            return $data['sides'] === 1 ? 10 : 15;
        }

        if( $data['typeSelectedName'] === 'Metallic' ){

            if( $data['size'] === 2 ){
                return $data['sides'] === 1 ? 10 : 15;
            }
            // 3ft
            return $data['sides'] === 1 ? 11 : 16.5;
        }
    }

    private static function testRange($num, $min, $max) : bool{
        return ( $num >= $min && $num <= $max);
    }
}
