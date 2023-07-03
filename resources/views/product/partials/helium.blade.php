{{--Todo - Need to add warning for jumbo.--}}
{{--Todo - Check double hr at bottom on mobile size--}}

<div class="row">
    <div class="col-md-12 col-lg-6">
        <p class="text-center">{!!  $product['details'][0]->desc !!}</p>
    </div>
    <div class="col-md-6 col-lg-3">
        <br>
        <img class="img-fluid d-block mx-auto" src="{{ s3ImgSRC($product->ref_num, 200) }}" alt="{{ $product['details'][0]->name }} Product Display">
        <br>
    </div>
    <div class="col-md-6 col-lg-3">
        <h5 class="heading-primary">Product Features:</h5>
        <ul class="list list-icons list-primary mt-0">
            @foreach( $product['features'] as $feature )
                <li><i class="fas fa-check"></i>{{ $feature->name }}</li>
            @endforeach
        </ul>
    </div>
</div>
<hr>
<div class="row">
    <div class="col-md-6">
        <h4 class="mt-2 mb-3"><strong>Choose a Price Option:</strong></h4>
        <div class="mb-2">
            <label>
                <input type="radio" value="collected" v-model="collectOrDeliveryPrice">
                <span v-if="collectPriceRange">
                    <span v-if="supplierSelected">
                        <strong class="text-success">&nbsp;£@{{ supplierSelected.price }}</strong>
                        : To be picked up from @{{ supplierSelected.name }}.
                    </span>
                    <span v-else>
                        <strong class="text-success">&nbsp;@{{ collectPriceRange }}</strong>
                        : Price dependant on the depot you choose to collect the cylinder from.
                    </span>
                </span>
                <span v-else>
                    <strong class="text-success">&nbsp;&pound;@{{ collectPrice }}</strong>: Collect the cylinder from your local depot.
                </span>
            </label>
        </div>
        @if($product->details->first()->delivery_price > 0)
            <div>
                <label>
                    <input type="radio" value="delivered" v-model="collectOrDeliveryPrice">
                    <strong class="text-success"> &nbsp;&pound;{{ $product->details->first()->delivery_price }}</strong>: Have the cylinder delivered to a business address.
                </label>
            </div>
        @endif

        <small v-show="collectOrDeliveryPrice === 'delivered'" class="heading-secondary"> (If you have more than one hire cylinder delivered & collected to the same address at the same time, the second and each subsequent cylinder gets a £20.00 discount. This discount will be applied in the basket.) </small>
    </div>
    <div class="col-md-6">
        @foreach($product['optionChoices'] as $optionChoice)
            <label class="heading-primary"><strong>Please choose the type of balloons you'll be using, so we can provide you with the correct filling kit:</strong></label>
            <select v-model="balloonTypeID" class='form-control mt-2'>
                @foreach ($optionChoice['items'] as $choice)
                    <option value="{{ $choice->id }}">{{ $choice->name }}</option>
                @endforeach
            </select>
            <input id="balloonTypeIDFirst" type="hidden"  value="{{ $optionChoice['items'][0]->id }}">
        @endforeach
    </div>
</div>

<hr>

<div class="row">

    <div class="col-md-7">

        <h5 class="heading-primary" style="text-transform: inherit" v-show="collectOrDeliveryPrice === 'collected'"><i class="fas fa-calendar"></i> Collection and Drop Off Dates</h5>

        <p class="red" v-show="collectOrDeliveryPrice === 'collected'"><strong><span class="text-danger">Please Note:</span> You cannot collect or return your cylinder on weekends or bank holiday.</strong></p>

        <h5 class="heading-primary"  style="text-transform: inherit" v-show="collectOrDeliveryPrice === 'delivered'"><i class="fas fa-calendar"></i> Delivery and Pick Up of Your Hire Cylinder</h5>

        <p v-show="collectOrDeliveryPrice === 'delivered'"><strong>Please Note: We cannot deliver or pick up your cylinder on weekends or bank holidays.</strong></p>

        <p>28 days hire is included in the price of this hire cylinder. If you need to keep you hire cylinder for longer than 28 days, we can arrange a hire extension at just &pound;8.95 (inc Vat) per cylinder per additional week. This is calculated automatically depending on the dates you select below.</p>

        <div v-show="collectOrDeliveryPrice === 'collected'">
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="collectStartDate">Date to collect from depot</label>
                        <flat-pickr v-model="collectStartDate" :config="fpOptionsCollectStartDate" class="flatPickr"/>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="collectEndDate">Date to return to depot</label>
                        <flat-pickr v-model="collectEndDate" :config="fpOptionsCollectEndDate" class="flatPickr"/>
                    </div>
                </div>
            </div>

            <div v-show="collectAdditionalWeeks > 0" class="alert alert-warning" role="alert">
                You have chosen dates with <strong>@{{ collectAdditionalDays }} day<span v-show="collectAdditionalDays > 1">s</span></strong> beyond the 28 days hire included in the price. This equals an additional <strong>@{{ collectAdditionalWeeks }} week</strong> charge of <strong>£@{{ collectAdditionalPrice | formatCurrency }}</strong>.
            </div>

            <div v-show="collectDateBeforeWarning" class="alert alert-danger" role="alert">
                <strong><i class="fas fa-exclamation-triangle"></i>Error!</strong> Please make sure that the collect date you have chosen is on a date before the return date.
            </div>

        </div>

        <div class="row" v-show="collectOrDeliveryPrice === 'delivered'">
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="deliveryStartDate">Delivery Date</label>
                    <flat-pickr v-model="deliveryStartDate" :config="fpOptionsDeliveryStartDate" class="flatPickr"/>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="form-group">
                    <label for="deliveryEndDate">Pickup Date</label>
                    <flat-pickr v-model="deliveryEndDate" :config="fpOptionsDeliveryEndDate" class="flatPickr"/>
                </div>
            </div>
            <div class="col">
                <div v-show="deliveryAdditionalWeeks > 0" class="alert alert-warning" role="alert">
                    You have chosen dates with <strong>@{{ deliveryAdditionalDays }} day<span v-show="deliveryAdditionalDays > 1">s</span></strong> beyond the 28 days hire included in the price. This equals an additional <strong>@{{ deliveryAdditionalWeeks }} week</strong> charge of <strong>£@{{ deliveryAdditionalPrice | formatCurrency }} per cylinder</strong>.
                </div>

                <div v-show="deliveryDateBeforeWarning" class="alert alert-danger" role="alert">
                    <strong><i class="fas fa-exclamation-triangle"></i>Error!</strong> Please make sure that the delivery date you have chosen is on a date before the pickup date.
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-5">
        <div v-if="!supplierSelected && collectOrDeliveryPrice === 'collected'">
            <p class="heading-secondary"><strong>You are choosing to collect your cylinder(s). Please search below to find your nearest local depot.</strong></p>

            <div class="form-inline">
                <div class="form-group">
                    <input id="postcodeSearchInput" type="text" class="form-control" v-model="postcode">
                </div>
                <button class="btn btn-primary" v-on:click="searchDepot">Search <span class="hidden-xs">for Nearest Depot</span></button>
            </div>
            <p class="mt-2">Please use your full postcode with the appropriate spacing e.g. LS13 2DN</p>
        </div>

        <div class="card text-center" v-show="supplierSelected && canCollectFromCurrentDepot && collectOrDeliveryPrice === 'collected'">
            <div class="card-body">
                <h5><strong>Your Chosen Supplier</strong></h5>
                <p class="heading-primary"><strong>@{{ supplierSelected.name }}</strong></p>
                <p>@{{ supplierSelected.opening_hours }}</p>
                <p class="heading-secondary">@{{ supplierSelected.distance_miles }} miles from @{{ postcode }}</p>
                <button class="btn btn-sm btn-primary" v-on:click="changeDepot">Change Depot</button>
            </div>
        </div>

        <div class="card text-center" v-show="supplierSelected && !canCollectFromCurrentDepot && collectOrDeliveryPrice === 'collected'">
            <div class="card-body">
                <p class="mt-1 mb-2 text-danger">Not all our depots stock the same cylinders. Unfortunately this means that the current cylinder cannot be collected from your previously chosen depot: <strong class="text-secondary">@{{ supplierSelected.name }}</strong>.</p>
                <p>Click the 'Change Depot' button below to choose a new depot. <span class="text-danger">Please note that this will automatically remove any helium cylinders from your basket that cannot be collected from the new depot that you select</span>.</p>

                <button class="btn btn-sm btn-primary" @click="changeDepot">Change Depot</button>
            </div>
        </div>

        <div v-if="collectOrDeliveryPrice === 'delivered'" class="form-inline">
            <label class="control-label">Qty:&nbsp;&nbsp;</label>
            <div class="form-group">
                <input id="product_quantity" class="form-control" type="number" name="quantity" value="1">
            </div>
            <button v-on:click="addToBasket" class="btn btn-primary">
                <i id="product_cart_button_icon" class="glyphicon glyphicon-shopping-cart"></i> Add To Basket
            </button>
        </div>
    </div>

    <div v-if="collectOrDeliveryPrice === 'collected'" class="col">
        <hr>
        <div class="form-inline">
            <label class="control-label">Qty:&nbsp;&nbsp;</label>
            <div class="form-group">
                <input id="product_quantity" class="form-control" type="number" name="quantity" value="1">
            </div>
            <button v-on:click="addToBasket" class="btn btn-primary">
                <i id="product_cart_button_icon" class="glyphicon glyphicon-shopping-cart"></i> Add To Basket
            </button>
        </div>
    </div>
</div>

@include('partials/searchDepotModal', [ 'showPrice' => true ] )
