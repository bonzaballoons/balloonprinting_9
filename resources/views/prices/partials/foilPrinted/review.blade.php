<step title="Review">

    <div class="row">
        <div class="col-md-6 text-center">
            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Review your selection</strong>
            </h5>

            <p>Number of Balloons Selected: <span class="heading-tertiary">@{{ numberBalloons }}</span></p>
            <p>Balloon Type: <span class="heading-tertiary">@{{ typeSelected.name }}</span></p>
            <p>Balloon Colours Selected: <br>
                <span v-if="coloursSelectedNameList.length" class="heading-tertiary">
                   @{{ coloursSelectedNameList }}
                </span>
                <span v-else class="text-danger">No Colours Chosen</span>
            </p>
            <p>
                Ink Colours <span v-if="sides === 2 && sideDesignType === 'different'">Side 1</span>:
                <span v-if="pantonesSide1List" class="heading-tertiary">@{{ pantonesSide1List }}</span>
                <span v-else class="text-danger">No Colours Chosen</span>
            </p>
            <p v-if="sides === 2 && sideDesignType === 'different'">
                Ink Colours Side 2:
                <span v-if="pantonesSide2List" class="heading-tertiary">@{{ pantonesSide2List }}</span>
                <span v-else class="text-danger">No Colours Chosen</span>
            </p>

            <p v-if="showInkSwitchReview">
                Ink colour switch:
                <span v-if="inkSwitchPantone.trim().length" class="heading-tertiary">@{{ inkSwitchPantone }}</span>
                <span v-else class="text-danger">No Colour Chosen</span>
            </p>

            <p v-if="uploadedArtwork.length">Artwork uploaded: <span class="heading-tertiary">@{{ uploadedArtwork.length }} file<span v-show="uploadedArtwork.length > 1">s</span> uploaded</span></p>
            <p v-if="artworkText.length">Artwork Text: <span class="heading-tertiary">@{{ artworkText }}</span><p>
            <p v-if="artworkFont.length">Artwork Font: <span class="heading-tertiary">@{{ artworkFont }}</span></p>
        </div>
        <div class="col-sm-6 text-center">

            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Alter the balloons you require</strong>
            </h5>
            <div class="d-flex justify-content-center">
                <input type="text" class="form-control form-control-lg" style="width: 180px" name="numberBalloons" v-model="numberBalloons">
            </div>

            <p style="margin-top: 9px" class="text-danger"><small>The price will be cheaper per balloon for larger quantities</small></p>
            <hr>

            <div v-show="!loadingBasket">
                <button v-if="!priceNotAvailable" class="btn btn-primary m-2" v-on:click="addToBasket()">Add to Basket</button>
                {{--<button class="btn btn-danger m-2" v-on:click="saveQuote()">Save Quote</button>--}}
            </div>

            <p v-show="loadingBasket" class="text-danger">Please wait, adding / saving...</p>
        </div>
    </div>

    {{--Modals--}}
    <div class="modal fade" id="saveQuoteModal" tabindex="-1" role="dialog" aria-labelledby="saveQuoteModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="saveQuoteModalLabel">Save Quote</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <p>By saving your quote, the following</p>
                    <ul>
                        <li>Send you a link with details of your selection / quote</li>
                        <li>Notify our printing team of your interest</li>
                        <li>If you have uploaded artwork, we'll check it and send you a proof free of charge, with no obligations</li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button @click="saveQuote()" type="button" class="btn btn-danger">Save Quote</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="validationModal" tabindex="-1" role="dialog" aria-labelledby="validationModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="validationModalLabel">Validation Errors</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body">
                    <p class="text-danger">Please fix the following errors before continuing:</p>

                    <div v-show="!chosenColoursDisplay.length" class="row">
                        <div class="col-sm-9">
                            <p>Please select the colour of balloons you'd like to print on</p>
                        </div>
                        <div class="col-sm-3">
                            <a class="btn btn-sm btn-warning" href="javascript:" @click="fixValidation(1)">Click Here To Fix</a>
                        </div>
                        <hr>
                    </div>
                    <div v-show="chosenColoursMatchTypeChosen" class="row">
                        <div class="col-sm-9">
                            <p>The balloon colours do not come form the '@{{ typeSelected.name }}' range you have selected</p>
                        </div>
                        <div class="col-sm-3">
                            <a class="btn btn-sm btn-warning" href="javascript:" @click="fixValidation(1)">Click Here To Fix</a>
                        </div>
                    </div>
                    <div v-show="!inkColoursHaveBeenSelected" class="row">
                        <div class="col-sm-9">
                            <p>Please choose your ink colours</p>
                        </div>
                        <div class="col-sm-3">
                            <a class="btn btn-sm btn-warning" href="javascript:" @click="fixValidation(3)">Click Here To Fix</a>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</step>