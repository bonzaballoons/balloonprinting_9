@extends('masterLayout')

@section('content')
    <x-page-header>
        <h1><strong>Order</strong> Success</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>Order Transaction Successful</h1>
                <p>Thank you your order has been successfully completed.  You have been sent an email to confirm this which should be with you shortly.  Please make a note of the reference number below and use it in any correspondence with us</p><br>
                <p>Your reference number is: <strong>BP{{ $orderId }}</strong></p>
                <br>
            </div>
        </div>
    </div>
@endsection
