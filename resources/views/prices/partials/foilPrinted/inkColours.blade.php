<step title="Ink">
    <div class="row">
        <div class="col">
            <p class="text-center">Please tell us the Pantone reference or general colour (red, blue, green etc) of each colour in your artwork/design. For help choosing a pantone please visit <a href="http://www.pantone-colours.com" target="_blank">this website</a> and select a number that best matches your artwork colour.</p>
        </div>
    </div>

    <div class="row justify-content-center" v-if="sides === 1">
        <div class="col-md-6">
            <h5 class="heading-primary header-lowercase text-center">
                <strong>
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Select <span>@{{ side1OrSameInkColourNumber }}</span> Ink Colour<span v-show="side1OrSameInkColourNumber > 1">s</span> / Pantone<span v-show="side1OrSameInkColourNumber > 1">s</span>
                </strong>
            </h5>

            <div class="input-group mb-3">
                <input v-model="s1Pantone1" @click="launchAddUpdateInkColourModal('s1Pantone1')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone1" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone1')" class="btn btn-primary" type="button" id="button-s1Pantone1">
                        <span v-if="s1Pantone1.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 1">
                <input v-model="s1Pantone2" @click="launchAddUpdateInkColourModal('s1Pantone2')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone2" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone2')" class="btn btn-primary" type="button" id="button-s1Pantone2">
                        <span v-if="s1Pantone2.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 2">
                <input v-model="s1Pantone3" @click="launchAddUpdateInkColourModal('s1Pantone3')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone3" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone3')" class="btn btn-primary" type="button" id="button-s1Pantone3">
                        <span v-if="s1Pantone3.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 3">
                <input v-model="s1Pantone4" @click="launchAddUpdateInkColourModal('s1Pantone4')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone4" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone4')" class="btn btn-primary" type="button" id="button-s1Pantone4">
                        <span v-if="s1Pantone4.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 4">
                <input v-model="s1Pantone5" @click="launchAddUpdateInkColourModal('s1Pantone5')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone5" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone5')" class="btn btn-primary" type="button" id="button-s1Pantone5">
                        <span v-if="s1Pantone5.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 5">
                <input v-model="s1Pantone6" @click="launchAddUpdateInkColourModal('s1Pantone6')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone6" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone6')" class="btn btn-primary" type="button" id="button-s1Pantone6">
                        <span v-if="s1Pantone6.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 6">
                <input v-model="s1Pantone7" @click="launchAddUpdateInkColourModal('s1Pantone7')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone7" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone7')" class="btn btn-primary" type="button" id="button-s1Pantone7">
                        <span v-if="s1Pantone7.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div class="input-group mb-3" v-if="side1OrSameInkColourNumber > 7">
                <input v-model="s1Pantone8" @click="launchAddUpdateInkColourModal('s1Pantone8')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone8" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone8')" class="btn btn-primary" type="button" id="button-s1Pantone8">
                        <span v-if="s1Pantone8.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="inkSwitch && side1OrSameInkColourNumber === 1" class="col-md-6">
            <h5 class="heading-primary header-lowercase text-center">
                <strong>
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Select Ink Switch Pantone
                </strong>
            </h5>

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
    </div>

    <div class="row justify-content-center" v-if="sides === 2">
        <div class="col-md-6">
            <h5 class="heading-primary header-lowercase text-center">
                <strong>
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Select <span>@{{ side1OrSameInkColourNumber }}</span> Ink Colour<span v-show="side1OrSameInkColourNumber > 1">s</span> / Pantone<span v-show="side1OrSameInkColourNumber > 1">s</span>
                </strong>
            </h5>

            <div class="input-group mb-3">
                <input v-model="s1Pantone1" @click="launchAddUpdateInkColourModal('s1Pantone1')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone1" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone1')" class="btn btn-primary" type="button" id="button-s1Pantone1">
                        <span v-if="s1Pantone1.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 1" class="input-group mb-3">
                <input v-model="s1Pantone2"  @click="launchAddUpdateInkColourModal('s1Pantone2')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone2" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone2')" class="btn btn-primary" type="button" id="button-s1Pantone2">
                        <span v-if="s1Pantone2.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 2" class="input-group mb-3">
                <input v-model="s1Pantone3" @click="launchAddUpdateInkColourModal('s1Pantone3')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone3" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone3')" class="btn btn-primary" type="button" id="button-s1Pantone3">
                        <span v-if="s1Pantone3.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 3" class="input-group mb-3">
                <input v-model="s1Pantone4" @click="launchAddUpdateInkColourModal('s1Pantone4')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone4" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone4')" class="btn btn-primary" type="button" id="button-s1Pantone4">
                        <span v-if="s1Pantone4.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 4" class="input-group mb-3">
                <input v-model="s1Pantone5" @click="launchAddUpdateInkColourModal('s1Pantone5')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone5" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone5')" class="btn btn-primary" type="button" id="button-s1Pantone5">
                        <span v-if="s1Pantone5.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 5" class="input-group mb-3">
                <input v-model="s1Pantone6" @click="launchAddUpdateInkColourModal('s1Pantone6')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone6" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone6')" class="btn btn-primary" type="button" id="button-s1Pantone6">
                        <span v-if="s1Pantone6.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 6" class="input-group mb-3">
                <input v-model="s1Pantone7" @click="launchAddUpdateInkColourModal('s1Pantone7')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone7" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone7')" class="btn btn-primary" type="button" id="button-s1Pantone7">
                        <span v-if="s1Pantone7.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side1OrSameInkColourNumber > 7" class="input-group mb-3">
                <input v-model="s1Pantone8" @click="launchAddUpdateInkColourModal('s1Pantone8')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s1Pantone8" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s1Pantone8')" class="btn btn-primary" type="button" id="button-s1Pantone8">
                        <span v-if="s1Pantone8.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="sideDesignType === 'different'" class="col-md-6">
            <h5 class="heading-primary header-lowercase text-center">
                <strong>
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Select <span>@{{ side2InkColourNumber }}</span> Ink Colour<span v-show="side2InkColourNumber > 1">s</span> / Pantone<span v-show="side2InkColourNumber > 1">s</span>
                </strong>
            </h5>

            <div class="input-group mb-3">
                <input v-model="s2Pantone1" @click="launchAddUpdateInkColourModal('s2Pantone1')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone1" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone1')" class="btn btn-primary" type="button" id="button-s2Pantone1">
                        <span v-if="s2Pantone1.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 1" class="input-group mb-3">
                <input v-model="s2Pantone2" @click="launchAddUpdateInkColourModal('s2Pantone2')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone2" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone2')" class="btn btn-primary" type="button" id="button-s2Pantone2">
                        <span v-if="s2Pantone2.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 2" class="input-group mb-3">
                <input v-model="s2Pantone3" @click="launchAddUpdateInkColourModal('s2Pantone3')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone3" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone3')" class="btn btn-primary" type="button" id="button-s2Pantone3">
                        <span v-if="s2Pantone3.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 3" class="input-group mb-3">
                <input v-model="s2Pantone4" @click="launchAddUpdateInkColourModal('s2Pantone4')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone4" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone4')" class="btn btn-primary" type="button" id="button-s2Pantone4">
                        <span v-if="s2Pantone4.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 4" class="input-group mb-3">
                <input v-model="s2Pantone5" @click="launchAddUpdateInkColourModal('s2Pantone5')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone5" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone5')" class="btn btn-primary" type="button" id="button-s2Pantone5">
                        <span v-if="s2Pantone5.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 5" class="input-group mb-3">
                <input v-model="s2Pantone6" @click="launchAddUpdateInkColourModal('s2Pantone6')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone6" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone6')" class="btn btn-primary" type="button" id="button-s2Pantone6">
                        <span v-if="s2Pantone6.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 6" class="input-group mb-3">
                <input v-model="s2Pantone7" @click="launchAddUpdateInkColourModal('s2Pantone7')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone7" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone7')" class="btn btn-primary" type="button" id="button-s2Pantone7">
                        <span v-if="s2Pantone7.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>

            <div v-if="side2InkColourNumber > 7" class="input-group mb-3">
                <input v-model="s2Pantone8" @click="launchAddUpdateInkColourModal('s2Pantone8')" type="text" class="form-control" placeholder="e.g. Yellow or Pantone 109" aria-describedby="button-s2Pantone8" readonly>
                <div class="input-group-append">
                    <button @click="launchAddUpdateInkColourModal('s2Pantone8')" class="btn btn-primary" type="button" id="button-s2Pantone8">
                        <span v-if="s2Pantone8.length">Change</span>
                        <span v-else>Add</span>
                    </button>
                </div>
            </div>
        </div>
        <div v-if="sideDesignType === 'same' && inkSwitch && side1OrSameInkColourNumber === 1" class="col-md-6">
            <h5 class="heading-primary header-lowercase text-center">
                <strong>
                    <i class="fas fa-angle-down heading-secondary"></i>
                    Select Ink Switch Pantone
                </strong>
            </h5>

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

</step>