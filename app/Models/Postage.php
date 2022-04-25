<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Postage extends Model
{
    protected $table = 'postage';

	public function packages()
	{
	    return $this->hasMany(Package::class, 'delivery_option_id');
	}

	public function website()
	{
	    return $this->belongsTo(Website::class, 'website_id');
	}
}