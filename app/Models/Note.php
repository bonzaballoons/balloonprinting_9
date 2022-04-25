<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Note extends Model
{
    protected $table = 'note';

	public function orders()
	{
	    return $this->belongsToMany('App\Models\Order', 'orders_note', 'note_id', 'order_id');
	}

	public function packages()
	{
	    return $this->belongsToMany('App\Models\Package', 'package_note', 'note_id', 'package_id');
	}

	public function user()
	{
	    return $this->belongsTo('App\User', 'user_id');
	}

    public static function addNote($data) {

        $insert = [
            'user_id' => 99998,
            'description' => $data['description'],
            't_update' => Carbon::now(),
            't_create' => Carbon::now()
        ];

        $noteId = self::insertGetId($insert);

        # Associate with package or order
        $insert = [ 'order_id' => $data['assoc_id'],  'note_id' => $noteId];

        if ($data['assoc_table'] === 'package_note') {
            $insert = [ 'package_id' => $data['assoc_id'], 'note_id' => $noteId];
        }

        DB::table( $data['assoc_table'] )->insertGetId( $insert );

        return TRUE;
    }

}