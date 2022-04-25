<step title="Options">
    <div class="row">
        <div class="col-md-6 text-center">

            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="form-group">
                        <label for="sideOptions" class="heading-primary">
                            <strong><i class="fas fa-angle-down heading-secondary"></i> Print on one 1 or 2 sides?</strong>
                        </label>
                        <select title="sideOptions" class="form-control" v-model.number="sides">
                            <option :value="1">Print on 1 Side</option>
                            <option :value="2">Print on 2 Sides</option>
                        </select>
                    </div>
                </div>
                <div  v-if="sides === 2" class="col-lg-6">
                    <div class="form-group">
                        <label for="sideDesignType" class="heading-primary">
                            <strong><i class="fas fa-angle-down heading-secondary"></i> Same design on each side?</strong>
                        </label>
                        <select title="sideDesignType" class="form-control" v-model="sideDesignType">
                            <option value="same">Same design on both sides</option>
                            <option value="different">Different design on either side</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="form-group mt-3">
                        <label for="side1OrSameInkColourNumber" class="heading-primary">
                            <strong><i class="fas fa-angle-down heading-secondary"></i> Select the number of ink colours in the artwork <span v-if="sides === 2 && sideDesignType === 'different'">for side 1</span></strong>
                        </label>
                        <select title="side1OrSameInkColourNumber" class="form-control" v-model.number="side1OrSameInkColourNumber">
                            <option :value="1">1 Colour</option>
                            <option :value="2">2 Colours</option>
                            <option :value="3">3 Colours</option>
                            <option :value="4">4 Colours</option>
                            <option :value="5">5 Colours</option>
                            <option :value="6">6 Colours</option>
                            <option :value="7">7 Colours</option>
                            <option :value="8">8 Colours</option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-6" v-if="sides === 2 && sideDesignType === 'different'">
                    <div class="form-group mt-3">
                        <label for="side2InkColourNumber" class="heading-primary">
                            <strong><i class="fas fa-angle-down heading-secondary"></i> Select the number of ink colours in the artwork for side 2</strong>
                        </label>
                        <select title="side2InkColourNumber" class="form-control" v-model.number="side2InkColourNumber">
                            <option :value="1">1 Colour</option>
                            <option :value="2">2 Colours</option>
                            <option :value="3">3 Colours</option>
                            <option :value="4">4 Colours</option>
                            <option :value="5">5 Colours</option>
                            <option :value="6">6 Colours</option>
                            <option :value="7">7 Colours</option>
                            <option :value="8">8 Colours</option>
                        </select>
                    </div>
                </div>
                <div class="col-lg-6" v-if="showInkSwitchInput">
                    <div class="form-group mt-3">
                        <label for="sideDesignType" class="heading-primary">
                            <strong><i class="fas fa-angle-down heading-secondary"></i> Change the ink colour halfway through the print?</strong>
                        </label>
                        <select title="side2InkColourNumber" class="form-control" v-model="inkSwitch">
                            <option :value="false">No</option>
                            <option :value="true">Yes</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
        <div class="col-md-6">

            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '1col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/1c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '2col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/2c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '3col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/3c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '4col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/4c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '5col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/5c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '6col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/6c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '7col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/7c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="show1SideColOption === '8col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/8c1s.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showInkChangeImg === '1side'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/inkChange1Col1Side.png">

            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSidesDesignSpec === 'same'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/2Sides_sameDesignOnBothSides.png">

            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '1col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/1c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '2col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/2c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '3col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/3c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '4col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/4c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '5col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/5c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '6col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/6c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '7col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/7c2s_sameEachSide.png">
            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showSame2SideColOption === '8col'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/8c2s_sameEachSide.png">

            <img style="max-height: 300px; max-width: 300px" class="img-fluid d-block mx-auto" v-if="showInkChangeImg === '2side'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/inkChange1Col2Sides.png">

            <div v-if="showFrontBackDiv" class="row text-center">
                <div class="col-sm-6">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col1'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front1Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col2'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front2Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col3'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front3Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col4'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front4Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col5'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front5Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col6'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front6Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col7'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front7Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide1 === 'col8'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/front8Col.png">
                </div>
                <div class="col-sm-6">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col1'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back1Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col2'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back2Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col3'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back3Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col4'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back4Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col5'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back5Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col6'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back6Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col7'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back7Col.png">
                    <img class="img-fluid d-block mx-auto" v-if="show2SidesDiffColOptionsSide2 === 'col8'" src="https://s3-eu-west-1.amazonaws.com/balloonprinting/balloonprintingcouk/wizard/foil/pane3/back8Col.png">
                </div>
            </div>

        </div>
    </div>
</step>