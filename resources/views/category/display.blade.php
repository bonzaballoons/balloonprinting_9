@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>{{ $category->name }}</strong> Prices</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <p>{{ $category->desc }}</p>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-9">
                <div class="row">
                    @foreach( $category->products as $product )
                        <div class="col-6 col-sm-4 col-lg-3">
                            <div class="featured-box featured-box-primary featured-box-effect-1" style="height: 280px;">
                                <div class="box-content" style="padding: 20px 10px 10px 10px;">
                                    <h6 class="mt-0" style="height: 50px;">{{ $product->name }}</h6>
                                    <a href="{{ url($product->urlTo) }}">
                                        <img src="{{ s3ImgSRC($product->ref_num, 100) }}" class="img-fluid" alt="{{ $product->name }} overview">
                                    </a>
                                    <h5 class="mt-3 mb-1">£{{ number_format($product->price, 2) }}</h5>
                                    <p><a href="{{ url($product->urlTo) }}" class="lnk-primary learn-more">See Details <i class="fas fa-angle-right"></i></a></p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
            <div class="col-lg-3">
                <aside class="sidebar">
                    <h5 class="heading-primary text-center mt-4">Other Accessory Prices</h5>
                    <ul class="simple-post-list">
                        @foreach( $accessory_categories as $category)
                            <li>
                                <div class="post-image">
                                    <div class="img-thumbnail d-block">
                                        <a href="{{ url($category->urlTo) }}">
                                            <img alt="{{ $category->name }} Prices" width="60" height="60" class="img-fluid" src="{{ s3ImgSRC($category->productImgRef, 100) }}">
                                        </a>
                                    </div>
                                </div>
                                <div class="post-info">
                                    <a class="mt-3 mb-1 d-block" href="{{ url($category->urlTo) }}">{{ $category->name }}</a>
                                    <div class="post-meta">
                                        <a style="color: grey" href="{{ url($category->urlTo) }}">Click Here To See Prices</a>
                                    </div>
                                </div>
                            </li>
                        @endforeach
                    </ul>
                </aside>
            </div>
        </div>

    </div>

@endsection
