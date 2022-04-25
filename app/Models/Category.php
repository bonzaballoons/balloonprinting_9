<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model {

    protected $table = 'category';
    protected $guarded  = ['id'];

    protected static function boot() :void
    {
        parent::boot();

        static::addGlobalScope('website_id', function (Builder $builder) {
            $builder->where('website_id', env('WEBSITE_ID'));
        });
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_category', 'category_id', 'product_id');
    }

    public function website()
    {
        return $this->belongsTo(Website::class, 'website_id');
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'category_menu', 'category_id', 'menu_id');
    }

    // Custom methods

    public static function withProductURLAndImage($categoryId){

        $category = self::with(['products' => function($q){
            $q->whereHas('details')->select('id', 'ref_num');
        } ,'products.details' => function($q){
            $q->select('product_id', 'website_id', 'name', 'desc', 'unit_price', 'delivery_price', 'ap_collect_price', 'boc_collect_price');
        }])->find($categoryId);

        $category->products->map( function ($product, $key) use($category){

            $product->urlTo = 'product/'.snake_case($product->details[0]['name']).'/'.$product->id;
            $product->name = $product->details[0]['name'];
            $product->price = $product->details[0]['unit_price'];
            unset($product->details, $product->pivot);

            return $product;
        });

        return $category;
    }


}
