<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewOrder extends Model
{
    protected $table = 'neworder';
    protected $guarded = ['id'];
    protected $hidden = ['pivot'];
    protected $casts = [
        'stock_reduced' => 'boolean',
        'confirmation_email_sent' => 'boolean',
        'paid' => 'boolean',
        'item_tasks_complete' => 'boolean',
        'dispatch_group_tasks_complete' => 'boolean',
        'kashflow_lines_synced' => 'boolean',
        'kashflow_payments_synced' => 'boolean'
    ];

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
        return $this->hasMany('App\Models\PrintedLatexItem', 'order_id');
    }

    public function printedFoilItems()
    {
        return $this->hasMany('App\Models\PrintedFoilItem', 'order_id');
    }

    public function customItems()
    {
        return $this->hasMany('App\Models\CustomItem', 'order_id');
    }

    public function flatPackItems()
    {
        return $this->hasMany('App\Models\FlatPackItem', 'order_id');
    }

    public function payments()
    {
        return $this->hasMany('App\Models\Payment', 'order_id');
    }

    public function bonzaDispatchGroups()
    {
        return $this->hasMany('App\Models\BonzaDispatchGroup', 'order_id');
    }

    public function dropshipperDispatchGroups()
    {
        return $this->hasMany('App\Models\DropshipperDispatchGroup', 'order_id');
    }

    public function notes()
    {
        return $this->morphMany('App\Models\NewNote', 'notable');
    }

    public function requests()
    {
        return $this->hasMany('App\Models\Request', 'order_id');
    }

    public function tasks()
    {
        return $this->hasMany('App\Models\Task', 'order_id');
    }
}