<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostageWeightItem extends Model
{
    protected $table = 'postageweightitem';

	public function postageWeight()
	{
		return $this->belongsTo(PostageWeight::class, 'postageweight_id');
	}
}