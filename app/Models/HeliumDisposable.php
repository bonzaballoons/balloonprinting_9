<?php namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class HeliumDisposable extends Product
{

    private static $miniDescription = [
        'Ideal for small parties and events at home, this convenient, light & easy to use recyclable helium cylinder is our best value option',
        'Perfect for smaller events and occasions, this convenient, light & easy to use recyclable helium cylinder is a great value option.',
        'Perfect for smaller events and occasions, this convenient, light & easy to use recyclable helium cylinder is a great value option.',
        'Great if you don\'t want to hire a cylinder, this package gives you the option to inflate a good quantity of balloons for small to medium events and parties.',
        'Convenient and cost effective, this combo enables you to inflate balloons for medium sized events or promotions.',
        'If you need a practical, efficient and simple way to inflate balloons for your medium sized event, this package is spot on.',
        'Great for taking to venues, this package offers a convenient way to inflate a large number of balloons on the go.',
        'A fantastic solution for large or multiple events that need the flexibility of several small lightweight cylinders.'
    ];

    private static $cubicMeters = ['0.25m3', '0.35m3', '0.5m3', '0.7m3', '1.2m3', '1.4m3', '1.75m3', '2.1m3'];
    private static $weightPerCylinder = ['4kg', '4.5kg', '4kg', '4.5kg', '4.5kg', '4.5kg', '4.5kg', '4.5kg'];
    private static $heightPerCylinder = '45cm';
    private static $diameterPerCylinder = '31cm';
    private static $canFill9InchBalloons = ['30', '50', '60', '100', '160', '200', '250', '300'];
    private static $canFill10InchBalloons = ['23', '40',	'46', '80',	'126', '160', '200','240'];
    private static $canFill11InchBalloons = ['16', '30',	'32', '60',	'90', '120', '150',	'180'];
    private static $canFill12InchBalloons = ['15', '25', '30', '50',	'80', '100', '125',	'150'];
    private static $canFill16InchBalloons = ['6', '9', '12', '18', '30', '36', '43', '54'];
    private static $canFill18InchBalloons = ['15', '25', '30', '50', '80', '100', '125', '150'];


    protected static function boot() : void
    {
        parent::boot();

        static::addGlobalScope('types', function (Builder $builder) {
            $builder->whereHas('types', function($q){
                $q->where('id', 14);
            });
        });
    }

    public static function get(){

        $cylinders = self::select('id', 'name', 'unit_price')
            ->join('productdetails as pd', 'product.id', '=', 'pd.product_id')
            ->where('pd.website_id', env('WEBSITE_ID'))
            ->orderBy('pd.unit_price')
            ->get();

        return $cylinders->map(function ($cylinder, $key) {

            $cylinder['miniDescription'] = self::$miniDescription[$key];
            $cylinder['cubicMeters'] = self::$cubicMeters[$key];
            $cylinder['weightPerCylinder'] = self::$weightPerCylinder[$key];
            $cylinder['heightPerCylinder'] = self::$heightPerCylinder;
            $cylinder['diameterPerCylinder'] = self::$diameterPerCylinder;
            $cylinder['canFill9InchBalloons'] = self::$canFill9InchBalloons[$key];
            $cylinder['canFill10InchBalloons'] = self::$canFill10InchBalloons[$key];
            $cylinder['canFill11InchBalloons'] = self::$canFill11InchBalloons[$key];
            $cylinder['canFill12InchBalloons'] = self::$canFill12InchBalloons[$key];
            $cylinder['canFill16InchBalloons'] = self::$canFill16InchBalloons[$key];
            $cylinder['canFill18InchBalloons'] = self::$canFill18InchBalloons[$key];

            return $cylinder;
        });

    }
}