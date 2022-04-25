@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Terms</strong> & Conditions</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                {!! $terms !!}
            </div>
        </div>
    </div>

@endsection
