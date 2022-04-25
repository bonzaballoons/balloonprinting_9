<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostageWeight extends Model
{
    protected $table = 'postageweight';

	public function postageWeightItems()
	{
		return $this->hasMany(PostageWeightItem::class, 'postageweight_id');
	}

    public static function getPrice($weightID, $weightGrams) : array {

        $weight = self::with('postageWeightItems')->find($weightID)->toArray();

        $weight['price'] = self::getPriceFromBrackets($weight['postage_weight_items'], $weightGrams);

        return $weight;
    }

    public static function getPrices($weightGrams){

        if($weightGrams === 0){
            return false;
        }

        $postageWeights = self::whereIn('id', [9,5])->with('postageWeightItems')->orderByRaw('FIELD(id,9,5)')->get()->toArray();

        foreach($postageWeights as $key => $weight){
            $postageWeights[$key]['price'] = self::getPriceFromBrackets($weight['postage_weight_items'], $weightGrams);
        }

        return collect($postageWeights)->values()->all();
    }

    private static function getPriceFromBrackets(array $weightBrackets, $weightGrams){

        //check to see if the weight is above the last bracket. If it is we work out a pro rata price
        $lastBracket = last($weightBrackets);
        if($weightGrams > $lastBracket['unit_roof']){
            // we work out the pro-rata price per gram
            $price = ( $lastBracket['price'] / $lastBracket['unit_roof'] ) * $weightGrams;
            return number_format( (float) $price, 2, '.', '');
        }

        //loop through brackets to see which price we need
        foreach($weightBrackets as $bracket){
            if($weightGrams <= $bracket['unit_roof']){
                return number_format( (float) $bracket['price'], 2, '.', '');
            }
        }
    }
}