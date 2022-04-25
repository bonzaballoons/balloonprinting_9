<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $table = 'alert';
    public $timestamps = false;

    public function products()
    {
        return $this->belongsToMany('App\Product', 'product_alert', 'alert_id', 'product_id');
    }
}