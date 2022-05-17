import latexColours from './data/latexColours';
import printingOptions from './data/printingOptions';
import printingWizard from './components/wizardLatex.vue';
import step from './components/step.vue';
import uppy from './components/uppy.vue';

const bus = new Vue();

const latexWizard = new Vue({

    el: '#latexWizard',

    components: {printingWizard, step, uppy},

    data: {

        // Global
        activeStep: 0,
        priceWithoutVat: 0,
        priceWithVat: 0,
        pricePerBalloon: 0,
        calculatingPrice: false,
        loadingBasket: false,
        nextDayAvailable: window.nextDayAvailable,

        // Page 1 - Number of Balloons
        numberBalloons : 200,

        // Page 2 - Type and Colour
        latexColours : latexColours,
        typeSelected : latexColours[0],
        sizeSelected: 10,
        colourSelected : null,
        colourRemoveOption : false,
        assortmentSelected: null,
        coloursChosen: [],
        coloursChosenTypeId: null,
        displayImgSrc: '',

        // Page 3 - Size and Options
        printingOptions: printingOptions,
        printingOptionSelected: printingOptions[0],

        // Page 4 - Ink Colour
        pantone1: '',
        pantone2: '',
        pantone3: '',
        pantone4: '',
        side1Pantone: '',
        side2Pantone: '',
        inkSwitchPantone: '',

        addCustomArtworkInkColour: '',
        addArtworkInkColourDataAttribute: '',

        // Page 5 - Artwork / Design
        uploadedArtwork: [],
        artworkText: '',
        artworkFont: '',

        // Page 6 - Review
        email: '',
        expressFeesAndDates: null,
    },

    mounted() {
        this.calculatePrice();
    },

    created() {
        bus.$on('addArtwork', this.addArtwork);
        bus.$on('changeStep', this.changeStep);
    },

    methods: {

        // Step 2 - Type & Colour
        changeBalloonType(type){
            this.typeSelected = type;
        },

        showColourPreview(colour, removeOption = null, fromReview = null){
            this.colourSelected = colour;
            this.colourRemoveOption = removeOption;
            let folder = fromReview ? this.colourTypeChosen.folder : this.typeSelected.folder;
            this.displayImgSrc = 'https://bballoons.s3.amazonaws.com/printingColours/latexPrintingWizard/'+folder+'/jpgs/'+_.snakeCase(this.colourSelected.name)+'.jpg';

            $('#colourPickerInfo').modal('show');
        },

        addColour(){
            $('#colourPickerInfo').modal('hide');
            if(this.coloursChosenTypeId !== null && this.typeSelected.id !== this.coloursChosenTypeId){
                alert('You cannot add colours from different balloon shapes. Please remove the currently selected colours, before adding colours from a new shape');
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

        showAssortmentPreview(assortment) {

            this.assortmentSelected = assortment;
            $('#assortmentPickerInfo').modal('show');
        },

        addAssortment(replace){

            $('#assortmentPickerInfo').modal('hide');

            if( replace ){
                this.coloursChosenTypeId = null;
            }

            if(this.coloursChosenTypeId !== null && this.typeSelected.id !== this.coloursChosenTypeId){
                alert('You cannot add colours from different balloon shapes. Please remove the currently selected colours, before adding colours from a new shape');
                return;
            }
            this.coloursChosenTypeId = this.typeSelected.id;
            this.coloursChosen = replace ? _.map(this.assortmentBalloons, 'id') : _.union(this.coloursChosen, _.map(this.assortmentBalloons, 'id') );
        },

        removeAllColoursChosen() {
            this.coloursChosen = [];
            this.coloursChosenTypeId = null;
        },

        // Page 4
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

        // Page 5
        addArtwork(result){
            this.uploadedArtwork.push(result);
        },

        removeArtwork(index){
            // todo - delete from s3
            this.uploadedArtwork.splice(index, 1);
        },

        // Page 6
        addToBasket(){

            if( !this.quoteIsValid ){
                $('#validationModal').modal('show');
                return;
            }

            let data = _.clone(latexWizard.$data);

            // Add computed props required by PrintedLatexWizardProduct object
            data.coloursSelectedNameList = this.coloursSelectedNameList;
            data.displayPantone1234 = this.displayPantone1234;
            data.displayPantone2 = this.displayPantone2;
            data.displayPantone3 = this.displayPantone3;
            data.displayPantone4 = this.displayPantone4;
            data.pantone1234NameList = this.pantone1234NameList;

            if( this.inkColoursChosenURLString.trim().length ){
                data.inkColourNames = this.inkColoursChosenURLString;
            }

            data = { 'json' : JSON.stringify( data ) };

            this.loadingBasket = true;

            axios.post('/api/basketAddPrintedWizardLatex', data).then( () => {

                this.loadingBasket = false;
                updateBasketCount();
                $("#basketAddedModal").modal('show');

            }).catch( () => {

                this.loadingBasket = false;
                toastr.error('Sorry, your printed balloons failed to add to the basket. Please check your internet connection and try again. Alternatively, please give us a call so we can help you resolve the issue.');
            });

        },

        saveQuote(){

            // Todo - add email is valid
            if( this.email.length ) {

                if( this.quoteIsValid ){

                    this.loadingBasket = true;
                    let data = { 'json' : JSON.stringify( _.clone(latexWizard.$data) ) };
                    data.pagePath = '/printing/quote/latex';
                    data.email = this.email;

                    axios.post('/api/printingSaveQuote', data).then( (response) => {
                        this.loadingBasket = false;
                        new $.flavr('Thanks! Your quote has been saved and a link to reload the quote will be sent to your email.');

                    }).catch( () => {

                        this.loadingBasket = false;
                        new $.flavr('Sorry, your quote has failed to save. Please check your internet connection and try again. Alternatively, please give us a call so we can help you resolve the issue.');
                    });

                    return;
                }

                $('#validationModal').modal('show');
                return;
            }

            //Todo - focus on email text input
            new $.flavr('Please add a valid email.');
        },

        fixValidation(stepToGo){
            $('#validationModal').modal('hide');
            this.changeStep(stepToGo);
        },

        // Global
        changeStep(stepToGo){

            this.activeStep = stepToGo;

            $('html,body').animate({
                scrollTop: $("#latexWizard").offset().top
            }, 200);
        },

        calculatePrice(){

            if( this.numberBalloons > 0 ){
                this.calculatingPrice = true;

                let options = { params : {
                    numberBalloons: this.numberBalloons,
                    numberColours: this.printingOptionSelected.artworkColours,
                    sides: this.printingOptionSelected.sideNum,
                    numberInkSwitches: this.printingOptionSelected.inkChanges,
                    size: this.sizeSelected,
                    typeSelectedId: this.typeSelected.id
                } };

                if( this.inkColoursChosenURLString.trim().length ){
                    options.params.inkColourNames = this.inkColoursChosenURLString;
                }

                axios.get('/api/latexPrintingPrice', options).then( response => {

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
    },

    computed: {
        // Global Validation
        inkColoursHaveBeenSelected(){

            let isValid = true;

            if( this.displayPantone1234 ){

                isValid = this.pantone1.length > 0 && isValid;

                if( this.displayPantone2 ){
                    isValid = this.pantone2.length > 0 && isValid;
                }

                if( this.displayPantone3 ){
                    isValid = this.pantone3.length > 0 && isValid;
                }

                if( this.displayPantone4 ){
                    isValid = this.pantone4.length > 0 && isValid;
                }
            }

            if( this.printingOptionSelected.id === 3){
                isValid = this.side1Pantone.length > 0 && this.side2Pantone.length > 0 && isValid;
            }

            if( this.printingOptionSelected.inkChanges === 1 ){
                isValid = this.inkSwitchPantone.length > 0 && isValid;
            }

            return isValid;
        },

        quoteIsValid(){
            return this.chosenColoursDisplay.length > 0 && this.chosenColoursMatchTypeChosen && this.inkColoursHaveBeenSelected;
        },

        // Step 2 - Type and Colours
        assortmentBalloons() {

            if( this.assortmentSelected ){
                return _.filter(this.typeSelected.colours, colour => _.includes(this.assortmentSelected.assortment_ids, colour.id) );
            }
        },

        chosenColoursDisplay(){
            return this.coloursChosenTypeId ? _.filter(this.colourTypeChosen.colours, colour => _.includes(this.coloursChosen, colour.id) ) : [];
        },

        colourTypeChosen(){
            return this.coloursChosenTypeId ? _.find( this.latexColours, ['id', this.coloursChosenTypeId] ) : null;
        },

        chosenColoursMatchTypeChosen() {
            if(this.coloursChosen.length){
                return this.typeSelected.id === this.coloursChosenTypeId;
            }
            return true;
        },

        // Page 4
        displayPantone1234() {
            let id = this.printingOptionSelected.id;
            return id === 1 || id === 2 || id === 4 || id === 5 || id === 6 || id === 7;
        },

        displayPantone2() {
            return this.printingOptionSelected.artworkColours >= 2;
        },

        displayPantone3() {
            return this.printingOptionSelected.artworkColours >= 3;
        },

        displayPantone4() {
            return this.printingOptionSelected.artworkColours === 4;
        },

        // Page 6
        pantone1234Array() {

            if( this.displayPantone1234 ){

                let pantoneArray = [this.pantone1];

                if( this.displayPantone2 ){
                    pantoneArray.push(this.pantone2);
                }

                if( this.displayPantone3 ){
                    pantoneArray.push(this.pantone3);
                }

                if( this.displayPantone4 ){
                    pantoneArray.push(this.pantone4);
                }

                return pantoneArray;
            }
            return [];
        },

        pantone1234NameList(){

            if( this.displayPantone1234 ){

                let pantoneArray = [];
                let pantoneArrayIndex = [1, 2, 3, 4];

                pantoneArrayIndex.forEach( index => {
                    if( index === 1 || this['displayPantone'+index] ){
                        if( this['pantone'+index].trim().length ){
                            pantoneArray.push( this['pantone'+index].trim() );
                        }
                    }
                });
                return pantoneArray.length ? pantoneArray.join(', ') : false;
            }
            return false;
        },

        coloursSelectedNameList(){

            if(this.chosenColoursDisplay.length){
                let list = _.map(this.chosenColoursDisplay, 'name');
                return list.join(', ');
            }
            return false;
        },

        // Creates a comma separated string to send the ink colours to the pricing calculation endpoint
        inkColoursChosenURLString(){

            let colourString = [];

            this.pantone1234Array.forEach( pantoneColour => {

                if( pantoneColour.trim().length ){
                    colourString.push(pantoneColour.trim());
                }
            });

            if( this.printingOptionSelected.id === 3 ){

                if( this.side1Pantone.trim().length ){
                    colourString.push(this.side1Pantone.trim());
                }
                if( this.side2Pantone.trim().length ){
                    colourString.push(this.side2Pantone.trim());
                }
            }

            if( this.printingOptionSelected.inkChanges && this.inkSwitchPantone.trim().length){
                colourString.push(this.inkSwitchPantone.trim());
            }

            return colourString.join();
        }
    },

    filters: {
        assortImgPath(name, folder){
            return 'https://bballoons.s3.amazonaws.com/printingColours/latexPrintingWizard/'+folder+'/assortment_thumbs/'+_.snakeCase(name)+'.png';
        },

        displayImagePath(name, folder){
            return 'https://bballoons.s3.amazonaws.com/printingColours/latexPrintingWizard/'+folder+'/jpgs/'+_.snakeCase(name)+'.jpg';
        },

        displayAssortImagePath(name, folder){
            return 'https://bballoons.s3.amazonaws.com/printingColours/latexPrintingWizard/'+folder+'/jpgs/'+_.snakeCase(name)+'.jpg';
        },

        displayPrintingOptionPreview(name){
            return 'https://s3-eu-west-1.amazonaws.com/bballoons/printing_wizard/printing_options/'+name+'.png';
        }
    },

    watch: {

        numberBalloons() {
            this.calculatePrice();
        },

        typeSelected() {

            if( this.sizeSelected !== this.typeSelected.sizes[0]){
                this.sizeSelected = this.typeSelected.sizes[0];
            }else{
                this.calculatePrice();
            }
        },

        sizeSelected() {
            this.calculatePrice();
        },

        printingOptionSelected() {
            this.calculatePrice();
        },

        inkColoursChosenURLString(){
            this.calculatePrice();
        },

        neededById() {
            this.calculatePrice();
        },
    }
});
