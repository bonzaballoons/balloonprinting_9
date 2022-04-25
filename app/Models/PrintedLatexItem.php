<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrintedLatexItem extends Model
{
    protected $table = 'printedlatexitem';
    protected $guarded = ['id'];
    protected $hidden = ['pivot'];
    protected $casts = [
        'stock_checked' => 'boolean',
        'print_artwork' => 'boolean',
        'is_express_job' => 'boolean',
        'all_tasks_complete' => 'boolean',
        'ink_switch_colours' => 'array',
        'balloon_colour_ids' => 'array',
        'ink_colours' => 'array',
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

    public function machine()
    {
        return $this->belongsTo('App\Models\Machine');
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