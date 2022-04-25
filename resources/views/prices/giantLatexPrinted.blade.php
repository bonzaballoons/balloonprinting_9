@extends('masterLayout')

@section('content')

    <x-page-header>
        <h1><strong>Giant Latex Custom</strong> Printed Balloons</h1>
    </x-page-header>
    <div id="giantLatexWizard" class="container">
        <div class="row">
            <div class="col-md-8 text-center">
                <h4 class="heading-tertiary mb-3">Find a price or order online by using the wizard below</h4>
                <p>These huge personalised or branded balloons will create a huge impact at your event. Especially effective at outdoor events or festivals where large crowds will all be able to see them, they are also spectacular inside large indoor spaces such as music halls or wedding venues.</p>
                <p>Available in a wide range of vibrant or luxury pearlescent finishes in a 2 foot or 3 foot diameter balloon size.</p>
                <p class="text-danger mb-2">Please note that it takes 5 working days to turnaround giant custom latex printed balloons, so please order well in advance of your event. It is possible that we may be able to do the job more quickly, but you will need to give us a call to check. Thank You</p>
                {{--<p class="text-danger">The next available delivery date is: <strong class="text-dark">add date</strong></p>--}}
            </div>
            <div class="col-md-4">
                <img class="img-fluid img-thumbnail" src="{{ url('img/bonza/giantLatexBalloon.jpg') }}" alt="Giant Printed Latex Balloon">
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-4">
                <h4 class="text-center heading-tertiary mb-3 header-lowercase">Choose Your Options</h4>
                <div class="form-group">
                    <label for="numberBalloons">Number Of Balloons</label>
                    <input v-model="numberBalloons" type="number" class="form-control" title="numberBalloons">
                </div>

                <div class="form-group">
                    <label for="balloonSize">Balloon Size</label>
                    <select title="balloonSize" class="form-control" v-model="sizeOptionSelected">
                        <option v-for="sizeOption in sizeOptions" :value="sizeOption.size">
                            @{{ sizeOption.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="sideOptions">Printing Options</label>
                    <select title="sideOptions" class="form-control" v-model="sideOptionSelected">
                        <option v-for="sideOption in sideOptions" :value="sideOption.sides">
                            @{{ sideOption.name }}
                        </option>
                    </select>
                </div>

                <label for="artworkInkColour">Ink Colour: </label>
                <div class="form-row align-items-center">
                    <div class="col-auto">
                        <input id="artworkInkColour" class="form-control mb-2" v-model="artworkInkColour" readonly>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary mb-2" data-toggle="modal" data-target="#inkColourChangeModal">Change</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <hr class="d-block d-md-none">
                <h4 class="text-center heading-tertiary mb-4 header-lowercase">Choose Your Colours</h4>

                <div class="form-group">
                    <select title="balloonSize" class="form-control" v-model="giantLatexTypeSelected">
                        <option v-for="type in giantLatexTypes" :value="type">
                            @{{ type.name }}
                        </option>
                    </select>
                </div>

                <p class="smaller">You can add as many colours as you'd like, free of charge. Just click one of the squares below to begin.</p>
                <div class="d-flex flex-wrap justify-content-around">
                    <div v-for="colour in this.giantLatexTypeSelected.colours" :style="{ 'background-color': colour.cssColour }" class="colour_pick_square" @click="showColourPreview(colour)"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                </div>

                <h5 class="heading-primary header-lowercase text-center mt-4">
                    <strong><i class="fas fa-angle-down heading-secondary"></i> Review your colours</strong>
                </h5>

                <div v-if="!chosenColoursDisplay.length" class="alert alert-warning text-center" role="alert"><strong>Please select some balloon colours</strong></div>

                <h6 v-if="chosenColoursDisplay.length" class="text-center">
                    Chosen Colours From The @{{ colourTypeChosen.name }} Range
                </h6>

                <div class="d-flex flex-wrap justify-content-around">

                    <div v-for="colour in chosenColoursDisplay" :style="{ 'background-color': colour.cssColour }" class="colour_pick_square" @click="showColourPreview(colour, 'removeOption', true)"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                    <div class="flex_colour_pick_square_dummy"></div>
                </div>

                <p v-if="chosenColoursDisplay.length" class="smaller text-center mt-2 mb-0 text-danger">Click one of the squares above to view or remove the balloon.</p>
            </div>
            <div class="col-md-4">

                <hr class="d-block d-md-none">

                <h4 class="text-center heading-tertiary mb-4 header-lowercase">Artwork Design Options</h4>

                <h5 class="text-center header-lowercase mt-1 mb-3 heading-primary ">
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Upload your artwork by clicking the button below
                </h5>

                <uppy @add-artwork="addArtwork" :inline="false" :inline-height="false"></uppy>

                <div v-show="uploadedArtwork.length">
                    <hr>
                    <h5 class="text-center heading-primary header-lowercase"><strong>Files / Artwork Uploaded:</strong></h5>
                    <table class="table table-bordered">
                        <tr v-for="(artwork, index) in uploadedArtwork">
                            <td>@{{ artwork.name }}</td>
                            <td class="text-right">
                                <button class="btn btn-danger btn-xs" @click="removeArtwork(artwork)">
                                    delete
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <h5 class="text-center header-lowercase mt-4 mb-3 heading-primary">
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Or, if you'd just like text printed on the balloons
                </h5>

                <p class="text-center mt-0 mb-0 smaller">Describe what text you'd like to print on the balloon and any specific layout requirements</p>
                <textarea title="artworkText"  class="form-control" rows="3" name="artworkText" v-model="artworkText"></textarea>

                <p class="text-center mt-3 mb-0 smaller">Font to use</p>
                <input title="artworkFont" type="text" class="form-control" name="artworkFont" v-model="artworkFont">
            </div>
        </div>
        <hr>
        <div class="row justify-content-center">
            <div class="col-md-4 text-center">
                <br>
                <div v-if="!calculatingPrice">
                    <h5 class="header-lowercase mt-0">
                        Price Per Balloon: <strong class="heading-tertiary">£@{{ pricePerBalloon | formatCurrency }}</strong>
                    </h5>
                    <h4>Total:
                        <strong class="heading-tertiary">
                            £@{{ priceWithVat | formatCurrency }}
                        </strong> (exc VAT: <strong class="heading-tertiary">£@{{ priceWithoutVat | formatCurrency }}</strong>)
                    </h4>
                    <button @click="addToBasket()" class="btn btn-primary m-1">Add To Basket</button>
                </div>
                <p v-else>Please Wait Calculating Price</p>
            </div>
        </div>


        {{--Modals--}}
        <div class="modal fade" id="colourPickerInfo" tabindex="-1" role="dialog" aria-labelledby="colourPickerInfoLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="colourPickerInfoLabel">
                            <span v-if="!colourRemoveOption">Add</span><span v-else=>Remove</span> Colour - <span v-if="colourSelected">@{{ colourSelected.name }}</span>
                        </h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div class="modal-body text-center">
                        <div v-if="colourSelected">
                            <img class="img-responsive" :src="displayImgSrc" :alt="colourSelected.name">
                        </div>
                        <div v-if="!chosenColoursMatchTypeChosen" class="alert alert-warning text-center mt-4 smaller" role="alert">
                            You cannot mix balloons from different colour ranges. <a href="javascript:" @click="removeAllColoursChosen()">Click here</a> to remove balloons from the <strong>@{{ colourTypeChosen.name }}</strong> range, so that you can add colours from the <strong>@{{ giantLatexTypeSelected.name }}</strong> range.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button v-if="!colourRemoveOption && chosenColoursMatchTypeChosen" @click="addColour()" type="button" class="btn btn-primary">Add to your selection</button>
                        <button v-if="colourRemoveOption" @click="removeColour()" type="button" class="btn btn-danger">Remove colour</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="inkColourChangeModal" tabindex="-1" role="dialog" aria-labelledby="inkColourChangeModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="inkColourChangeModalLabel">Change The Artwork Ink Colour</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-2">Click on one of the below commonly chosen colours.</p>
                        <button @click="addInkColour('Black')" class="btn btn-sm btn-primary m-1">Black</button>
                        <button @click="addInkColour('White')" class="btn btn-sm btn-primary m-1">White</button>
                        <button @click="addInkColour('Red')" class="btn btn-sm btn-primary m-1">Red</button>
                        <button @click="addInkColour('Dark Blue')" class="btn btn-sm btn-primary m-1">Dark Blue</button>
                        <button @click="addInkColour('Blue')" class="btn btn-sm btn-primary m-1">Blue</button>
                        <button @click="addInkColour('Orange')" class="btn btn-sm btn-primary m-1">Orange</button>
                        <button @click="addInkColour('Yellow')" class="btn btn-sm btn-primary m-1">Yellow</button>
                        <button @click="addInkColour('Green')" class="btn btn-sm btn-primary m-1">Green</button>
                        <button @click="addInkColour('Purple')" class="btn btn-sm btn-primary m-1">Purple</button>
                        <button @click="addInkColour('Gold')" class="btn btn-sm btn-primary m-1">Gold</button>
                        <button @click="addInkColour('Silver')" class="btn btn-sm btn-primary m-1">Silver</button>
                        <hr>
                        <p class="mt-0 mb-2">Or add a custom ink colour / pantone reference</p>

                        <div class="row justify-content-center">
                            <div class="col-xs-10 col-sm-8">
                                <div class="form-row align-items-center">
                                    <div class="col-auto">
                                        <input id="addCustomArtworkInkColour" class="form-control mb-2" v-model="addCustomArtworkInkColour">
                                    </div>
                                    <div class="col-auto">
                                        <button class="btn btn-primary mb-2" @click="addCustomInkColour()">Add Custom Colour</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    @include('partials/basketAddedModal')

@endsection
