<div class="row">
    <div class="col-md-7">
        <p class="text-center">{!! $product['details'][0]->desc !!}</p>

        <h4 class="text-center"><span id="product_unit_span">Unit</span> Price: £{{ number_format( $product['details'][0]->unit_price, 2 ) }}</h4>
    </div>
    <div class="col-md-5">
        <img class="img-fluid d-block mx-auto" src="{{ s3ImgSRC($product->ref_num, 300) }}" alt="{{ $product['details'][0]->name }} Product Display">
    </div>
</div>

<hr>

@if( count( $product['optionChoices'] ) > 0  )
    <div class="row">
        <div class="col-md-6">
            <label class="label_slim" for="{{ $product['optionChoices'][0]->id }}">Select a delivery option for the disposable helium:</label>
            <select id="deliveryOptionSelect" name="deliveryOption" class='form-control'>
                @foreach ($product['optionChoices'][0]['items'] as $choice)
                    @if($choice->price == 0)
                        <option value="{{ $choice->id }}">{{ $choice->name }}</option>
                    @else
                        <option value="{{ $choice->id }}">&pound;{{ number_format($choice->price, 2) }} - {{ $choice->name }}</option>
                    @endif
                @endforeach
            </select>
            <br>
        </div>
        <div class="col-md-6">
            <label class="control-label">Quantity:</label>
            <div class="form-group form-inline">
                <input id="product_quantity" class="form-control" type="number" name="quantity" value="1">
                &nbsp;
                <button id="addProductButton" class="btn btn-primary"> <i id="product_cart_button_icon" class="glyphicon glyphicon-shopping-cart"></i> Add To Basket</button>
            </div>
        </div>
    </div>
@else
    <div class="row">
        <div class="col-md-6">
            <label class="control-label">Quantity:</label>
            <div class="form-group form-inline">
                <input id="product_quantity" class="form-control" type="number" name="quantity" value="1">
                &nbsp;
                <button id="addProductButton" class="btn btn-primary"> <i id="product_cart_button_icon" class="glyphicon glyphicon-shopping-cart"></i> Add To Basket</button>
            </div>
        </div>
    </div>
@endif