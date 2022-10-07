<header id="header" data-plugin-options="{'stickyEnabled': true, 'stickyEnableOnBoxed': true, 'stickyEnableOnMobile': true, 'stickyStartAt': 55, 'stickySetTop': '-55px', 'stickyChangeLogo': true}">
    <div class="header-body">
        <div class="header-container container">
            <div class="header-row">
                <div class="header-column">
                    <div class="header-row">
                        <div class="header-logo">
                            <a href="{{ url('/') }}">
                                <img alt="balloon printing logo" width="75" height="75" data-sticky-width="60" data-sticky-height="60" data-sticky-top="30" src="{{ asset('img/bonza/logo.png') }}">
                            </a>
                        </div>
                    </div>
                </div>
                <div class="header-column justify-content-end">
                    <div class="header-row pt-3">
                        <nav class="header-nav-top">
                            <ul class="nav nav-pills">
                                <li class="nav-item d-none d-sm-block">
                                    <span class="ws-nowrap"><i class="fas fa-phone"></i> {{ env('SITE_PHONE_NUMBER') }}</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div class="header-row">
                        <div class="header-nav">
                            <div class="header-nav-main header-nav-main-effect-1 header-nav-main-sub-effect-1">
                                <nav class="collapse">
                                    <ul class="nav nav-pills" id="mainNav">
                                        <li style="padding: 7px 0;">
                                            <a class="{{ isset($navLink) && $navLink === 'home' ? 'active' : '' }}" href="{{ url('/') }}">
                                                Home
                                            </a>
                                        </li>
                                        <li class="dropdown" style="padding: 7px 0;">
                                            <a class="dropdown-item dropdown-toggle {{ isset($navLink) && $navLink === 'prices' ? 'active' : '' }}" href="#">
                                                Prices
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="{{ url('prices/latex_printed') }}">Latex Custom Printed Balloons</a></li>
                                                <li><a class="dropdown-item" href="{{ url('prices/foil_printed') }}">Foil Helium Printed Balloons.</a></li>
                                                <li><a class="dropdown-item" href="{{ url('prices/giant_latex_printed') }}">Giant Latex Printed Balloons.</a></li>
                                                <li><a class="dropdown-item" href="{{ url('prices/helium') }}">Helium Hire or Buy</a></li>
                                                {{--<li><a class="dropdown-item" href="{{ url('prices/promotional_balloon_in_a_box') }}">Promotional Balloon in a Box</a></li>--}}
                                                <li><a class="dropdown-item" href="{{ url('prices/accessories') }}">Accessories</a></li>
                                            </ul>
                                        </li>
                                        <li class="dropdown" style="padding: 7px 0;">
                                            <a class="dropdown-item dropdown-toggle  {{ isset($navLink) && $navLink === 'information' ? 'active' : '' }}" href="#">
                                                Information
                                                <i class="fas fa-caret-down"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li class="dropdown-submenu">
                                                    <a class="dropdown-item" href="#">Balloon Printing<i class="fas fa-caret-down"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/artwork_guidelines') }}">Artwork Guidelines</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/free_artwork_checking') }}">Free Artwork Checker</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/how_we_print_on_balloons') }}">How We Print on Balloons</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/balloon_colour_charts') }}">Balloon Colour Charts</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/ink_colour_charts') }}">Ink Colours and Contrasts</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/printing/sizing_gas_volumes') }}">Balloon Sizing and Gas Volumes</a></li>
                                                    </ul>
                                                </li>
                                                <li class="dropdown-submenu">
                                                    <a class="dropdown-item" href="#">Balloon Helium<i class="fas fa-caret-down"></i></a>
                                                    <ul class="dropdown-menu">
                                                        <li><a class="dropdown-item" href="{{ url('info/helium/overview') }}">Overview</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/helium/depot_locator') }}">Helium Click & Collect Depot Locator</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/helium/price_comparison') }}">Price Comparison</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/helium/safety') }}">Safety</a></li>
                                                        <li><a class="dropdown-item" href="{{ url('info/helium/how_much_helium') }}">How much Helium do I need?</a></li>
                                                    </ul>
                                                </li>
                                                <li><a class="dropdown-item" href="{{ url('info/faqs') }}">FAQs</a></li>
                                                {{--<li><a class="dropdown-item" href="{{ url('info/how_tos') }}">How To's</a></li>--}}
                                                <li><a class="dropdown-item" href="{{ url('info/testimonials') }}">Testimonials</a></li>
                                                <li><a class="dropdown-item" href="{{ url('info/case_studies') }}">Case Studies</a></li>
                                            </ul>
                                        </li>
                                        <li style="padding: 7px 0;">
                                            <a href="{{ url('about') }}" class="{{ isset($navLink) && $navLink === 'about' ? 'active' : '' }}">
                                                about us
                                            </a>
                                        </li>
                                        <li style="padding: 7px 0;">
                                            <a href="{{ url('portfolio') }}" class="{{ isset($navLink) && $navLink === 'portfolio' ? 'active' : '' }}">
                                                portfolio
                                            </a>
                                        </li>
                                        <li style="padding: 7px 0;">
                                            <a href="{{ url('contact') }}" class="{{ isset($navLink) && $navLink === 'contact' ? 'active' : '' }}">
                                                Contact
                                            </a>
                                        </li>
                                        <li style="padding: 7px 0;">
                                            <a href="{{ url('basket') }}" class="{{ isset($navLink) && $navLink === 'basket' ? 'active' : '' }}">
                                                Basket (<span id="basketNumberItems">{{ $basketNumberItems }}</span>)
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <ul class="header-social-icons social-icons-custom d-none d-sm-block">
                                <li>
                                    <a href="https://www.instagram.com/balloonprinting/" class="instagram_icon" target="_blank" title="Instagram">
                                        <i class="fab fa-instagram"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.linkedin.com/company/balloonprinting/" class="linkedin_icon" target="_blank" title="LinkedIn">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                </li>
                            </ul>
                            <button class="btn header-btn-collapse-nav" data-toggle="collapse" data-target=".header-nav-main nav">
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>
{{--<div class="alert alert-danger text-center mb-0" role="alert">Our printing studio is now closed for the Christmas holidays. We are back on Wednesday 2nd January so book online for printing slots with delivery Thursday 3rd January onwards.</div>--}}
<div id="international_banner" class="bg-info p-4">
    <h5 class="mb-0 text-white text-center">We deliver all over Europe and the rest of the world at no extra cost! &nbsp;&nbsp;<small>* excludes helium</small></h5>
</div>
