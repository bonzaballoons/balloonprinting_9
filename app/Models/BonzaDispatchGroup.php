<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BonzaDispatchGroup extends Model
{
    protected $table = 'bonzadispatchgroup';
    protected $guarded = ['id'];
    public $timestamps = false;
    protected $casts = [
        'courier_tracking_codes' => 'array',
        'delivery_cost_vat_rate' => 'real',
        'delivery_cost_vat' => 'real',
        'delivery_cost_exc_vat' => 'real',
        'delivery_cost_inc_vat' => 'real',
        'job_sheet_printed' => 'boolean',
        'dispatched_with_email' => 'boolean',
        'dispatched_without_email' => 'boolean',
        'all_tasks_complete' => 'boolean'
    ];

    // Relationships
    public function printedLatexItems()
    {
        return $this->hasMany('App\Models\PrintedLatexItem', 'bonzadispatchgroup_id');
    }

    public function flatPackItems()
    {
        return $this->hasMany('App\Models\FlatPackItem', 'bonzadispatchgroup_id');
    }

    public function customItems()
    {
        return $this->hasMany('App\Models\CustomItem', 'bonzadispatchgroup_id');
    }

    public function order()
    {
        return $this->belongsTo('App\Models\NewOrder');
    }

    public function courier()
    {
        return $this->belongsTo('App\Models\Courier');
    }
}
