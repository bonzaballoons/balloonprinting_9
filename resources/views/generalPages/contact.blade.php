@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Contact</strong> Us</h1>
    </x-page-header>
    <div class="container">

        <div class="row">
            <div class="col-lg-6">

                @if( !empty( $errors->all() ) )
                    <p>There are some problems with your contact form. Please fix them and submit the form again.</p>
                    @foreach( $errors->all() as $error )
                        <div class="alert alert-danger mt-1" id="contactError">
                            <strong>Error!</strong> {{ $error }}
                        </div>
                    @endforeach
                @endif

                <form id="contactForm" action="{{ url('contactThankYou') }}" method="POST">

                    {{ csrf_field() }}

                    <div class="form-row">
                        <div class="form-group col-lg-12">
                            <label for="customer_name">Your Name <span class="text-danger">*</span></label>
                            <input type="text" id="customer_name" name="customer_name" class="form-control" value="{{ old('customer_name') }}" required>
                            <input type="text" id="customer_title" name="customer_title" class="form-control" value="{{ old('customer_title') }}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-lg-6">
                            <label for="customer_email">Your Email Address <span class="text-danger">*</span></label>
                            <input type="email" id="customer_email" name="customer_email" value="{{ old('customer_email') }}" class="form-control" required>
                        </div>
                        <div class="form-group col-lg-6">
                            <label for="customer_phone">Phone Number <span class="text-danger">*</span></label>
                            <input type="text" id="customer_phone" name="customer_phone" value="{{ old('customer_phone') }}" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="customer_message">Message <span class="text-danger">*</span></label>
                            <textarea id="customer_message" name="customer_message" rows="10" class="form-control">{{ old('customer_message') }}</textarea>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col">
                            <input type="submit" value="Send Message" class="btn btn-primary btn-lg">
                            <span class="required"> &nbsp;<b class="text-danger">*</b> Required Field</span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-lg-6">

                <h4 class="heading-primary mt-1">Get in <strong>Touch</strong></h4>
                <p>Please note that this is our central office only and you cannot pick helium or printing products directly from here. To find our nearest helium depot to you, please search <a href="{{ url('info/helium/depot_locator') }}">here</a>.</p>

                <hr>

                <h4 class="heading-primary">Our <strong>Office</strong></h4>

                <ul class="list list-icons list-icons-style-3 mt-4">
                    <li><i class="fas fa-map-marker-alt"></i> <strong>Address:</strong> Unit 6, Hilltop Commercial Centre, Houghley Lane, Leeds, LS13 2DN</li>
                    <li><i class="fas fa-phone"></i> <strong>Phone:</strong> {{ env('SITE_PHONE_NUMBER') }}</li>
                    <li><i class="fas fa-phone"></i> <strong>Int:</strong> {{ env('SITE_INT_PHONE_NUMBER') }}</li>
                    <li><i class="far fa-envelope"></i> <strong>Email:</strong> <a href="mailto:info@balloonprinting.co.uk">info@balloonprinting.co.uk</a></li>
                </ul>

                <hr>

                <h4 class="heading-primary">Business <strong>Hours</strong></h4>
                <ul class="list list-icons list-dark mt-4">
                    <li><i class="far fa-clock"></i> Monday to Friday - 9am to 5pm</li>
                    <li><i class="far fa-clock"></i> Saturday / Sunday - Closed</li>
                </ul>

            </div>

        </div>

    </div>

@endsection
