@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>The</strong> Sitemap</h1>
    </x-page-header>
    <section class="section section-default section-no-border mt-1">
        <div class="container">

            <div class="row">
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('/') }}">Home</a></li>
                        <li><a href="{{ url('contact') }}">Contact Us</a></li>
                        <li><a href="{{ url('faqs') }}">Frequently Asked Questions</a></li>
                        <li><a href="{{ url('about') }}">About Us</a></li>
                        <li><a href="{{ url('portfolio') }}">Portfolio</a></li>
                        <li><a href="{{ url('privacy') }}">Privacy</a></li>
                        <li><a href="{{ url('terms') }}">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('prices/latex_printed') }}">Printed Latex Price / Wizard</a></li>
                        <li><a href="{{ url('prices/foil_printed') }}">Printed Foil Price / Wizard</a></li>
                        <li><a href="{{ url('prices/helium') }}">Helium Prices</a></li>
                        <li><a href="{{ url('prices/promotional_balloon_in_a_box') }}">Promotional Balloon in a Box Prices</a></li>
                        <li><a href="{{ url('prices/accessories') }}">Accessory Prices</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('info/printing/artwork_specifications') }}">Printing - Artwork Specifications</a></li>
                        <li><a href="{{ url('info/printing/how_we_print_on_balloons') }}">Printing - How We Print On Balloons</a></li>
                        <li><a href="{{ url('info/printing/balloon_colour_charts') }}">Printing - Balloon Colour Charts</a></li>
                        <li><a href="{{ url('info/printing/ink_colour_charts') }}">Printing - Ink Colour Charts</a></li>
                        <li><a href="{{ url('info/printing/sizing_gas_volumes') }}">Printing - Sizing Gas Volumes</a></li>
                    </ul>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('info/helium/overview') }}">Helium - Overview</a></li>
                        <li><a href="{{ url('info/helium/depot_locator') }}">Helium - Depot Locator</a></li>
                        <li><a href="{{ url('info/helium/price_comparison') }}">Helium - Price Comparison</a></li>
                        <li><a href="{{ url('info/helium/safety') }}">Helium - Safety</a></li>
                        <li><a href="{{ url('info/helium/how_much_helium') }}">Helium - How Much Helium</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('info/how_tos') }}">How Tos</a></li>
                        <li><a href="{{ url('info/faqs') }}">Frequently Asked Questions</a></li>
                        <li><a href="{{ url('info/testimonials') }}">Testimonials</a></li>
                        <li><a href="{{ url('info/case_studies') }}">Case Studies</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <ul>
                        <li><a href="{{ url('basket') }}">Basket</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
@endsection
