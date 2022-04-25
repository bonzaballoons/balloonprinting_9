<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'tag';

    public function Page()
    {
        return $this->hasMany(Page::class, 'page_id');
    }
}
