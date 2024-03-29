<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OptionChoiceItem extends Model
{
    protected $table = 'optionchoiceitem';
    public $timestamps = false;

    protected $casts = [
        'price' => 'decimal:2'
    ];

    public function optionChoice()
    {
    	return $this->belongsTo(OptionChoice::class);
    }
}
