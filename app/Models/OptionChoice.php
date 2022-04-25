<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OptionChoice extends Model
{
    protected $table = 'optionchoice';
    public $timestamps = false;

	public function products()
	{
    	return $this->belongsToMany(Product::class, 'product_optionchoice', 'optionchoice_id', 'product_id');
    }

    public function items()
    {
    	return $this->hasMany(OptionChoiceItem::class, 'optionchoice_id');
    }
}