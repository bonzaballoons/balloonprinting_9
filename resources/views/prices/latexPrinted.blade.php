@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Latex Custom</strong> Printed Balloons</h1>
    </x-page-header>

    <div id="latexWizard" class="container">

        <printing-wizard
            @change-step="changeStep"
            :active-step="activeStep"
            :price-per-balloon="pricePerBalloon | formatCurrency"
            :price-with-vat="priceWithVat | formatCurrency"
            :price-without-vat="priceWithoutVat | formatCurrency"
            :calculating-price="calculatingPrice"
            :printing-option-selected="printingOptionSelected"
        >
            @include('prices/partials/latexPrinted/number')
            @include('prices/partials/latexPrinted/typeColour')
            @include('prices/partials/latexPrinted/sizeOption')
            @include('prices/partials/latexPrinted/inkColour')
            @include('prices/partials/latexPrinted/artworkDesign')
            @include('prices/partials/latexPrinted/review')
        </printing-wizard>
    </div>

    @include('partials/basketAddedModal')

@endsection
