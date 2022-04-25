<?php namespace App;

use App\Models\Website;
use Carbon\Carbon;

//TODO need to get times for separate cylinders AP and BOC have different cut off points

class BHCalender {

    public static function getStartEndDates() {

        $current = Carbon::now();

        $dayOfWeek = $current->dayOfWeek;

        $hireDeliveryStart = self::getHireDeliveryStart($current, $dayOfWeek);
        $hireCollectStart = self::getHireCollectionStart($current, $dayOfWeek);

        $return['hireDeliveryStartDisplay'] = $hireDeliveryStart->format(' dS F Y');
        $return['hireDeliveryStartDatePicker'] = $hireDeliveryStart->format('Y-m-d');
        $return['hireCollectStartDisplay'] = $hireCollectStart->format(' dS F Y');
        $return['hireCollectStartDatePicker'] = $hireCollectStart->format('Y-m-d');

        $hireDeliveryReturn = self::getHireReturn( $hireDeliveryStart );
        $hireCollectReturn = self::getHireReturn( $hireCollectStart );

        $return['hireDeliveryReturnDisplay'] = $hireDeliveryReturn->format(' dS F Y');
        $return['hireDeliveryReturnDatePicker'] = $hireDeliveryReturn->format('Y-m-d');
        $return['hireCollectReturnDisplay'] = $hireCollectReturn->format(' dS F Y');
        $return['hireCollectReturnDatePicker'] = $hireCollectReturn->format('Y-m-d');

        $return['excludeDates'] = self::getExcludedDates($datePicker = true);

        return $return;
    }

    private static function getHireDeliveryStart($current, $dayOfWeek) : Carbon {

        // Monday to Thursday, before 3pm - add 1 day (next day)
        $hireDeliveryStart = Carbon::now()->addDays(1);

        // Monday to Wednesday, after 3pm - add 2 days
        if( $dayOfWeek >= Carbon::MONDAY && $dayOfWeek <= Carbon::WEDNESDAY && $current->hour > 15 ){
            $hireDeliveryStart = Carbon::now()->addDays(2);
        }

        // Thursday, after 3pm - add 4 days (Monday delivery)
        if( $dayOfWeek === Carbon::THURSDAY && $current->hour > 15 ){
            $hireDeliveryStart = Carbon::now()->addDays(4);
        }

        // Friday, before 3pm - add 3 days (Monday delivery)
        if( $dayOfWeek === Carbon::FRIDAY && $current->hour <= 15 ){
            $hireDeliveryStart = Carbon::now()->addDays(3);
        }

        // Friday, after 3pm - add 4 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::FRIDAY && $current->hour > 15 ){
            $hireDeliveryStart = Carbon::now()->addDays(4);
        }

        // Sat, add 3 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::SATURDAY ){
            $hireDeliveryStart = Carbon::now()->addDays(3);
        }

        // Sun, add 2 days (Tuesday delivery)
        if( $dayOfWeek === Carbon::SUNDAY ){
            $hireDeliveryStart = Carbon::now()->addDays(2);
        }

        return self::checkExcludedDates($hireDeliveryStart, 'plus');
    }

    private static function getHireCollectionStart($current, $dayOfWeek) : Carbon {

        // Default - Monday to Friday before 3pm = same day
        $hireCollectionStart = Carbon::now();

        // Monday to Thursday after 1pm - add 1 day = next day
        if( $dayOfWeek >= Carbon::MONDAY && $dayOfWeek <= Carbon::THURSDAY && $current->hour > 15 ){
            $hireCollectionStart = Carbon::now()->addDays(1);
        }

        // Friday after 3pm - add 3 days = Monday collection
        if( $dayOfWeek === Carbon::FRIDAY && $current->hour > 15 ){
            $hireCollectionStart = Carbon::now()->addDays(3);
        }

        // Sat add 2 days = Monday collection
        if( $dayOfWeek === Carbon::SATURDAY ){
            $hireCollectionStart = Carbon::now()->addDays(2);
        }

        // Sun add 1 day = Monday collection
        if( $dayOfWeek === Carbon::SUNDAY ){
            $hireCollectionStart = Carbon::now()->addDays(1);
        }

        return self::checkExcludedDates($hireCollectionStart, 'plus');
    }

    private static function getHireReturn(Carbon $startDate) : Carbon {

        // Customer gets 28 days hire including day of delivery / collection, so we add 27 days to start day.
        $returnDate = $startDate->addDays(27);

        // We can't deliver on a weekend, so we check for this we and reduce days as necessary
        $returnDate = self::checkIfWeekend($returnDate, 'minus');

        // Check to see if the date lands on a day excluded manually by a member of staff.  Usually Holidays
        return self::checkExcludedDates($returnDate, 'minus');
    }

    // Checks if datetime is on weekend and returns the nearest weekday based on plus or minus days flag
    private static function checkIfWeekend(Carbon $date, $minusOrPlusDays) : Carbon {

        if ($date->dayOfWeek === Carbon::SATURDAY) {
            if($minusOrPlusDays === 'plus'){
                $date->addDays(2);
            }else{ // minus
                $date->subDays(1);
            }
        }
        else if ($date->dayOfWeek === Carbon::SUNDAY) {
            if($minusOrPlusDays === 'plus'){
                $date->addDays(1);
            }else{ // minus
                $date->subDays(2);
            }
        }
        return $date;
    }

    // Check to see if date is excluded for selection for the current website profile.
    // If it is, we plus or minus days until we find one that isn't excluded.
    private static function checkExcludedDates(Carbon $date, $minusOrPlusDays) : Carbon {

        $excludeDates = self::getExcludedDates();

        // If there are excluded dates, we need to check to see if the date supplied lands on one of these
        if ($excludeDates) {

            // Flag to say that the date is excluded and we should stay in the while loop until we find one that isn't
            $dateExcluded = true;

            while ($dateExcluded) {

                if ( self::isDateExcluded($date, $excludeDates) ) {

                    if($minusOrPlusDays === 'plus'){
                        $date->addDay(1);
                    }else{ // minus
                        $date->subDays(1);
                    }

                    $date = self::checkIfWeekend($date, $minusOrPlusDays);

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

    // Todo - Need a separate calender in the CMS for delivery and collection
    public static function getExcludedDates($datePicker = null) : array {

        $excludedDates = [];
        $dates = Website::find(11)->exclude_dates;

        foreach ( (array) $dates as $key => $UKDate) {
            $excludedDates[] = $datePicker ? Carbon::createFromFormat('d/m/Y', $UKDate['date'])->format('Y-m-d') : Carbon::createFromFormat('d/m/Y', $UKDate['date']);
        }

        return $excludedDates;
    }
}