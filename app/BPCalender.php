<?php namespace App;

use App\Models\Website;
use Carbon\Carbon;

class BPCalender {

    public static function getNextAvailableDeliveryDate() : string {

        $current = Carbon::now();
        $dayOfWeek = $current->dayOfWeek;

        // Monday to Thursday, before 12 noon - add 1 day (next day)
        $nextAvailableDeliveryDate = Carbon::now()->addDays(1);

        // Monday to Wednesday, after 12 - add 2 days
        if( $dayOfWeek >= Carbon::MONDAY && $dayOfWeek <= Carbon::WEDNESDAY && $current->hour >= 12 ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(2);
        }

        // Thursday, after 12 - add 4 days (Monday delivery)
        if( $dayOfWeek === Carbon::THURSDAY && $current->hour >= 12 ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(4);
        }

        // Friday, before 12 - add 3 days (Monday delivery)
        if( $dayOfWeek === Carbon::FRIDAY && $current->hour <= 12 ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(3);
        }

        // Friday, after 12 - add 4 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::FRIDAY && $current->hour >= 12 ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(4);
        }

        // Sat, add 3 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::SATURDAY ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(3);
        }

        // Sun, add 2 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::SUNDAY ){
            $nextAvailableDeliveryDate = Carbon::now()->addDays(2);
        }

        return self::checkExcludedDates($nextAvailableDeliveryDate)->format('Y-m-d');
    }

    public static function getNeededByDateString($neededById) : string {

        $current = Carbon::now()->addWeekdays(1);
        if( $current->hour >= 12 ){
            $current->addWeekdays(1);
        }

        // Next working day
        $day1 = self::checkExcludedDates($current);
        if( $neededById === 1 ){
            // Cut off for next day is 12 noon
            return  $day1->format('D jS M');
        }

        // 2 working dates
        $day2 = self::checkExcludedDates( $day1->addWeekdays(1) );
        if( $neededById === 2 ){
            return $day2->format('D jS M');
        }

        // 3 to 4 working dates
        $day3 = self::checkExcludedDates( $day2->addWeekdays(1) );
        $day3DateString = $day3->format('D jS M');
        $day4 = self::checkExcludedDates( $day3->addWeekdays(1) );

        if( $neededById === 3 ){
            return $day3DateString.' - '. $day4->format('D jS M');
        }

        // 5 Working days
        $day5 = self::checkExcludedDates( $day4->addWeekdays(1) );
        return $day5->format('D jS M') . ' Onwards';
    }

    public static function getExcludedDates($datePicker = null) : array {

        $excludedDates = [];
        $dates = Website::find(11)->exclude_dates;

        foreach ( (array) $dates as $key => $UKDate) {
            $date = Carbon::createFromFormat('d/m/Y', $UKDate['date']);
            $excludedDates[] = $datePicker ? $date->format('Y-m-d') : $date;
        }
        return $excludedDates;
    }

    public static function checkExcludedDates(Carbon $date) : Carbon {

        $excludeDates = self::getExcludedDates();

        // If there are excluded dates, we need to check to see if the date supplied lands on one of these
        if ($excludeDates) {

            // Flag to say that the date is excluded and we should stay in the while loop until we find one that isn't

            $dateExcluded = true;
            while ($dateExcluded) {

                if ( self::isDateExcluded($date, $excludeDates) ) {
                    $date->addWeekdays(1);
                    // Run the loop again to see if new date is excluded
                    continue;
                }

                $dateExcluded = false;
            }
        }

        return $date;
    }

    private static function isDateExcluded(Carbon $date, $excludedDates) : bool {

        foreach ( (array) $excludedDates as $excludedDate){
            if($date->diffInDays($excludedDate) === 0){
                return true;
            }
        }
        return false;
    }

}