<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Website extends Model
{
    protected $table = 'website';
    protected $guarded = ['id'];
    protected $casts = [
        'faqs' => 'array'
    ];
    public $timestamps = false;

    // Accessors

    public function getExcludeDatesAttribute($value)
    {
        return unserialize($value);
    }

    // Relationships
    public function websiteGroups()
    {
    	return $this->belongsToMany(WebsiteGroup::class, 'websitegroup_website', 'website_id', 'group_id');
    }

    public function categories()
    {
    	return $this->hasMany(Category::class, 'website_id');
    }

    public function menus()
    {
    	return $this->hasMany(Menu::class, 'website_id');
    }

    public function pages()
    {
        return $this->belongsTo(Page::class, 'website_id');
    }

    public function postage()
    {
        return $this->hasMany(Postage::class, 'website_id');
    }

    public function productDetails()
    {
        return $this->hasMany(ProductDetail::class, 'website_id');
    }
}