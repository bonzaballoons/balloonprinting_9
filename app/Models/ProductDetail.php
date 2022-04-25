<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ProductDetail extends Model
{
    protected static function boot() : void
    {
        parent::boot();

        static::addGlobalScope('website_id', function (Builder $builder) {
            $builder->where('website_id', env('WEBSITE_ID'));
        });
    }

    protected $table = 'productdetails';
	protected $guarded = ['product_id', 'website_id'];

    protected $casts = [
        'unit_price' => 'float',
        'biab_price' => 'float',
        'ap_collect_price' => 'float',
        'boc_collect_price' => 'float',
        'delivery_price' => 'float'
    ];

    public function website()
    {
        return $this->belongsTo(Website::class, 'website_id');
    }

	public function product()
	{
	    return $this->belongsTo(Product::class, 'product_id');
	}
}