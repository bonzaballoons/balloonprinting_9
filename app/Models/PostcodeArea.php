<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostcodeArea extends Model
{
    protected $table = 'postcodearea';

	public function locations()
	{
	    return $this->belongsToMany(Location::class, 'location_postcodearea', 'postcode_area_id', 'location_id');
	}
}