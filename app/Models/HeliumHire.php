<?php namespace App\Models;

use Illuminate\Database\Eloquent\Builder;

class HeliumHire extends Product
{
    protected static function boot() :void
    {
        parent::boot();

        static::addGlobalScope('types', function (Builder $builder) {
            $builder->whereHas('types', function($q){
                $q->where('id', 12);
            });
        });
    }

    private static $balloonsCanFill = [ 250, 310, 500, 620, 935, 1250 ];
    private static $miniDescriptions = [
        'Our most popular option! Perfect for home use, party occasions and small events, our light, easy to use hire cylinder offers great value for money.',
        'A great choice for small events, this fantastic lightweight cylinder is so easy to use and perfect if you need to transport it to your venue.',
        'An ideal choice for medium sized events and special occasions, this hired helium cylinder gives real value for money for that important event',
        'The perfect choice if you want to inflate large numbers of balloons, this lightweight and easy to use cylinder is great for decorating venues and taking to events.',
        'A great value option for corporate events or promotions, this cylinder will make inflating large numbers of balloons a doddle!',
        'A huge cylinder giving the most cost effective price per balloon solution, ideal for large scale corporate, promotional events & in retail outlets.'
    ];

    public static function get(){

        $cylinders = self::select('id', 'name', 'delivery_price', 'ap_collect_price', 'boc_collect_price', 'unit_price')
            ->join('productdetails', 'product.id', '=', 'productdetails.product_id')
            ->where('productdetails.website_id', env('WEBSITE_ID'))
            ->orderBy('productdetails.delivery_price')
            ->get();

        return $cylinders->map(function ($cylinder, $key) {

            $cylinder->balloonsCanFill = self::$balloonsCanFill[$key];
            $cylinder->miniDescription = self::$miniDescriptions[$key];

            // If the cylinder has two prices, select the lowest
            if( $cylinder->ap_collect_price !== NULL && $cylinder->boc_collect_price !== NULL ){
                $cylinder->lowestCollectPrice = min( [$cylinder->ap_collect_price, $cylinder->boc_collect_price] );
            }else {
                $cylinder->lowestCollectPrice = $cylinder->ap_collect_price ?? $cylinder->boc_collect_price;
            }

            return $cylinder;
        });
    }
}