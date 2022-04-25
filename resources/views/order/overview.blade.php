@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Order</strong> Overview</h1>
    </x-page-header>
    <div class="container">

        <p class="text-center">Thank you for submitting your details. Please check the details below before continuing to our 'SAGE PAY' Secure Payments Page to safely process your credit card payment.</p>
        <div class="row text-center">
            <div class="col-sm-6">
                <h5 class="heading-secondary">Contact Details</h5>
                <ul class="list-unstyled">
                    <li>{{ $orderDetails->customerContactFullName }}</li>
                    <li>{{ $orderDetails->customerContactEmail }}</li>
                    <li>{{ $orderDetails->customerContactPhone }}</li>
                </ul>
            </div>
        </div>

        <hr>

       <h3 class="text-center header-lowercase mt-5">Product & Delivery Details Overview</h3>

        @if( $basket->hasBonzaProducts )
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-7">
                            <h5 class="heading-secondary text-center">The following items</h5>
                            <ul class="mb-0">
                                @foreach( $basket->bonzaProducts as $product)
                                    <li>{{ $product->quantity }} x {{ $product->productName }}</li>
                                @endforeach

                                @foreach( $basket->printedLatexFromWizard as $product )
                                    <li>
                                        @if(  $product->quantity > 1 )
                                            {{ $product->quantity }} x
                                        @endif
                                        {{ $product->description }}
                                    </li>
                                @endforeach

                                @foreach( $basket->printedFoilFromWizard as $product )
                                    <li>
                                        @if(  $product->quantity > 1 )
                                            {{ $product->quantity }} x
                                        @endif
                                        {{ $product->description }}
                                    </li>
                                @endforeach

                                @foreach( $basket->printedLatexGiantFromWizard as $product )
                                    <li>
                                        @if(  $product->quantity > 1 )
                                            {{ $product->quantity }} x
                                        @endif
                                        {{ $product->description }}
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        <div class="col-sm-5 text-center">
                            <div class="d-sm-none divider divider-style-4 divider-solid divider-xs divider-icon-sm">
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <h5 class="heading-secondary">Will be delivered to</h5>
                            <ul class="list-unstyled">
                                <li>{{ $orderDetails->deliveryBonzaFullName }}</li>
                                <li>{{ $orderDetails->deliveryBonzaAdd1 }}</li>
                                <li>{{ $orderDetails->deliveryBonzaAdd2 }}</li>
                                <li>{{ $orderDetails->deliveryBonzaCityTown }}</li>
                                <li>{{ $orderDetails->deliveryBonzaPostCode }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        @endif

        @if( $basket->hasHireDelivery )
            <div class="row">
                <div class="col">
                    <div class="card mt-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-7">
                                    <h5 class="heading-secondary text-center">The Following Cylinders</h5>
                                    <ul>
                                        @foreach( $basket->heliumHireDeliveries as $product)
                                            <li>
                                                {{ $product->productName }} - Quantity x {{  $product->quantity }}<br>
                                                With an inflator kit for {{ $product->balloonType }}<br>
                                                <strong>Delivery Date:</strong> {{ Carbon\Carbon::createFromFormat('Y-m-d', $product->startDate)->toFormattedDateString() }}, <strong>Hire End Date:</strong> {{ Carbon\Carbon::createFromFormat('Y-m-d', $product->endDate)->toFormattedDateString() }}
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                                <div class="col-sm-5 text-center">
                                    <div class="d-sm-none divider divider-style-4 divider-solid divider-xs divider-icon-sm">
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                    <h5 class="heading-secondary">Will be delivered to and collected from</h5>
                                    <ul class="list-unstyled">
                                        <li>{{ $orderDetails->hireDeliveryCustomerName }} <span class="smaller heading-secondary">({{ $orderDetails->hireDeliveryCustomerPhone }})</span></li>
                                        <li>{{ $orderDetails->hireDeliveryAdd1 }}</li>
                                        <li>{{ $orderDetails->hireDeliveryAdd2 }}</li>
                                        <li>{{ $orderDetails->hireDeliveryCityTown }}</li>
                                        <li>{{ $orderDetails->hireDeliveryPostCode }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        @endif

        @if( $basket->hasHireCollect )
            <div class="row">
                <div class="col">
                    <div class="card mt-4">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-7">
                                    <h5 class="heading-secondary text-center">The Following Cylinders</h5>
                                    <ul class="mb-0">
                                        @foreach( $basket->heliumHireCollections as $product)
                                            <li>
                                                {{ $product->productName }} - Quantity x {{  $product->quantity }}<br>
                                                With an inflator kit for {{ $product->balloonType }}<br>
                                                <strong>Collection Date:</strong> {{ Carbon\Carbon::createFromFormat('Y-m-d', $product->startDate)->toFormattedDateString() }}, <strong>Return By Date:</strong> {{ Carbon\Carbon::createFromFormat('Y-m-d', $product->endDate)->toFormattedDateString() }}
                                            </li>
                                        @endforeach
                                    </ul>
                                </div>
                                <div class="col-sm-5 text-center">
                                    <div class="d-sm-none divider divider-style-4 divider-solid divider-xs divider-icon-sm">
                                        <i class="fas fa-chevron-down"></i>
                                    </div>
                                    <h5 class="heading-secondary">Will be collected from</h5>
                                    <p class="mb-0">{{ $orderDetails->heliumSupplier['name'] }}</p>
                                    <p class="smaller heading-primary mt-2"><strong>Important!</strong> Full depot address details, for your helium collection, will be provided in your confirmation email once an order has been processed so we can ensure that the cylinder is booked in waiting for you when you go to collect </p>

                                    <h5 class="heading-secondary">and stored at the following location</h5>
                                    <ul class="list-unstyled mb-0">
                                        <li>{{ $orderDetails->heliumStorageAdd1 }}</li>
                                        @if( !empty( $orderDetails->heliumStorageAdd2) )
                                            <li>{{ $orderDetails->heliumStorageAdd2 }}</li>
                                        @endif
                                        @if( !empty( $orderDetails->heliumStorageCityTown) )
                                            <li>{{ $orderDetails->heliumStorageCityTown }}</li>
                                        @endif
                                        <li>{{ $orderDetails->heliumStoragePostCode }}</li> <br>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        @endif

        <br><br>
        <div class="row">
            <div class="col-sm-6">
                <h4>Total Basket Price: &pound;{{ number_format($basket->totalPrice, 2) }}</h4>
            </div>
            <div class="col-sm-6">
                <button id="checkout" class="btn btn-large btn-primary float-right">Continue to our secure payments page</button>
            </div>
        </div>

    </div>

@endsection
