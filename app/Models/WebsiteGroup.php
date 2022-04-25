<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteGroup extends Model
{
    protected $table = 'websitegroup';
    public $timestamps = false;
    protected $guarded = ['id'];
    protected $fillable = ['name'];

    public function websites()
    {
    	return $this->belongsToMany(Website::class, 'websitegroup_website', 'group_id', 'website_id');
    }
}
