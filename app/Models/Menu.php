<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Menu extends Model {

    protected $table = 'menu';
    protected $guarded  = ['id'];

    protected static function boot() : void
    {
        parent::boot();

        static::addGlobalScope('website_id', function (Builder $builder) {
            $builder->where('website_id', env('WEBSITE_ID'));
        });
    }

    public function categories(){
        return $this->belongsToMany(Category::class, 'category_menu', 'menu_id', 'category_id');
    }

    public static function getCategoriesWithUrl() : array {

        $menuCats = self::with(['categories'])->get()->toArray();
        
        foreach($menuCats as $menuCatKey => $menuCat){

            foreach( $menuCat['categories'] as $key => $cat){

                $urlString = 'product_list/'.$cat['pivot']['menu_id'].'/'.$cat['pivot']['category_id'];
                $menuCats[$menuCatKey]['categories'][$key]['urlTo'] = $urlString;
            }
        }
        return $menuCats;
    }

    public static function getCategoriesWithURLAndImage($menuId){

        $menuCat = self::with(['categories'])->find($menuId);

        foreach($menuCat->categories as $key => $cat){
            $urlString = 'product_list/'.snake_case($cat->name).'/'.$cat->pivot->category_id;
            $cat->urlTo = $urlString;
            $product = Product::byCategory($cat->id)->first();

            if($product){
                $cat->productImgRef = $product->ref_num;
            }
        }
        return $menuCat;
    }
}