@extends('masterLayout')

@section('content')
    <x-page-header>
        <h1><strong>Order</strong> Cancelled</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                <h1>We are sorry you decided to cancel payment. If there's anything we can do to help please give us a call on {{ env('SITE_PHONE_NUMBER') }}. Your basket contents have been maintained, so you can try again if there's an issue with your payment method</h1>
            </div>
        </div>
    </div>

@endsection
