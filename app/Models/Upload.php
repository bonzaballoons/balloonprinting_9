<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Upload extends Model
{
    protected $table = 'upload';
    protected $guarded = ['id'];
    protected $casts = [
        'pages_number' => 'real'
    ];

    // Relationships
    public function printedLatexItems()
    {
        return $this->hasMany('App\Models\PrintedLatexItem');
    }

    public function printedFoilItems()
    {
        return $this->hasMany('App\Models\PrintedFoilItem');
    }
}