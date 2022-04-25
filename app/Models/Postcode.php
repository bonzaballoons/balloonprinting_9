<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Postcode extends Model
{
    protected $table = 'postcode';

	public function locations()
	{
		return $this->belongsToMany(Location::class, 'location_postcode', 'postcode_id', 'location_id');
	}
}