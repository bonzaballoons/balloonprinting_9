@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Accessories</strong></h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col-12">
                <p>{{ $menu['desc'] }}</p>
            </div>
            @foreach( $menu['categories'] as $category)
                <div class="col-6 col-sm-4 col-lg-3">
                    <div class="featured-box featured-box-primary featured-box-effect-1" style="height: 250px;">
                        <div class="box-content">
                            <h6 style="height: 40px;">{{ $category['name'] }}</h6>
                            <a href="{{ url($category->urlTo) }}">
                                <img src="{{ s3ImgSRC($category->productImgRef, 100) }}" class="img-fluid" alt="{{ $category->name }} overview">
                            </a>
                            <p><a href="{{ url($category->urlTo) }}" class="lnk-primary learn-more">See Prices <i class="fas fa-angle-right"></i></a></p>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection
