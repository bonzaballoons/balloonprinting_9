<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MultiplePrice extends Model
{
    protected $table = 'multiple_price';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(Product::Class);
    }
}