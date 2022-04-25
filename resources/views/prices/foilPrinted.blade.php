@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Foil</strong> Printed</h1>
    </x-page-header>
    <div id="foilWizard" class="container">

        <printing-wizard
            @change-step="changeStep"
            :active-step="activeStep"
            :price-per-balloon="pricePerBalloon | formatCurrency"
            :price-with-vat="priceWithVat | formatCurrency"
            :price-without-vat="priceWithoutVat | formatCurrency"
            :calculating-price="calculatingPrice"
            :price-not-available="priceNotAvailable"
        >
            @include('prices/partials/foilPrinted/number')
            @include('prices/partials/foilPrinted/typeColour')
            @include('prices/partials/foilPrinted/options')
            @include('prices/partials/foilPrinted/inkColours')
            @include('prices/partials/foilPrinted/artworkDesign')
            @include('prices/partials/foilPrinted/review')
        </printing-wizard>
    </div>

    @include('partials/basketAddedModal')

@endsection
