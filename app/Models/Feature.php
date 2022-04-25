<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    protected $table = 'feature';
    protected $guarded = ['id'];
    protected $fillable = ['name'];
    public $timestamps = false;

    /**
	 * @Relation
	 */
    public function products()
    {
    	return $this->belongsToMany(Product::class, 'product_features', 'feature_id', 'product_id');
    }
}
