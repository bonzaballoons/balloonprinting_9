<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlatPackItem extends Model
{
    protected $table = 'flatpackitem';
    protected $guarded = ['id'];
    protected $hidden = ['pivot'];
    protected $casts = [
        'stock_checked' => 'boolean',
        'pick_items' => 'boolean',
        'all_tasks_complete' => 'boolean',
        'vat_rate' => 'real',
        'unit_exc_vat' => 'real',
        'unit_inc_vat' => 'real',
        'total_vat' => 'real',
        'total_inc_vat' => 'real'
    ];

    // Relationships
    public function order()
    {
        return $this->belongsTo('App\Models\NewOrder');
    }

    public function quote()
    {
        return $this->belongsTo('App\Models\Quote');
    }

    public function bonzaDispatchGroup()
    {
        return $this->belongsTo('App\Models\BonzaDispatchGroup', 'bonzadispatchgroup_id');
    }

    public function dropshiperDispatchGroup()
    {
        return $this->belongsTo('App\Models\DropshipperDispatchGroup', 'dropshipperdispatchgroup_id');
    }
}