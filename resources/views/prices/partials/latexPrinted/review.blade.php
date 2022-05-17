<step title="Review">

    <div class="row">
        <div class="col-md-6 text-center">
            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Review your selection</strong>
            </h5>

            <p>Number Of Balloons Selected: <span class="heading-tertiary">@{{ numberBalloons }}</span></p>
            <p>Balloon Type: <span class="heading-tertiary">@{{ typeSelected.name }}</span></p>
            <p>Balloon Size: <span class="heading-tertiary">@{{ sizeSelected }} Inch</span></p>
            <p>Printing Option: <span class="heading-tertiary">@{{ printingOptionSelected.name }}</span></p>
            <p>Colours Selected:
                <span v-if="coloursSelectedNameList" class="heading-tertiary">@{{ coloursSelectedNameList }}</span>
                <a v-else href="javascript:" class="heading-secondary" @click="fixValidation(1)">None Selected - Click To Fix</a>
            </p>

            <p v-if="printingOptionSelected.id !== 3">Ink Colours Selected:
                <span v-if="pantone1234NameList" class="heading-tertiary">@{{ pantone1234NameList }}</span>
                <a v-else href="javascript:" class="heading-secondary" @click="fixValidation(3)">Required For Price - Click To Fix</a>
            </p>

            <p v-if="printingOptionSelected.id === 3">
                Side 1 Ink Colour:
                <span v-if="side1Pantone" class="heading-tertiary">@{{ side1Pantone }} ,</span>
                <a v-else href="javascript:" class="heading-secondary" @click="fixValidation(3)">Required For Price - Click To Fix</a>
            </p>

            <p v-if="printingOptionSelected.id === 3">
                Side 2 Ink Colour:
                <span v-if="side2Pantone" class="heading-tertiary">@{{ side2Pantone }}</span>
                <a v-else href="javascript:" class="heading-secondary" @click="fixValidation(3)">Required For Price - Click To Fix</a>
            </p>

            <p v-if="printingOptionSelected.inkChanges">Ink colour switch:
                <span v-if="inkSwitchPantone" class="heading-tertiary">@{{ inkSwitchPantone }}</span>
                <a v-else href="javascript:" class="heading-secondary" @click="fixValidation(3)">Required For Price - Click To Fix</a>,
            </p>

            <p v-if="uploadedArtwork.length">Artwork Uploaded: <span class="heading-tertiary">@{{ uploadedArtwork.length }} File<span v-show="uploadedArtwork.length > 1">s</span> Uploaded</span></p>
            <p v-if="artworkText.length">Artwork Text: <span class="heading-tertiary">@{{ artworkText }}</span></p>
            <p v-if="artworkFont.length"><span>Artwork Font: <span class="heading-tertiary">@{{ artworkFont }}</span></span></p>
        </div>
        <div class="col-md-6 text-center">

            <br class="d-xs-block d-md-none">
            <br class="d-xs-block d-md-none">

            <h5 class="heading-primary text-center header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> A Speedy Turnaround Fee May Apply</strong>
            </h5>
            <p class="smaller mx-auto" style="max-width: 500px;">For print jobs that are required quickly, an additional fee is added. Please see below which fee applies to you. Next day turnaround is available before 12pm (noon). <strong class="text-danger">Please note that the fees will be applied in the basket when you choose a delivery date.</strong></p>
            <table class="table mx-auto" style="max-width: 500px">
                <tbody>
                <tr>
                    <td>
                        <span v-if="expressFeesAndDates">Receive by @{{ expressFeesAndDates[1]['dateString'] }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                    <td>
                        <span v-if="expressFeesAndDates" class="text-danger">+ £@{{ expressFeesAndDates[1]['expressFeeWithVat'] | formatCurrency }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span v-if="expressFeesAndDates">Receive by @{{ expressFeesAndDates[2]['dateString'] }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                    <td>
                        <span v-if="expressFeesAndDates" class="text-danger">+ £@{{ expressFeesAndDates[2]['expressFeeWithVat'] | formatCurrency }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span v-if="expressFeesAndDates">Receive by @{{ expressFeesAndDates[3]['dateString'] }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                    <td>
                        <span v-if="expressFeesAndDates" class="text-danger">+ £@{{ expressFeesAndDates[3]['expressFeeWithVat'] | formatCurrency }}</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span v-if="expressFeesAndDates">Receive by @{{ expressFeesAndDates[5]['dateString'] }} </span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                    <td>
                        <span v-if="expressFeesAndDates" class="text-danger">Free</span>
                        <span v-else class="text-danger">loading...</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <hr>
            <h5 class="text-center heading-primary header-lowercase mb-4">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Alter the balloons you require</strong>
            </h5>
            <div class="d-flex justify-content-center">
                <input type="text" class="form-control form-control-lg" style="width: 180px" name="numberBalloons" v-model="numberBalloons">
            </div>

            <p style="margin-top: 9px" class="heading-secondary text-center"><small>The price will be cheaper per balloon for larger quantities</small></p>

            <div class="d-flex justify-content-center">
                <div v-show="!loadingBasket" class="form-inline" style="margin-top: 2px;">
                    <button class="btn btn-primary m-1" v-on:click="addToBasket()">Add To Basket</button>
                    {{--<button class="btn btn-danger m-1" data-toggle="modal" data-target="#saveQuoteModal">Save Quote</button>--}}
                </div>
            </div>

            <p v-show="loadingBasket" class="heading-tertiary">Please wait, adding / saving...</p>
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
                    <div v-show="!chosenColoursMatchTypeChosen" class="row">
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
