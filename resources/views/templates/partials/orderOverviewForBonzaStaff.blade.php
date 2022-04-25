<strong class="font-blue">Customer Contact Details:</strong>
<br>
Customer Name: <strong>{{ $orderDetails['customerContactFullName'] }}</strong><br>
Customer Email: <strong>{{ $orderDetails['customerContactEmail'] }}</strong><br>
Customer Phone: <strong>{{ $orderDetails['customerContactPhone'] }}</strong><br>

<br>
<hr>

@if( $basket['hasBonzaProducts'] )
    <strong class="font-blue">Bonza Items to be delivered to the following address:</strong>
    <br>
    Recipients Full Name: <strong>{{ $orderDetails['deliveryBonzaFullName'] }}</strong> <br>
    Address Line 1: <strong>{{ $orderDetails['deliveryBonzaAdd1'] }}</strong> <br>
    @if( !empty(  $orderDetails['deliveryBonzaAdd2'] ) )
        Address Line 2: <strong>{{ $orderDetails['deliveryBonzaAdd2'] }}</strong> <br>
    @endif
    City Town: <strong>{{ $orderDetails['deliveryBonzaCityTown'] }}</strong> <br>
    Postcode / Zip: <strong>{{ $orderDetails['deliveryBonzaPostCode'] }}</strong> <br>
    Country: <strong>{{ $orderDetails['deliveryBonzaCountry'] }}</strong> <br>
    <br>

    <strong class="font-blue">Bonza Products:</strong>
    <br>
    @foreach( $basket['bonzaProducts'] as $product)
        - {{ $product->productName }} - Quantity x {{$product->quantity}}
        @if($product->deliveryName)
            &nbsp;&nbsp;With the following delivery option: {{ $product->deliveryName }}
        @endif
        - <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br>
    @endforeach
    <br>
    Delivery Date Chosen: <strong> {{ dbToUKDate( $basket['bonzaProductsDeliveryDate'] ) }}</strong>
    <hr>
@endif

@if( $basket['hasHireCollect'] )
    <strong class="font-blue">The customer has chosen to collect a total of {{ $basket['numCollectHire'] }} canister(s) from {{ $orderDetails['heliumSupplier']['name'] }}. They will store the canister(s) at the following address:</strong>
    <br>
    Address Line 1: <strong>{{ $orderDetails['heliumStorageAdd1'] }}</strong> <br>
    @if( !empty($orderDetails['heliumStorageAdd2'] ) )
    Address Line 2: <strong>{{ $orderDetails['heliumStorageAdd2'] }}</strong> <br>
    @endif
    @if( !empty($orderDetails['heliumStorageCityTown'] ) )
    City Town: <strong>{{ $orderDetails['heliumStorageCityTown'] }}</strong> <br>
    @endif
    Postcode: <strong>{{ $orderDetails['heliumStoragePostCode'] }}</strong> <br>
    <br>
    <strong class="font-blue">Hire Cylinders:</strong>
    <br>
    @foreach( $basket['heliumHireCollections'] as $product)
        - {{ $product->productName }} with an inflator kit for {{ $product->balloonType }} <strong>x {{  $product->quantity }}</strong><br>
        Start date: <strong>{{ dbToUKDate($product->startDate) }}</strong><br>
        End Date: <strong>{{ dbToUKDate($product->endDate) }}</strong><br>
        Additional Weeks: <strong>{{ $product->additionalWeeks }}</strong><br>
        - Total Price: <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br>
    @endforeach
    <hr>
@endif

@if( $basket['hasHireDelivery'] )
    <strong class="font-blue">The customer has chosen to have delivered a total of {{ $basket['numDeliveryHire'] }} canister(s)</strong>
    <br>
    Delivery Customer Name: <strong>{{ $orderDetails['hireDeliveryCustomerName'] }}</strong> <br>
    Delivery Customer Phone: <strong>{{  $orderDetails['hireDeliveryCustomerPhone'] }}</strong> <br>
    Delivery Address Line 1: <strong>{{  $orderDetails['hireDeliveryAdd1'] }}</strong> <br>
    Delivery Address Line 2: <strong>{{  $orderDetails['hireDeliveryAdd2'] }}</strong> <br>
    Delivery City / Town: <strong>{{  $orderDetails['hireDeliveryCityTown'] }}</strong> <br>
    Delivery Postcode: <strong>{{  $orderDetails['hireDeliveryPostCode'] }}</strong> <br>
    <br>
    <strong class="font-blue">Hire Deliveries:</strong>
    <br>
    @foreach( $basket['heliumHireDeliveries'] as $product )
        - {{ $product->productName }} - Quantity x {{  $product->quantity }} <br>
        &nbsp;&nbsp;With an inflator kit for {{ $product->balloonType }}<br>
        <strong>Start date:</strong> {{ dbToUKDate($product->startDate) }}, <strong>End Date:</strong> {{ dbToUKDate($product->endDate) }}, <strong>Additional Weeks:</strong> {{ $product->additionalWeeks }}
        <br>
        - Total Price: <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br>
    @endforeach
    <hr>
@endif

@if( ! empty( $basket['printedLatexFromWizard'] ) )
    <strong class="font-blue">Custom Latex Orders From Wizard:</strong>
    <br>
    @foreach( $basket['printedLatexFromWizard'] as $product )
        - Description: <strong>{{ $product->description }}</strong>, <br>
        - Number of batches: <strong>{{ $product->quantity }}</strong>,<br>
        - Number of balloons: <strong>{{ $product->numberBalloons }}</strong>,<br>
        - Latex style: <strong>{{ $product->typeSelected->name }}</strong>,<br>
        - Colours Chosen: <strong>{{ $product->coloursChosen }}</strong>,<br>
        - Size Inch: <strong>{{ $product->size }}</strong>,<br>
        - Num of Sides: <strong>{{ $product->sides }}</strong>,<br>
        - Artwork Colours: <strong>{{ $product->artworkColours }}</strong>,<br>

        @if( $product->inkChanges === 1 )
            - Ink Changes: <strong>{{ $product->inkChanges }}</strong>,<br>
            - Ink Switch Pantone: <strong>{{ $product->inkSwitchPantone }}</strong>,<br>
        @endif

        @if( $product->typeSelected->id === 3)
            - Side 1 Pantone: <strong>{{ $product->side1Pantone }}</strong>,<br>
            - Side 2 Pantone: <strong>{{ $product->side2Pantone }}</strong>,<br>
        @else
            - Artwork Pantone Colours:<strong>{{ $product->artworkColourNameList }}</strong>,<br>
        @endif

        @if( count( $product->uploadedArtwork ) > 0)
            - Artwork Upload Links:
            <strong>
                @foreach( $product->uploadedArtwork as $artwork)
                   &nbsp;&nbsp; <a target="_blank" href="{{ s3ImgFullPathTransform($artwork->s3Path) }}">{{ $artwork->name }}</a>
                @endforeach
            </strong>
            <br>
        @endif
        - Artwork Text: <strong>{{ $product->artworkText }}</strong>,<br>
        - Artwork Font: <strong>{{ $product->artworkFont }}</strong>,<br>

        @if( $product->expressFeeId === 1)
            - Next Day Express Fee Paid <br>
        @endif

        @if( $product->expressFeeId === 2)
            - 2 Working Day Express Fee Paid <br>
        @endif

        @if( $product->expressFeeId === 3 || $product->expressFeeId === 4 )
            - 3 to 4 Working Day Express Fee Paid <br>
        @endif

        - Total Price: <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br>
    @endforeach
    <hr>
@endif

@if( ! empty( $basket['printedLatexGiantFromWizard'] ) )
    <strong class="font-blue">Custom Latex Orders From Wizard:</strong>
    <br>
    @foreach( $basket['printedLatexGiantFromWizard'] as $product )
        - Description: <strong>{{ $product->description }}</strong>, <br>
        - Number of batches: <strong>{{ $product->quantity }}</strong>,<br>
        - Number of balloons: <strong>{{ $product->numberBalloons }}</strong>,<br>
        - Latex style: <strong>{{ $product->typeSelected->name }}</strong>,<br>
        - Colours Chosen: <strong>{{ $product->coloursChosen }}</strong>,<br>
        - Size Inch: <strong>{{ $product->size }}ft</strong>,<br>
        - Num of Sides: <strong>{{ $product->sides }}</strong>,<br>
        - Artwork Ink Colour: <strong>{{ $product->artworkInkColour }}</strong>,<br>
        @if( count( $product->uploadedArtwork ) > 0)
            - Artwork Upload Links:
            <strong>
                @foreach( $product->uploadedArtwork as $artwork)
                    &nbsp;&nbsp; <a target="_blank" href="{{ s3ImgFullPathTransform($artwork->s3Path) }}">{{ $artwork->name }}</a>
                @endforeach
            </strong>
        @endif
        - Artwork Text: <strong>{{ $product->artworkText }}</strong>,<br>
        - Artwork Font: <strong>{{ $product->artworkFont }}</strong>,<br>
        - Total Price: <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br><br>
    @endforeach
    <hr>
@endif

@if( ! empty( $basket['printedFoilFromWizard'] ) )
    <strong class="font-blue">Custom Foil Orders From Product Page Wizard:</strong>
    <br>
    @foreach( $basket['printedFoilFromWizard'] as $product )
        - Description: <strong>{{ $product->description }}</strong><br>
        - Product Description: <strong>{{ $product->description }}</strong> <br>
        - Number of batches: <strong>{{ $product->quantity }}</strong> <br>
        - Number of balloons:  <strong>{{ $product->numberBalloons }}</strong>, <br>
        - Number of Sides: <strong>{{ $product->sides }}</strong>, <br>
        - Type Selected: <strong>{{ $product->typeSelectedName }}</strong>, <br>
        - Balloon Colours Chosen: <strong>{{ $product->coloursChosen }}</strong>, <br>

        @if( $product->sides === 2)
            - Side Same or Different: <strong>{{ $product->sideDesignType }}</strong>, <br>
        @endif

        - Ink Colours
        @if( $product->sides === 2 && $product->sideDesignType === 'different')
            Side 1
        @endif: <strong>{{ $product->side1OrSameInkColourNumber }}</strong> : <strong>{{ $product->pantonesSide1List }}</strong>
        <br>

        @if( $product->sides === 2 && $product->sideDesignType === 'different' )
            - Ink Colours Side 2: <strong>{{ $product->side2InkColourNumber }}</strong>:
            <br>
            {{ $product->pantonesSide2List }}
            <br>
        @endif

        @if( $product->inkChangeNumber === 1)
            - Ink Change Number: <strong>1</strong>
            <br>
            - Ink Switch Colour: <strong>{{ $product->inkSwitchColourPantone }}</strong>
            <br>
        @endif

        @if( count( $product->uploadedArtwork ) > 0)
            - Artwork Upload Links:
            <strong>
                @foreach( $product->uploadedArtwork as $artwork)
                    &nbsp;&nbsp;<a target="_blank" href="{{ s3ImgFullPathTransform($artwork->s3Path) }}">{{ $artwork->name }}</a><br>
                @endforeach
            </strong>
        @endif

        @if( !empty($product->artworkText) )
            - Artwork Text: <strong>{{ $product->artworkText }}</strong>, <br>
        @endif

        @if( !empty($product->artworkFont) )
            - Artwork Font: <strong>{{ $product->artworkFont }}</strong>, <br>
        @endif

        - Total Price: <strong>£{{ number_format($product->totalPriceWithVat, 2) }}</strong>
        <br><br>
    @endforeach
    <hr>
@endif

@if( $basket['totalPostageWeightPrice'] > 0 )
    Postage Weight Grams: <strong>{{ $basket['totalPostageWeight'] }}</strong><br>
    Postage Option Chosen: <strong>{{ $basket['postageWeightName'] }}</strong><br>
    Postage Weight Cost: <strong>&pound;{{ $basket['totalPostageWeightPrice'] }}</strong><br>
    <hr>
@endif

Total Basket Price: <strong>£{{ $basket['totalPrice'] }}</strong>
<br>
