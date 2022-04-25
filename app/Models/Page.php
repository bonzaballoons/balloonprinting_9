<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $table = 'page';

	public function website()
	{
	    return $this->belongsTo(Website::class, 'website_id');
	}

    public function tags()
    {
        return $this->hasMany(Tag::class, 'page_id');
    }
}