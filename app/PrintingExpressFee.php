<?php namespace App;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PrintingExpressFee
{
    public static function getIdFromDate($deliveryDate) : int {

        $deliveryDate = Carbon::createFromFormat('Y-m-d', $deliveryDate);

        $current = Carbon::now()->addWeekdays(1);
        if( $current->hour >= 12 ){
            $current->addWeekdays(1);
        }

        $day1 = BPCalender::checkExcludedDates($current);
        if( $deliveryDate->diffInDays($day1) <= 0 ){
            return 1;
        }

        $day2 = BPCalender::checkExcludedDates( $day1->addWeekdays(1) );
        if( $deliveryDate->diffInDays($day2) === 0 ){
            return 2;
        }

        $day3 = BPCalender::checkExcludedDates( $day2->addWeekdays(1) );
        if( $deliveryDate->diffInDays($day3) === 0 ){
            return 3;
        }

        $day4 = BPCalender::checkExcludedDates( $day3->addWeekdays(1) );
        if( $deliveryDate->diffInDays($day4) === 0 ){
            return 3;
        }

        return 5;
    }

    public static function calculateFromId($id, $totalPriceWithVat){

        $brackets = [
            1 => ['decimalMarkup' => 1.2, 'baseFee' => 30 ],
            2 => ['decimalMarkup' => 1.2, 'baseFee' => 24 ],
            3 => ['decimalMarkup' => 1.1, 'baseFee' => 12 ],
            5 => ['decimalMarkup' => 1, 'baseFee' => 0 ]
        ];

        $totalPriceWithExpressWithVat = ( $totalPriceWithVat * $brackets[$id]['decimalMarkup'] ) + $brackets[$id]['baseFee'];

        $fees['withVat'] = $totalPriceWithExpressWithVat - $totalPriceWithVat;
        $fees['withoutVat'] = round( $fees['withVat'] / ( (20/100) + 1 ), 2);

        return $fees;
    }
}