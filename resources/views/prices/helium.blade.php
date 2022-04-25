@extends('masterLayout')

@section('content')
    <x-page-header>
        <h1><strong>Helium</strong> Hire</h1>
    </x-page-header>
    <div class="container">

        <div class="row">
            <div class="col">
                <h4><strong>Hire</strong> Canisters</h4>
                <p>{{ $hireDescription }}</p>
            </div>
        </div>

        <div class="pricing-table pricing-table-sm row no-gutters mt-2 mb-2">

            @foreach( $hireCylinders as $key => $cylinder)
                <div class="col-sm-4 col-lg-2">
                    <div class="plan {{ $key === 0 ? 'most-popular' : ''}}">
                        @if( $key === 0)
                            <div class="plan-ribbon-wrapper"><div class="plan-ribbon">Popular</div></div>
                        @endif
                        <h3>
                            {{ $cylinder->name }}
                            <em class="desc">Up To <strong>{{ $cylinder->balloonsCanFill }}</strong> 9" Balloons</em>
                            <span style="font-size: 13px; line-height: 60px;">£{{ $cylinder->lowestCollectPrice }}</span>
                        </h3>
                        <a class="btn btn-primary" href="{{ url('product/'.snake_case($cylinder->name).'/'.$cylinder->id) }}">Details</a>
                    </div>
                </div>
            @endforeach

        </div>

        <p><span class="text-danger">*</span> Please note that price below represents the lowest price available. Prices vary from depot to depot, so please make sure that you check to see if you can get a lower price. We have many depots throughout the UK for our hire cylinders, so It's often not difficult to find the cheaper price.</p>

        <div class="row">
            <div class="col">
                <hr class="tall mt-0">
                <h4><strong>Disposable </strong> Canisters</h4>
                <p>{{ $disposableDescription }}</p>
            </div>
        </div>

        <div class="pricing-table pricing-table-sm row no-gutters mt-2 mb-2">

            @foreach( $disposableCylinders as $key => $cylinder)
                <div class="col-sm-4 col-lg-2">
                    <div class="plan {{ $key === 3 ? 'most-popular' : ''}}">
                        @if( $key === 3)
                            <div class="plan-ribbon-wrapper"><div class="plan-ribbon">Popular</div></div>
                        @endif
                        <h3>
                            {{ $cylinder->name }}
                            <em class="desc">Up To <strong>{{ $cylinder->canFill9InchBalloons }}</strong> 9" Balloons</em>
                            <span style="font-size: 13px; line-height: 60px;">£{{ $cylinder->unit_price }}</span>
                        </h3>
                        <a class="btn btn-primary" href="{{ url('product/'.snake_case($cylinder->name).'/'.$cylinder->id) }}">Details</a>
                    </div>
                </div>
            @endforeach

        </div>

    </div>

@endsection
