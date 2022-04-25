@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Frequently</strong> Asked Questions</h1>
    </x-page-header>
    <section class="pt-0 pb-3">
        <div class="container">

            <div class="tabs">
                <ul class="nav nav-tabs">
                    <li class="nav-item active">
                        <a class="nav-link" href="#printing" data-toggle="tab">Printing FAQs</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#helium" data-toggle="tab">Helium FAQs</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div id="printing" class="tab-pane active">
                        <div class="accordion accordion-quaternary" id="printingFAQ">
                            @foreach( $faqs[1]['questionAnswers'] as $key => $questionAnswer)
                            <div class="card card-default">
                                <div class="card-header">
                                    <h4 class="card-title m-0">
                                        <a class="accordion-toggle" data-toggle="collapse" data-parent="#printingFAQ" href="#collapse{{$key}}">
                                            {{ $questionAnswer['question'] }}
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapse{{$key}}" class="collapse show">
                                    <div class="card-body">
                                        <p class="mb-0">{{ $questionAnswer['answer'] }}</p>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>
                    <div id="helium" class="tab-pane">
                        <div class="accordion accordion-quaternary" id="printingFAQ">
                            @foreach( $faqs[0]['questionAnswers'] as $key => $questionAnswer)
                                <div class="card card-default">
                                    <div class="card-header">
                                        <h4 class="card-title m-0">
                                            <a class="accordion-toggle" data-toggle="collapse" data-parent="#printingFAQ" href="#collapse{{$key}}">
                                                {{ $questionAnswer['question'] }}
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapse{{$key}}" class="collapse show">
                                        <div class="card-body">
                                            <p class="mb-0">{{ $questionAnswer['answer'] }}</p>
                                        </div>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </section>

@endsection
