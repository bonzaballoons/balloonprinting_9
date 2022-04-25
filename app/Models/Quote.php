<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = 'quote';
    protected $guarded = ['id'];
    protected $hidden = ['pivot'];

    // Relationships
    public function buyer()
    {
        return $this->belongsTo('App\Models\Buyer', 'buyer_id');
    }

	public function website()
	{
	    return $this->belongsTo('App\Models\Website', 'website_id');
	}

    public function printedLatexItems()
    {
        return $this->hasMany('App\Models\PrintedLatexItem', 'quote_id');
    }

    public function printedFoilItems()
    {
        return $this->hasMany('App\Models\PrintedFoilItem', 'quote_id');
    }

    public function customItems()
    {
        return $this->hasMany('App\Models\CustomItem', 'quote_id');
    }

    public function flatPackItems()
    {
        return $this->hasMany('App\Models\FlatPackItem', 'quote_id');
    }

    public function payments()
    {
        return $this->hasMany('App\Models\Payment', 'quote_id');
    }

    public function bonzaDispatchGroups()
    {
        return $this->hasMany('App\Models\BonzaDispatchGroup', 'quote_id');
    }

    public function dropshipperDispatchGroups()
    {
        return $this->hasMany('App\Models\DropshipperDispatchGroup', 'quote_id');
    }

    public function notes()
    {
        return $this->morphMany('App\Models\NewNote', 'notable');
    }

    public function requests()
    {
        return $this->hasMany('App\Models\Request', 'quote_id');
    }

    public function tasks()
    {
        return $this->hasMany('App\Models\Task', 'quote_id');
    }
}