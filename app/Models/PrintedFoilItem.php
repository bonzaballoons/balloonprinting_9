<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintedFoilItem extends Model
{
    protected $table = 'printedfoilitem';
    protected $guarded = ['id'];
    protected $hidden = ['pivot'];
    protected $casts = [
        'all_tasks_complete' => 'boolean',
        'ink_switch_colours' => 'array',
        'balloon_colours' => 'array',
        'side1_or_same_ink_colours' => 'array',
        'side2_ink_colours' => 'array',
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

    public function upload()
    {
        return $this->belongsTo('App\Models\Upload');
    }

    public function bonzaDispatchGroup()
    {
        return $this->belongsTo('App\Models\BonzaDispatchGroup', 'bonzadispatchgroup_id');
    }

    public function dropshipperDispatchGroup()
    {
        return $this->belongsTo('App\Models\DropshipperDispatchGroup', 'dropshipperdispatchgroup_id');
    }
}