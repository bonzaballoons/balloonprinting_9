<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    protected $table = 'product';
    protected $guarded = ['id'];
    public $timestamps = false;

    protected $casts = [
        'contains_cant_collect' => 'integer',
        'contains_jumbo' => 'integer',
        'current_stock_value' => 'float',
        'helium_home_address' => 'integer',
        'max_bouquet' => 'integer',
        'postage_weight' => 'float',
        'primary' => 'integer',
        'size_id' => 'integer',
        'stock_level' => 'integer',
        'kashflow_id' => 'integer'
    ];

    // Global Scopes

    protected static function boot() : void
    {
        parent::boot();

        static::addGlobalScope('stock_level', function (Builder $builder) {
            $builder->where('stock_level', '>', 0);
        });

        static::addGlobalScope('is_active', function (Builder $builder) {
            $builder->where('state', 'a');
        });
    }

    // Scopes

    public function scopeByCategory($query, $categoryId)
    {
        return $query->whereHas('categories', function ($q) use ($categoryId) {
            $q->where('id', $categoryId);
        });
    }

    public function scopeByType($query, $typeID)
    {
        return $query->whereHas('types', function ($q) use ($typeID) {
            $q->where('id', $typeID);
        });
    }


    // Relationships
    public function details()
    {
        return $this->hasMany(ProductDetail::class, 'product_id');
    }

    public function addons()
    {
        return $this->belongsToMany(__CLASS__, 'addon_product', 'product_id', 'addon_id');
    }

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'supplier_product', 'product_id', 'supplier_id');
    }

    public function alerts()
    {
        return $this->belongsToMany(Alert::class, 'product_alert', 'product_id', 'alert_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_category', 'product_id', 'category_id');
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class, 'product_features', 'product_id', 'feature_id');
    }

    public function optionChoices()
    {
        return $this->belongsToMany(OptionChoice::class, 'product_optionchoice', 'product_id', 'optionchoice_id');
    }

    public function recommendedProducts()
    {
        return $this->belongsToMany(__CLASS__, 'product_recommend', 'product_id', 'recommend_id')->with('details');
    }

    public function stockAssociated()
    {
        return $this->belongsToMany(__CLASS__, 'product_stock', 'product_id', 'stock_assoc_id')->withPivot('quantity')->with('details');
    }

    public function types()
    {
        return $this->belongsToMany(ProductType::class, 'product_type', 'product_id', 'type_id');
    }

    public function supplierGroups()
    {
        return $this->belongsToMany(SupplierGroup::class, 'suppliergroup_product', 'product_id', 'supplier_id');
    }

    public function multiplePrices()
    {
        return $this->hasMany(MultiplePrice::class, 'product_id');
    }

}