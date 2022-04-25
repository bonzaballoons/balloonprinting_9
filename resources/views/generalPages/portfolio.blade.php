@extends('masterLayout')

@section('content')
    <x-page-header>
        <h1><strong>Our</strong> Portfolio</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                <p class="text-center">Please see a collection of some of our favourite work in the below galleries.</p>
            </div>
        </div>

        <div class="row justify-content-center mt-4">
            <div class="col-lg-4 mx-auto">
                <h4 class="text-center"><strong>Latex</strong> Gallery</h4>
                <div class="thumb-gallery">
                    <div class="owl-carousel owl-theme manual thumb-gallery-detail show-nav-hover" id="thumbGalleryDetail1">
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/whittardFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/happyBirthdaySweetieFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/nichollsSaleFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/starbucksFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/elsecarFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/spiritPortfolio.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/mamFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/nicolaJRowleyFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block">
                                <img alt="Project Image" src="{{ asset('img/bonza/westYorkshireFireFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                    </div>
                    <div class="owl-carousel owl-theme manual thumb-gallery-thumbs mt" id="thumbGalleryThumbs1">
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/whittardFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/happyBirthdaySweetieFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/nichollsSaleFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/starbucksFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/elsecarFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/spiritPortfolio.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/mamFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/nicolaJRowleyFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                        <div>
                            <span class="img-thumbnail d-block cur-pointer">
                                <img alt="Project Image" src="{{ asset('img/bonza/westYorkshireFireFooter.jpg') }}" class="img-fluid">
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {{--<div class="col-lg-4 mx-auto">--}}
                {{--<h4 class="text-center"><strong>Foil</strong> Gallery</h4>--}}
                {{--<div class="thumb-gallery">--}}
                    {{--<div class="owl-carousel owl-theme manual thumb-gallery-detail show-nav-hover" id="thumbGalleryDetail2">--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                    {{--</div>--}}
                    {{--<div class="owl-carousel owl-theme manual thumb-gallery-thumbs mt" id="thumbGalleryThumbs2">--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/ribenaFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                        {{--<div>--}}
                            {{--<span class="img-thumbnail d-block cur-pointer">--}}
                                {{--<img alt="Project Image" src="{{ asset('img/bonza/carvingMemoriesFooter.jpg') }}" class="img-fluid">--}}
                            {{--</span>--}}
                        {{--</div>--}}
                    {{--</div>--}}
                {{--</div>--}}
            {{--</div>--}}
        </div>

    </div>

@endsection
