<step title="Ink">

    <div class="row">
        <div class="col-md-6">
            <h5 class="text-center heading-primary header-lowercase">
                <strong><i class="fas fa-angle-down heading-secondary"></i> Colour or Pantone code for your artwork colour(s)</strong>
            </h5>

            <div v-show="displayPantone1234">

                <p class="text-center" v-if="printingOptionSelected.id === 2 || printingOptionSelected.id === 2">
                    Tell us the ink colour you'd like for the first half of the print run
                </p>
                <p v-else class="text-center">Tell us the <span v-show=" ! _.includes([1, 4], printingOptionSelected.id)">@{{ printingOptionSelected.artworkColours }}</span> ink colour<span v-show="printingOptionSelected.id > 1">s</span> that you'd like to use in your design</p>

                <div class="input-group mb-3">
                    <input v-model="pantone1" @click="launchAddUpdateInkColourModal('pantone1')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-pantone1" readonly>
                    <div class="input-group-append">
                        <button @click="launchAddUpdateInkColourModal('pantone1')" class="btn btn-primary" type="button" id="button-pantone1">
                            <span v-if="pantone1.length">Change</span>
                            <span v-else>Add</span>
                        </button>
                    </div>
                </div>

                <br v-show="displayPantone2">

                <div v-show="displayPantone2">
                    <div class="input-group mb-3">
                        <input v-model="pantone2" @click="launchAddUpdateInkColourModal('pantone2')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-pantone2" readonly>
                        <div class="input-group-append">
                            <button @click="launchAddUpdateInkColourModal('pantone2')" class="btn btn-primary" type="button" id="button-pantone2">
                                <span v-if="pantone2.length">Change</span>
                                <span v-else>Add</span>
                            </button>
                        </div>
                    </div>
                    <br v-show="displayPantone3">
                </div>

                <div v-show="displayPantone3">
                    <div class="input-group mb-3">
                        <input v-model="pantone3" @click="launchAddUpdateInkColourModal('pantone3')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-pantone3" readonly>
                        <div class="input-group-append">
                            <button @click="launchAddUpdateInkColourModal('pantone3')" class="btn btn-primary" type="button" id="button-pantone3">
                                <span v-if="pantone3.length">Change</span>
                                <span v-else>Add</span>
                            </button>
                        </div>
                    </div>
                    <br v-show="displayPantone4">
                </div>

                <div v-show="displayPantone4">
                    <div class="input-group mb-3">
                        <input v-model="pantone4" @click="launchAddUpdateInkColourModal('pantone4')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-pantone4" readonly>
                        <div class="input-group-append">
                            <button @click="launchAddUpdateInkColourModal('pantone4')" class="btn btn-primary" type="button" id="button-pantone4">
                                <span v-if="pantone4.length">Change</span>
                                <span v-else>Add</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div v-show="printingOptionSelected.id === 3">
                <br>
                <h5 class="text-center heading-primary header-lowercase"><i class="fas fa-angle-down heading-secondary"></i> Side 1</h5>
                <div class="input-group mb-3">
                    <input v-model="side1Pantone" @click="launchAddUpdateInkColourModal('side1Pantone')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-side1Pantone" readonly>
                    <div class="input-group-append">
                        <button @click="launchAddUpdateInkColourModal('side1Pantone')" class="btn btn-primary" type="button" id="button-side1Pantone">
                            <span v-if="side1Pantone.length">Change</span>
                            <span v-else>Add</span>
                        </button>
                    </div>
                </div>

                <br>
                <h5 class="text-center heading-primary header-lowercase"><i class="fas fa-angle-down heading-secondary"></i> Side 2</h5>
                <div class="input-group mb-3">
                    <input v-model="side2Pantone" @click="launchAddUpdateInkColourModal('side2Pantone')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-side2Pantone" readonly>
                    <div class="input-group-append">
                        <button @click="launchAddUpdateInkColourModal('side2Pantone')" class="btn btn-primary" type="button" id="button-side2Pantone">
                            <span v-if="side2Pantone.length">Change</span>
                            <span v-else>Add</span>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="printingOptionSelected.inkChanges === 1">
                <br><br>
                <h5 class="text-center heading-primary header-lowercase"><strong><i class="fas fa-angle-down heading-secondary"></i> Colour or Pantone code for your ink switch</strong></h5>

                <p class="text-center">Tell us the ink colour you'd like for the ink switch half way through the print run</p>
                <div class="input-group mb-3">
                    <input v-model="inkSwitchPantone" @click="launchAddUpdateInkColourModal('inkSwitchPantone')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-inkSwitchPantone" readonly>
                    <div class="input-group-append">
                        <button @click="launchAddUpdateInkColourModal('inkSwitchPantone')" class="btn btn-primary" type="button" id="button-inkSwitchPantone">
                            <span v-if="inkSwitchPantone.length">Change</span>
                            <span v-else>Add</span>
                        </button>
                    </div>
                </div>
            </div>

            <br class="d-md-none">

        </div>
        <div class="col-md-6 text-center">
            <h5 class="text-center header-lowercase">
                <strong>
                    Please note that there are surcharges for certain ink Colours
                </strong>
            </h5>
            <p class="mt-0 mb-2">Black & White: <span class="heading-secondary">Free</span></p>
            <p class="mt-0 mb-2">Red, Dark Blue, Blue, Orange, Yellow, Green, Purple: <span class="heading-secondary">£3.00</span></p>
            <p class="mt-0 mb-2">Gold, Silver: <span class="heading-secondary">£6.00</span></p>
            <p class="mt-0 mb-2">All other colours: <span class="heading-secondary">£9.00</span></p>
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

</step>