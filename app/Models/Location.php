<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'location';

	public function postcodes()
	{
	    return $this->belongsToMany(__CLASS__, 'location_postcode', 'location_id', 'postcode_id');
	}

	public function postcodeAreas()
	{
	    return $this->belongsToMany(PostcodeArea::class, 'location_postcodearea', 'location_id', 'postcode_area_id');
	}


}
