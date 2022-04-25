@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>{{ $product['details'][0]->name }}</strong></h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="tabs">
                    <ul class="nav nav-tabs">
                        <li class="nav-item active">
                            <a href="#flat" class="nav-link" data-toggle="tab">Overview</a>
                        </li>
                        @if( isset( $relatedProducts ) )
                            <li class="nav-item">
                                <a href="#otherProds" class="nav-link" data-toggle="tab">
                                    <span class="hidden-xs">Other Products in this Category</span>
                                    <span class="visible-xs">Related</span>
                                </a>
                            </li>
                        @endif
                    </ul>

                    <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="flat">
                        <br>
                        @include('product.partials.flatPack')
                    </div>

                    @if( isset( $relatedProducts ) )
                        <div role="tabpanel" class="tab-pane" id="otherProds">

                            <br>

                            <div class="flex_container flex_category_box">

                                @foreach($relatedProducts as $product)

                                    <div class="product_list_box text-center">
                                        <h6><a href="{{ url('product/'.snake_case($product->details[0]->name).'/'.$product->id) }}">{{ $product->details[0]->name }}</a></h6>
                                        <a href="{{ url('product/'.snake_case($product->details[0]->name).'/'.$product->id) }}">
                                            <img src="{{ s3ImgSRC($product->ref_num) }}" class="img-responsive center-block" alt="{{ $product->details[0]->name }} product link">
                                        </a>
                                        <a class="btn btn-primary btn-sm" href="{{ url('product/'.snake_case($product->details[0]->name).'/'.$product->id) }}">More Info <i class=""></i></a>
                                    </div>

                                @endforeach

                                <div class="flex_dummy"></div>
                                <div class="flex_dummy"></div>
                                <div class="flex_dummy"></div>
                                <div class="flex_dummy"></div>

                            </div>

                        </div>
                    @endif
                </div>
                </div>
            </div>
        </div>
    </div>

    @include('partials/basketAddedModal')
@stop
