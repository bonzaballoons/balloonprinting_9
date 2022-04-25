@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Privacy</strong> Statement</h1>
    </x-page-header>
    <div class="container">
        <div class="row">
            <div class="col">
                {!! $privacy !!}
            </div>
        </div>
    </div>

@endsection
