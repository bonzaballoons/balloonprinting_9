<p><strong>Your Details:</strong></p>
<ul class="list-unstyled">
    <li>Customer Name: <strong>{{ $cgFirstName }} {{ $cgSecondName }}</strong></li>
    <li>Billing Address Line 1 <strong>{{ $cgBillingAdd1 }}</strong></li>
    <li>Billing City <strong>{{ $cgBillingCity }}</strong></li>
    <li>Billing Postcode <strong>{{ $cgBillingPostcode }}</strong></li>
    <li>Customer Email: <strong>{{ $cgEmail }}</strong></li>
    <li>Customer Phone: <strong>{{ $cgPhone }}</strong></li>
</ul>

<hr>

@if(isset($cdCollectionDate) )
    <p><strong>You have chosen to collect a total of {{ $numCollectHire }} canister(s) from {{ $depot->depot->name }}</strong></p>
    <ul class="list-unstyled">
        <li>Collection Date: <strong>{{ $cdCollectionDate }}</strong></li>
        <li>Return Date: <strong>{{ $cdReturnDate }}</strong></li>
        <li>Additional Weeks: <strong>{{ $cdAdditionalWeeks }}</strong></li>
        <li>Additional Weeks Price: <strong>&pound;{{ number_format($cdAdditionalPerWeekPrice, 2) }}</strong></li>
        <li>Additional Weeks Total: <strong>&pound;{{ number_format($cdAdditionalWeekTotalPrice, 2) }}</strong></li>
    </ul>

    <p><strong>You will store the canister(s) at the following address:</strong></p>
    <ul class="list-unstyled">
        <li>Building Number / Name: <strong>{{ $saBuildingNumName }}</strong></li>
        <li>Address Line 1: <strong>{{ $saAdd1 }}</strong></li>
        <li>Address Line 2: <strong>{{ $saAdd2 }}</strong></li>
        <li>City Town: <strong>{{ $saCityTown }}</strong></li>
        <li>Postcode: <strong>{{ $saPostCode }}</strong></li>
    </ul>

    <hr>
@endif

@if( isset($dacDeliveryDate) )
    <p><strong>You have chosen to have delivered a total of {{ $numDeliveryHire }} canister(s)</strong></p>
    <ul class="list-unstyled">
        <li>Delivery Date: <strong>{{ $dacDeliveryDate }}</strong></li>
        <li>Collection Date: <strong>{{ $dacCollectionDate }}</strong></li>
        <li>Delivery Customer Name: <strong>{{ $dabDeliveryCustomerName }}</strong></li>
        <li>Delivery Customer Phone: <strong>{{ $dabDeliveryCustomerPhone }}</strong></li>
        <li>Delivery Building Number / Name: <strong>{{ $dabBuildingNumName }}</strong></li>
        <li>Delivery Address Line 1: <strong>{{ $dabAdd1 }}</strong></li>
        <li>Delivery Address Line 2: <strong>{{ $dabAdd2 }}</strong></li>
        <li>Delivery City / Town: <strong>{{ $dabCityTown }}</strong></li>
        <li>Delivery Postcode: <strong>{{ $dabPostCode }}</strong></li>
        <li>Additional Weeks: <strong>{{ $dacAdditionalWeeks }}</strong></li>
        <li>Additional Weeks Price: <strong>&pound;{{ number_format($dacAdditionalPerWeekPrice, 2) }}</strong></li>
        <li>Addiitonal Weeks Total Price: <strong>&pound;{{ number_format($dacAdditionalWeekTotalPrice, 2) }}</strong></li>
    </ul>

    @if($danbSeperateAdd == 1)
        <p><strong>You have chosen to have the non hire products delivered to a separate address from the address we are delivering the cylinders to.</strong></p>
    @else
        <p><strong>You have chosen to have the non hire products delivered to the same address that we are delivering the cylinders to.</strong></p>
    @endif

@endif

@if(!empty($danbFullName))
    <p><strong>Non Hire Items to be delivered to the following address:</strong></p>
    <ul class="list-unstyled">
        <li>Recipients Full Name: <strong>{{ $danbFullName }}</strong> </li>
        <li>Building Number / Name: <strong>{{ $danbBuildingNumName }}</strong> </li>
        <li>Address Line 1: <strong>{{ $danbAdd1 }}</strong> </li>
        <li>Address Line 2: <strong>{{ $danbAdd2 }}</strong> </li>
        <li>City Town: <strong>{{ $danbCityTown }}</strong> </li>
        <li>Postcode: <strong>{{ $danbPostCode }}</strong> </li>
        <li>Event Date: <strong>@if(empty($danbDeliveryDate))ASAP @else{{ $danbDeliveryDate }}@endif</strong> </li>
    </ul>
    <hr>
@endif


@if(!empty($bonzaProducts))
    <p><strong>Individual Products:</strong><p>
    <ul>
        @foreach( $bonzaProducts as $product)
            <li>
                {{ $product->name }} - <strong>&pound;{{ number_format($product->unitPrice, 2) }} x {{$product->quantity}}</strong>
                @if($product->deliveryName)
                    <br> - with the following delivery option: {{ $product->deliveryName }} - <strong>&pound;{{ number_format($product->deliveryPrice, 2) }}</strong>
                @endif
            </li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($hireCollections))
    <p><strong>Hire Cylinders:</strong></p>
    <ul>
        @foreach( $hireCollections as $product)
            <li>{{ $product->name }} with an inflator kit for {{ $product->balloonType }} - <strong>&pound;{{ number_format($product->unitPrice, 2) }} x {{ $product->quantity }}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($hireCollectAndBonzaProducts))
    <p><strong>Packages with Hire Delivery:</strong></p>
    <ul>
        @foreach( $hireCollectAndBonzaProducts as $product)
            <li>{{ $product->name }} with an inflator kit - <strong>&pound;{{ number_format($product->unitPrice, 2) }} x {{$product->quantity}}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($hireDeliveries))
    <p><strong>Hire Deliveries:</strong></p>
    <ul>
        @foreach( $hireDeliveries as $product)
            <li>{{ $product->name }} with an inflator kit for {{ $product->balloonType }} - <strong>&pound;{{ number_format($product->unitPrice, 2) }} x {{$product->quantity}}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($hireDeliveryAndBonzaProducts))
    <p><strong>Packages with Hire Delivery:</strong></p>
    <ul>
        @foreach( $hireDeliveryAndBonzaProducts as $product)
            <li>{{ $product->name }} with an inflator kit - <strong>&pound;{{ number_format($product->unitPrice, 2) }} x {{$product->quantity}}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($customLatexFromWizard))
    <p><strong>Custom Latex Orders From the Wizard:</strong></p>
    <ul>
        @foreach( $customLatexFromWizard as $product)
            <li>{{ $product->description }} - <strong>&pound;{{ number_format($product->totalPrice, 2) }}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif


@if(!empty($customPrintedLatexProduct))
    <p><strong>Custom Printed Latex Orders:</strong></p>
    <ul>
        @foreach( $customPrintedLatexProduct as $product)
            <li>{{ $product->description }} - <strong>&pound;{{ number_format($product->totalPrice, 2) }}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($customFoilFromWizard))
    <p><strong>Custom Foil Orders From the Wizard:</strong></p>
    <ul>
        @foreach( $customFoilFromWizard as $product)
            <li>{{ $product->description }} - <strong>&pound;{{ number_format($product->totalPrice, 2) }}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif

@if(!empty($customPrintedFoilProduct))
    <p><strong>Custom Printed Foil Orders:</strong></p>
    <ul>
        @foreach( $customPrintedFoilProduct as $product)
            <li>{{ $product->description }} - <strong>&pound;{{ number_format($product->totalPrice, 2) }}</strong></li>
        @endforeach
    </ul>
    <hr>
@endif


@if($totalPostageWeightPrice > 0)
    <ul class="list-unstyled">
        <li>Postage Weight Grams:  <strong>{{ $totalPostageWeight }} </strong></li>
        <li>Postage Option Chosen:  <strong>{{ $postageWeightName }} </strong></li>
        <li>Postage Weight Cost:  <strong>&pound;{{  number_format($totalPostageWeightPrice, 2) }} </strong></li>
    </ul>
    <hr>
@endif