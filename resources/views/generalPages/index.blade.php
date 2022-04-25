@extends('masterLayout')

@section('content')
    <div class="slider-container rev_slider_wrapper" style="height: 350px;">
        <div id="revolutionSlider" class="slider rev_slider" data-version="5.4.7" data-plugin-revolution-slider data-plugin-options="{'delay': 9000, 'gridwidth': 1170, 'gridheight': 350, 'disableProgressBar': 'on'}">
            <ul>
                <li data-transition="fade">

                    <img src="{{ s3SiteSRC('home_page_banner.jpg') }}" alt="balloon printing home page banner" data-bgposition="center center" data-bgfit="cover" data-bgrepeat="no-repeat" class="rev-slidebg">

                    <div class="tp-caption top-label alternative-font font-weight-bold text-dark" data-x="left" data-hoffset="25" data-y="center" data-voffset="-55" data-start="500" style="z-index: 5;" data-transform_in="y:[-300%];opacity:0;s:500;">WELCOME TO</div>


                    <div class="tp-caption main-label text-dark" data-x="left" data-hoffset="25" data-y="center" data-voffset="-5" data-start="1500" data-whitespace="nowrap" data-transform_in="y:[100%];s:500;"data-transform_out="opacity:0;s:500;" style="z-index: 5; font-size: 50px; text-shadow: -1px -1px 0 #fff,  1px -1px 0 #fff,-1px 1px 0 #fff, 1px 1px 0 #fff;" data-mask_in="x:0px;y:0px;">balloonprinting.co.uk</div>

                    <div class="tp-caption bottom-label font-weight-bold text-dark"
                         data-x="left" data-hoffset="25"
                         data-y="center" data-voffset="40"
                         data-start="2000"
                         style="z-index: 5; font-size: 1.2em;"
                         data-transform_in="y:[100%];opacity:0;s:500;"> For the finest custom printed balloons!</div>

                    <a class="tp-caption btn btn-md btn-primary"
                       data-hash
                       data-hash-offset="85"
                       href="{{ url('prices/latex_printed') }}"
                       data-x="left" data-hoffset="25"
                       data-y="center" data-voffset="85"
                       data-start="2200"
                       data-whitespace="nowrap"
                       data-transform_in="y:[100%];s:500;"
                       data-transform_out="opacity:0;s:500;"
                       style="z-index: 5"
                       data-mask_in="x:0px;y:0px;">Click Here for a Quote</a>

                </li>
            </ul>
        </div>
    </div>

    <section class="section section-default section-no-border mt-0">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-4">
                    <h2 class="mb-1 text-center"><strong>Our</strong> Reviews</h2>
                    <h4 class="mb-2 text-center text-primary">Reviews.co.uk</h4>
                    <div class="text-center">
                        <span class="fa fa-star fa-3x" style="color: orange"></span>
                        <span class="fa fa-star fa-3x" style="color: orange"></span>
                        <span class="fa fa-star fa-3x" style="color: orange"></span>
                        <span class="fa fa-star fa-3x" style="color: orange"></span>
                        <span class="fa fa-star fa-3x" style="color: orange"></span>
                    </div>

                    <h4 class="text-center mt-4"><strong>4.83/5</strong> Rating  &nbsp;&nbsp; <strong>274</strong> Reviews</h4>

                    <p class="mt-4">All testimonials are taken from Reviews.co.uk, an independent review platform and a Google Licensed Review Partner. To see the reviews <a href="https://www.reviews.co.uk/company-reviews/store/balloonprinting-co-uk" target="_blank">click here</a></p>
                </div>
                <div class="col-md-8">
                    <h2 class="mb-4 text-center"><strong>Our</strong> Services</h2>

                    <div class="row">
                        <div class="col-lg-6">
                            <div class="feature-box feature-box-style-2 appear-animation" data-appear-animation="fadeInLeft" data-appear-animation-delay="0">
                                <div class="feature-box-icon">
                                    <i class="fas fa-paint-brush"></i>
                                </div>
                                <div class="feature-box-info">
                                    <h4 class="mb-2">Balloon Printing</h4>
                                    <p class="mb-4">We take your Logo, Artwork or Wording and create Custom Printed Balloons!</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="feature-box feature-box-style-2 appear-animation" data-appear-animation="fadeInLeft" data-appear-animation-delay="0">
                                <div class="feature-box-icon">
                                    <i class="fas fa-truck-loading"></i>
                                </div>
                                <div class="feature-box-info">
                                    <h4 class="mb-2">Helium Hire</h4>
                                    <p class="mb-4">If you want your branded balloons to float you need Helium! Available to buy or rent.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-lg-3">
                        <div class="col-lg-6">
                            <div class="feature-box feature-box-style-2 appear-animation" data-appear-animation="fadeInLeft" data-appear-animation-delay="300">
                                <div class="feature-box-icon">
                                    <i class="fas fa-gift"></i>
                                </div>
                                <div class="feature-box-info">
                                    <h4 class="mb-2">Balloon in a Box</h4>
                                    <p class="mb-4">Send Promotional Balloon in a Box emblazoned with your own logo or brand.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="feature-box feature-box-style-2 appear-animation" data-appear-animation="fadeInLeft" data-appear-animation-delay="300">
                                <div class="feature-box-icon">
                                    <a href="{{ url('info/printing/free_artwork_checking') }}">
                                        <i class="fas fa-palette"></i>
                                    </a>
                                </div>
                                <div class="feature-box-info">
                                    <h4 class="mb-2">
                                        <a href="{{ url('info/printing/free_artwork_checking') }}" class="text-dark">
                                            Free Artwork Checking
                                        </a>
                                    </h4>
                                    <p class="mb-4">
                                        Take advantage of our unique Artwork and Pre-Order Proof Service. <a href="{{ url('info/printing/free_artwork_checking') }}">Click Here</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="pt-0 pb-3">
        <div class="container">
            <div class="row mb-5">
                <div class="col text-center">

                    <div class="row">
                        <div class="col-sm-6">
                            <h2 class="mb-2 float-right"><strong>Our</strong> Work</h2>
                        </div>
                        <div class="col-sm-6">
                            <button type="button" class="btn btn-outline btn-primary btn-md mt-1 mb-2 float-left">See More</button>
                        </div>
                    </div>

                    <p>Take a moment to have a look at some of our recent work below. We’re lucky enough to work with a wide range of customers, from large organisations and small businesses wanting to put their brands on balloons through to Happy Couples who want extra special Wedding Balloons!</p>

                    <div class="lightbox" data-plugin-options="{'delegate': 'a', 'type': 'image', 'gallery': {'enabled': true}}">
                        <div class="masonry-loader masonry-loader-showing">
                            <div class="masonry" data-plugin-masonry data-plugin-options="{'itemSelector': '.masonry-item'}">
                                <div class="masonry-item">
                                    <span class="thumb-info thumb-info-centered-icons thumb-info-no-borders">
                                        <span class="thumb-info-wrapper">
                                            <img src="img/bonza/smackSquare.jpg" class="img-fluid" alt="Giant Smack Printed Balloon">
                                            <span class="thumb-info-action thumb-info-action-custom">
                                                <a href="img/bonza/smackSquare.jpg">
                                                    <span class="thumb-info-icon-custom"></span>
                                                </a>
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="masonry-item w2">
                                    <span class="thumb-info thumb-info-centered-icons thumb-info-no-borders">
                                        <span class="thumb-info-wrapper">
                                            <img src="img/bonza/staryBSquare.jpg" class="img-fluid" alt="Starbucks White & Green Latex Balloon">
                                            <span class="thumb-info-action thumb-info-action-custom">
                                                <a href="img/bonza/staryBSquare.jpg">
                                                    <span class="thumb-info-icon-custom"></span>
                                                </a>
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="masonry-item">
                                    <span class="thumb-info thumb-info-centered-icons thumb-info-no-borders">
                                        <span class="thumb-info-wrapper">
                                            <img src="img/bonza/mamboBalloonsBouquetSquare.jpg" class="img-fluid" alt="Mambo Colourful Balloon Printing">
                                            <span class="thumb-info-action thumb-info-action-custom">
                                                <a href="img/bonza/mamboBalloonsBouquetSquare.jpg">
                                                    <span class="thumb-info-icon-custom"></span>
                                                </a>
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="masonry-item">
                                    <span class="thumb-info thumb-info-centered-icons thumb-info-no-borders">
                                        <span class="thumb-info-wrapper">
                                            <img src="img/bonza/edinburghChildrensHospitalSquare.jpg" class="img-fluid" alt="">
                                            <span class="thumb-info-action thumb-info-action-custom">
                                                <a href="img/bonza/edinburghChildrensHospitalSquare.jpg">
                                                    <span class="thumb-info-icon-custom"></span>
                                                </a>
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="masonry-item">
                                    <span class="thumb-info thumb-info-centered-icons thumb-info-no-borders">
                                        <span class="thumb-info-wrapper">
                                            <img src="img/bonza/mtvFoilSquare.jpg" class="img-fluid" alt="MTV Foil Balloons">
                                            <span class="thumb-info-action thumb-info-action-custom">
                                                <a href="img/bonza/mtvFoilSquare.jpg">
                                                    <span class="thumb-info-icon-custom"></span>
                                                </a>
                                            </span>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="container">
        <div class="row">
            <div class="col-lg-8">
                <h2><strong>Why</strong> BalloonPrinting.co.uk</h2>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-thumbs-up"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">A Superb Print Job</h4>
                                <p class="mb-4">On modern machines with an attention to detail.</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-shipping-fast"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Express Service Available</h4>
                                <p class="mb-4">In case you need your balloons yesterday!</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fab fa-fill-drip"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">High Quality Materials</h4>
                                <p class="mb-4">We use the best balloons and the richest ink.</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-hand-holding-usd"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Value for Money</h4>
                                <p class="mb-4">Advanced and efficient production techniques.</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-award"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Award Winning Customer Service</h4>
                                <p class="mb-4">We pride ourselves on getting it right.</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-laptop"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Order Everything Online</h4>
                                <p class="mb-4">Making it easy for you to get your balloons!</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-truck-loading"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Not Just Printing</h4>
                                <p class="mb-4">A complete service including Helium Hire.</p>
                            </div>
                        </div>
                        <div class="feature-box">
                            <div class="feature-box-icon">
                                <i class="fas fa-palette"></i>
                            </div>
                            <div class="feature-box-info">
                                <h4 class="heading-primary mb-0">Artwork Service</h4>
                                <p class="mb-4">Completely free artwork checking and digital proofs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <h2><strong>Attention</strong> to detail</h2>
                <img src="/img/bonza/homeAttentionDetail.jpg" class="img-thumbnail img-fluid" alt="Staff member checking screen">
            </div>
        </div>
    </div>
@endsection
