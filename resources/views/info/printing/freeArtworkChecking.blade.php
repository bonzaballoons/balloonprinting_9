@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Free</strong> Artwork Checking</h1>
    </x-page-header>
    <div id="artworkChecker" class="container">

        <p>So that you can be sure that your artwork is suitable for printing onto balloons, we provide a free artwork checking service.  Just upload your artwork below and we'll get our graphic designers to take a look at it. We'll try to get back to you on the same day, or the next if we're a little busy.</p>
        <hr>

        <div v-if="artworkCheckSentSuccess" class="alert alert-success text-center">
            Thank You. Your artwork has been sent to our team for review. We'll get back to you ASAP.
        </div>
        <div v-else>
            <div class="row">
                <div class="col-md-6">

                    <h5 class="text-danger text-center header-lowercase mb-3">Please add your name and email below</h5>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group" :class="{ 'has-error': !name }">
                                <label for="checkerEmail">Name:</label>
                                <input id="checkerEmail" v-model="name" class="form-control" type="text">
                                <br>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group" :class="{ 'has-error': !email }">
                                <label for="email">Email Address:</label>
                                <input id="email" v-model="email" class="form-control" type="email">
                                <br>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">

                    <h5 v-show="!uploadedArtwork.length" class="text-danger text-center header-lowercase mb-3">Please add some artwork by clicking the button below</h5>

                    <div v-show="uploadedArtwork.length" class="mb-3">
                        <h5 class="text-danger text-center header-lowercase mb-3">Files / Artwork Uploaded:</h5>
                        <hr>
                        <table class="table table-bordered text-left">
                            <tr v-for="(artwork, index) in uploadedArtwork">
                                <td>@{{ artwork.name }}</td>
                                <td class="text-right">
                                    <button class="btn btn-danger btn-xs" @click="removeArtwork(artwork)">
                                        delete this item
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p v-show="uploadedArtwork.length" class="text-center"><small class="text-danger">Upload another image by clicking button below</small></p>
                    <uppy @add-artwork="addArtwork" :inline="false"></uppy>

                </div>
            </div>

            <div v-show="uploadedArtwork.length">
                <hr>
                <button v-if="!sendingArtworkCheck" type="button" class="btn btn-lg btn-primary mx-auto d-block"  @click="sendArtworkCheck()">Send Artwork Check</button>
                <p v-else>Please Wait... Sending Check</p>
            </div>
        </div>
    </div>

@endsection
