<!DOCTYPE html>
<html>
@include('partials/head')
<body>
@include('googletagmanager::body')
<div class="body">

    @include('partials/header')

    <div role="main" class="main">
        @yield('content')
    </div>

    <div class="modal fade" id="whatsAppModal" tabindex="-1" role="dialog" aria-labelledby="smallModalLabel" style="display: none;" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="smallModalLabel">Contact Us On WhatsApp</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <ul class="list list-icons list-icons-style-3 mt-4">
                        <li><i class="fab fa-whatsapp whatsapp_icon"></i> <strong>WhatsApp Number:</strong> +44 07422 523391</li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    @include('partials/footer')

</div>

@include('partials/js')

</body>
</html>