import foilColours from './data/foilColours';
import printingWizard from './components/wizardFoil.vue';
import step from './components/step.vue';
import uppy from './components/uppy.vue';

const bus = new Vue();

// Todo - need to put in warning for when picked colour doesn't match type selected

const foilWizard = new Vue({

    el: '#foilWizard',

    components: {printingWizard, step, uppy},

    data: {

        // Global
        activeStep: 0,
        priceWithoutVat: 0,
        priceWithVat: 0,
        pricePerBalloon: 0,
        calculatingPrice: false,
        loadingBasket: false,

        // Page 1 - Number of Balloons
        numberBalloons : 25,

        // Page 2 - Type and Colour
        foilColours : foilColours,
        typeSelected : foilColours[0],
        colourSelected : null,
        colourRemoveOption : false,
        assortmentSelected: null,
        coloursChosen: [],
        coloursChosenTypeId: null,
        displayImgSrc: '',

        // Page 3 - Printing Options
        sides: 1,
        sideDesignType: 'same',
        side1OrSameInkColourNumber: 1,
        side2InkColourNumber: 1,
        inkSwitch: false,

        // Page 4 - Ink Colours
        s1Pantone1: '',
        s1Pantone2: '',
        s1Pantone3: '',
        s1Pantone4: '',
        s1Pantone5: '',
        s1Pantone6: '',
        s1Pantone7: '',
        s1Pantone8: '',

        s2Pantone1: '',
        s2Pantone2: '',
        s2Pantone3: '',
        s2Pantone4: '',
        s2Pantone5: '',
        s2Pantone6: '',
        s2Pantone7: '',
        s2Pantone8: '',

        inkSwitchPantone: '',

        addCustomArtworkInkColour: '',
        addArtworkInkColourDataAttribute: '',

        // Page 5 - Artwork / Design
        uploadedArtwork: [],
        artworkText: '',
        artworkFont: '',

        // Page 6 - Review
        email: '',
    },

    created() {
        bus.$on('addArtwork', this.addArtwork);
        bus.$on('changeStep', this.changeStep);
    },

    mounted(){
        this.calculatePrice()
    },

    methods: {

        // Global
        changeStep(stepToGo){

            this.activeStep = stepToGo;

            $('html,body').animate({
                scrollTop: $("#foilWizard").offset().top
            }, 200);
        },

        // Step 2 - Type & Colour
        changeBalloonType(type){
            this.typeSelected = type;
        },

        showColourPreview(colour, removeOption = null, fromReview = null){
            this.colourSelected = colour;
            this.colourRemoveOption = removeOption;
            let folder = fromReview ? this.colourTypeChosen.folder : this.typeSelected.folder;
            this.displayImgSrc = 'https://bballoons.s3.amazonaws.com/printingColours/foilPrintingWizard/'+folder+'/jpg/'+_.snakeCase(this.colourSelected.name)+'.jpg';

            $('#colourPickerInfo').modal('show');
        },

        addColour(){
            $('#colourPickerInfo').modal('hide');
            if(this.coloursChosenTypeId !== null && this.typeSelected.id !== this.coloursChosenTypeId){
                toastr.error('You cannot add colours from different balloon shapes. Please remove the currently selected colours, before adding colours from a new shape');
                return;
            }
            this.coloursChosenTypeId = this.typeSelected.id;
            this.coloursChosen.push(this.colourSelected.id);
        },

        removeColour(){
            this.coloursChosen = _.without(this.coloursChosen, this.colourSelected.id);
            if( ! this.coloursChosen.length ){
                this.coloursChosenTypeId = null;
            }
            $('#colourPickerInfo').modal('hide');
        },

        removeAllColoursChosen() {
            this.coloursChosen = [];
            this.coloursChosenTypeId = null;
        },

        //  Step 4 - Artwork
        addInkColour(colour){

            this[this.addArtworkInkColourDataAttribute] = colour;
            this.addCustomArtworkInkColour = '';
            $('#inkColourChangeModal').modal('hide');
        },

        addCustomInkColour(){

            if( this.addCustomArtworkInkColour.length ){
                this[this.addArtworkInkColourDataAttribute] = this.addCustomArtworkInkColour;
                this.addCustomArtworkInkColour = '';
                $('#inkColourChangeModal').modal('hide');
            }
        },

        launchAddUpdateInkColourModal(dataAttribute){

            this.addArtworkInkColourDataAttribute = dataAttribute;
            $('#inkColourChangeModal').modal('show');
        },

        // Step 5 - Artwork
        addArtwork(result){
            this.uploadedArtwork.push(result);
        },

        removeArtwork(index){
            // todo - delete from s3
            this.uploadedArtwork.splice(index, 1);
        },

        calculatePrice(){

            if( this.numberBalloons > 0 && !this.priceNotAvailable){

                this.calculatingPrice = true;

                let options = { params : {
                    numberBalloons: this.numberBalloons,
                    numberColours: this.numberColours,
                    sides: this.sides,
                    numberInkSwitches: this.numberInkSwitches,
                    inkColourNames: this.inkColoursChosenURLString,
                    shapeSelected: this.typeSelected.folder,
                    sideDesignType: this.sideDesignType
                } };

                axios.get('/api/foilPrintingPrice', options).then( response => {

                    this.expressFeesAndDates = response.data.expressFeesAndDates;
                    this.priceWithVat = _.round(response.data.totalPriceWithVat, 2);
                    this.pricePerBalloon = _.round(response.data.pricePerBalloon, 2);
                    this.calculatingPrice = false;
                    this.priceWithoutVat = _.round(response.data.totalPriceWithoutVat, 2);

                }).catch( () => {
                    toastr.error('There was an error fetching the price. Please check your internet connection and try again');
                    this.calculatingPrice = false;
                });
            }
        },

        // Step 6 - Review

        addToBasket(){

            if( !this.quoteIsValid ) {
                $('#validationModal').modal('show');
                return;
            }

            let data = _.clone(foilWizard.$data);

            // Add computed props required by PrintedFoilWizardProduct object
            data.coloursSelectedNameList = this.coloursSelectedNameList;
            data.pantonesSide1List = this.pantonesSide1List;
            data.pantonesSide2List = this.pantonesSide2List;

            // Add computed props used for hard price check
            data.inkColoursChosenURLString = this.inkColoursChosenURLString;
            data.numberColours = this.numberColours;
            data.numberInkSwitches = this.numberInkSwitches;

            data = { 'json' : JSON.stringify( data ) };

            this.loadingBasket = true;

            axios.post('/api/basketAddPrintedWizardFoil', data).then( () => {
                this.loadingBasket = false;
                updateBasketCount();
                $("#basketAddedModal").modal('show');
            }).catch( () => {
                this.loadingBasket = false;
                toastr.error('Sorry, your printed balloons failed to add to the basket. Please check your internet connection and try again. Alternatively, please give us a call so we can help you resolve the issue.');
            });

        },

        fixValidation(stepToGo){
            $('#validationModal').modal('hide');
            this.changeStep(stepToGo);
        },
    },

    computed: {

        // Step 2 - Type and Colours
        chosenColoursDisplay(){
            return this.coloursChosenTypeId ? _.filter(this.colourTypeChosen.colours, colour => _.includes(this.coloursChosen, colour.id) ) : [];
        },

        colourTypeChosen(){
            return this.coloursChosenTypeId ? _.find( this.foilColours, ['id', this.coloursChosenTypeId] ) : null;
        },

        chosenColoursMatchTypeChosen() {
            if(this.coloursChosen.length){
                return this.typeSelected.id === this.coloursChosenTypeId;
            }
            return true;
        },

        // Step 3 - Printing Options
        showInkSwitchInput(){

            if( this.sides === 1 && this.side1OrSameInkColourNumber === 1 ){
                return true;
            }
            else if( this.sides === 2 && this.sideDesignType === 'same' && this.side1OrSameInkColourNumber === 1 ){
                return true;
            }
            return false;
        },

        numberColours(){
            return this.sides === 1 ? this.side1OrSameInkColourNumber : 1;
        },

        numberInkSwitches(){
            return this.showInkSwitchInput && this.inkSwitch ? 1 : 0;
        },

        // All functions below are used to display images
        show1SideColOption(){
            if( this.sides === 1 && this.inkSwitch === false){
                return this.side1OrSameInkColourNumber+'col';
            }
        },

        showInkChangeImg(){

            if(this.sides === 1 && this.side1OrSameInkColourNumber === 1 && this.inkSwitch){
                return '1side';
            }

            if(this.sides === 2 && this.sideDesignType === 'same' && this.side1OrSameInkColourNumber === 1 && this.inkSwitch){
                return '2side';
            }
        },

        showSidesDesignSpec(){
            if(this.sides === 2 && this.sideDesignType === 'same' && this.side1OrSameInkColourNumber === ''){
                return 'same';
            }
        },

        showSame2SideColOption(){

            if (this.sides === 2 && this.sideDesignType === 'same') {

                if (this.side1OrSameInkColourNumber > 1) {
                    return this.side1OrSameInkColourNumber+'col';
                }

                if ( this.inkSwitch === false && this.side1OrSameInkColourNumber === 1) {
                    return '1col';
                }
            }
            return '';
        },

        show2SidesDiffColOptionsSide1() {

            if (this.sides === 2 && this.sideDesignType === 'different') {
                return 'col'+this.side1OrSameInkColourNumber;
            }
        },

        show2SidesDiffColOptionsSide2() {
            if (this.sides === 2 && this.sideDesignType === 'different') {
                return 'col'+this.side2InkColourNumber;
            }
        },

        showFrontBackDiv() {
            if (this.sides === 2 && this.sideDesignType === 'different') {
                return true;
            }
        },

        // Step 6 - Review
        pantonesSide1List(){

            let pantoneList = [];

            _.each( _.range(1, this.side1OrSameInkColourNumber + 1), number => {
                if( this['s1Pantone'+number].trim().length ){
                    pantoneList.push( this['s1Pantone'+number].trim() );
                }
            });

            return pantoneList.length ? pantoneList.join(', ') : '';
        },

        pantonesSide2List(){

            if( this.sides === 2 && this.sideDesignType === 'different' ){

                let pantoneList = [];

                _.each( _.range(1, this.side2InkColourNumber + 1), number => {
                    if( this['s2Pantone'+number].trim().length ){
                        pantoneList.push( this['s2Pantone'+number].trim() );
                    }
                });

                if( pantoneList.length ){
                    return pantoneList.join(', ');
                }
            }

            return '';
        },

        showInkSwitchReview(){

            if( this.sides === 1 && this.side1OrSameInkColourNumber === 1 && this.inkSwitch){
                return true;
            }
            else if( this.sides === 2 && this.sideDesignType === 'same' && this.side1OrSameInkColourNumber === 1 && this.inkSwitch){
                return true;
            }
            return false;
        },

        coloursSelectedNameList(){

            if(this.chosenColoursDisplay.length){
                let list = _.map(this.chosenColoursDisplay, 'name');
                return list.join(', ');
            }
            return '';
        },

        // Global
        priceNotAvailable(){

            if( this.numberBalloons > 0 && this.numberBalloons < 1000001){
                if(this.sides === 2){
                    if( this.sideDesignType === 'same'){
                        return this.side1OrSameInkColourNumber > 1;
                    }
                    return this.side1OrSameInkColourNumber > 1 || this.side2InkColourNumber > 1;
                }
                return this.side1OrSameInkColourNumber > 4;
            }
            return true;
        },

        quoteIsValid(){
            return this.chosenColoursDisplay.length > 0 && this.chosenColoursMatchTypeChosen && this.inkColoursHaveBeenSelected;
        },

        // Global Validation
        inkColoursHaveBeenSelected(){

            let isValid = true;

            _.each( _.range(1, this.side1OrSameInkColourNumber + 1 ), number => {
                isValid = isValid && this['s1Pantone'+number].trim().length;
            });

            if(this.sides === 2 && this.sideDesignType === 'different'){
                _.each( _.range(1, this.side2InkColourNumber + 1 ), number => {
                    isValid = isValid && this['s2Pantone'+number].trim().length;
                });
            }

            return isValid;
        },
    },

    watch: {

        numberBalloons() {
            this.calculatePrice();
        },

        typeSelected() {
            this.calculatePrice();
        },

        sides() {
            this.calculatePrice();
        },

        side1OrSameInkColourNumber() {
            this.calculatePrice();
        },

        side2InkColourNumber() {
            this.calculatePrice();
        },

        inkSwitch() {
            this.calculatePrice();
        }
    }
});
