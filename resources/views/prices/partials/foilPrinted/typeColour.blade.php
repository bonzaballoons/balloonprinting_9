<step title="Colours">
    <div class="row">

        <div class="col-md-4 text-center">
            <h5 class="heading-primary header-lowercase"><strong><i class="fas fa-angle-down heading-secondary"></i> Select a balloon type</strong></h5>
            <hr>
            <div class="d-flex flex-wrap justify-content-around">
                <div style="width: 190px" class="mt-2 mb-4 ml-4 mr-4" v-for="type in foilColours" @click="changeBalloonType(type)">
                    <input type="radio" :value="type" v-model="typeSelected">
                    <label>&nbsp;@{{ type.name }}</label><br>
                </div>
            </div>
        </div>

        <div class="col-md-4 text-center">
            <h5 class="heading-primary header-lowercase mt-4 mt-md-0"><strong><i class="fas fa-angle-down heading-secondary"></i> Select your colours</strong></h5>
            <hr>
            <p class="smaller">You can add as many colours as you'd like, free of charge. Just click one of the squares below to begin.</p>
            <div class="d-flex flex-wrap justify-content-around">
                <div v-for="colour in typeSelected.colours" :style="{ 'background-color': colour.cssColour }" class="colour_pick_square" @click="showColourPreview(colour)"></div>
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

        </div>

        <div class="col-md-4 text-center">

            <h5 class="heading-primary header-lowercase mt-4 mt-md-0"><strong><i class="fas fa-angle-down heading-secondary"></i> Review your colours</strong></h5>
            <hr>

            <div v-if="!chosenColoursDisplay.length" class="alert alert-warning text-center" role="alert"><strong>Please select some balloon colours</strong></div>

            <h6 v-if="chosenColoursDisplay.length"><strong>Chosen Colours</strong></h6>

            <p v-if="chosenColoursDisplay.length" class="smaller">Click one of the squares below to view or remove the balloon.</p>

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

            <div v-if="!chosenColoursMatchTypeChosen" class="alert alert-warning text-center mt-4" role="alert">
                The colours you have chosen, do not come form the <strong>@{{ typeSelected.name }}</strong> range selected. <a href="javascript:" @click="removeAllColoursChosen()">Click here</a> to remove current selection.
            </div>

        </div>
    </div>

    {{--Modals--}}
    <div class="modal fade" id="colourPickerInfo" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="defaultModalLabel">
                        <span v-if="!colourRemoveOption">Add</span><span v-else=>Remove</span> Colour - <span v-if="colourSelected">@{{ colourSelected.name }}</span>
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                </div>
                <div class="modal-body text-center">
                    <div v-if="colourSelected">
                        <img class="img-responsive" :src="displayImgSrc" :alt="colourSelected.name">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button v-if="!colourRemoveOption" @click="addColour()" type="button" class="btn btn-primary">Add to your selection</button>
                    <button v-if="colourRemoveOption" @click="removeColour()" type="button" class="btn btn-danger">Remove colour</button>
                </div>
            </div>
        </div>
    </div>

</step>