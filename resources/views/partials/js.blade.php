<!-- Vendor -->

{{--<script>--}}
    {{--window.Laravel = {!! json_encode([--}}
            {{--'csrfToken' => csrf_token(),--}}
        {{--]) !!};--}}
{{--</script>--}}

@if( isset($loadStripe) )
    <script src="https://js.stripe.com/v3/"></script>
@endif

<script src="https://cdn.jsdelivr.net/gh/Wruczek/Bootstrap-Cookie-Alert@gh-pages/cookiealert.js"></script>

<script>window.sitePhone = '{{ env('SITE_PHONE_NUMBER') }}'</script>

<script src="{{ mix('js/app.js') }}"></script>

@if( isset($page_js) )
    @foreach($page_js as $js)
        <script src="{{ mix('js/'.$js.'.js') }}" type="text/javascript"></script>
    @endforeach
@endif

{{--<script src="{{ asset('vendor/jquery/jquery.min.js') }}"></script>--}}
<script src="{{ asset('vendor/jquery.appear/jquery.appear.min.js') }}"></script>
<script src="{{ asset('vendor/jquery.easing/jquery.easing.min.js') }}"></script>
{{--<script src="{{ asset('vendor/jquery-cookie/jquery-cookie.min.js') }}"></script>--}}
<script src="{{ asset('vendor/popper/umd/popper.min.js') }}"></script>
<script src="{{ asset('vendor/bootstrap/js/bootstrap.min.js') }}"></script>

<script src="{{ asset('vendor/common/common.min.js') }}"></script>
{{--<script src="{{ asset('vendor/jquery.validation/jquery.validation.min.js') }}"></script>--}}
{{--<script src="{{ asset('vendor/jquery.easy-pie-chart/jquery.easy-pie-chart.min.js') }}"></script>--}}
{{--<script src="{{ asset('vendor/jquery.gmap/jquery.gmap.min.js') }}"></script>--}}
<script src="{{ asset('vendor/jquery.lazyload/jquery.lazyload.min.js') }}"></script>
<script src="{{ asset('vendor/isotope/jquery.isotope.min.js') }}"></script>
<script src="{{ asset('vendor/owl.carousel/owl.carousel.min.js') }}"></script>
<script src="{{ asset('vendor/magnific-popup/jquery.magnific-popup.min.js') }}"></script>
{{--<script src="{{ asset('vendor/vide/vide.min.js') }}"></script>--}}

<!-- Theme Base, Components and Settings -->
<script src="{{ asset('js/theme.js') }}"></script>

<!-- Current Page Vendor and Views -->
<script src="{{ asset('vendor/rs-plugin/js/jquery.themepunch.tools.min.js') }}"></script>
<script src="{{ asset('vendor/rs-plugin/js/jquery.themepunch.revolution.min.js') }}"></script>

<!-- Theme Custom -->
<script src="{{ asset('js/custom.js') }}"></script>

<!-- Theme Initialization Files -->
<script src="{{ asset('js/theme.init.js') }}"></script>

<script src="{{ asset('js/examples/examples.gallery.js') }}"></script>
