<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierGroup extends Model
{
    protected $table = 'suppliergroup';
    protected $guarded = ['id'];
    public $timestamps = false;

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'suppliergroup_supplier', 'group_id', 'supplier_id');
    }

    public function products()
    {
    	return $this->belongsToMany(Product::class, 'suppliergroup_product', 'supplier_id', 'product_id');
    }
}