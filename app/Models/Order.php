<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    protected $table = 'orders';
    const CREATED_AT = 't_create';
    const UPDATED_AT = 't_update';

	public function buyers()
	{
	    return $this->belongsToMany('App\Models\Buyers', 'buyer_orders', 'order_id', 'buyer_id');
	}

	public function notes()
	{
	    return $this->belongsToMany('App\Models\Note', 'orders_note', 'order_id', 'note_id');
	}

	public function packages()
	{
	    return $this->belongsToMany('App\Models\Package', 'orders_package', 'order_id', 'package_id');
	}

	public function payvendors()
	{
	    return $this->belongsToMany('App\Models\PayVendor', 'orders_payvendor', 'order_id', 'payvendor_id');
	}

	public function website()
	{
	    return $this->belongsTo('App\Models\Website', 'website_id');
	}

	public function status()
	{
	    return $this->belongsTo('App\Models\OrderStatus', 'order_status_id');
	}

    public static function addOrder($basket, $orderDetails) {

        #Insert Buyer
        $insert = [
            'full_name' => $orderDetails->customerContactFullName,
            'email' => $orderDetails->customerContactEmail,
            'telephone' => $orderDetails->customerContactPhone
        ];

        $buyerId = Buyer::insertGetId($insert);

        #Insert Order
        $insert = [
            'website_id' => env('WEBSITE_ID'),
            'order_status_id' => 3,
            'payment_status_id' => 1,
            'total_cost' => $basket->totalPrice,
            'auth_id' => 1,
            't_update' => Carbon::now(),
            't_create' => Carbon::now()
        ];
        $orderId = self::insertGetId($insert);

        DB::table('buyer_orders')->insert( ['buyer_id' => $buyerId, 'order_id' => $orderId] );

        $data = [
            'orderDetails' => (array) $orderDetails,
            'basket' => (array) $basket
        ];

        $orderSummaryTemplate = view()->file( resource_path('views/templates/orderCmsOverview.blade.php'), $data)->render();

        $dataForModel = [
            'assoc_id' => $orderId,
            'assoc_table' => 'orders_note',
            'description' => $orderSummaryTemplate
        ];

        Note::addNote($dataForModel);

        return $orderId;
    }

    public static function adminBeenDone($orderId) : bool {

        return self::find($orderId)->email_sent;
    }


}
