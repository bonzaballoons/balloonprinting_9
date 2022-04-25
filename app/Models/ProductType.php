<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    protected $table = 'producttype';
    public $timestamps = false;
    protected $guarded = ['id'];
    protected $fillable = ['name'];

	public function products()
	{
    	return $this->belongsToMany(Product::class, 'product_type', 'type_id', 'product_id');
    }
}