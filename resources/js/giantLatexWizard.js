import giantLatexTypes from './data/giantLatexTypes';
import uppy from './components/uppy.vue';

const bus = new Vue();

const giantLatexWizard = new Vue({

    el: '#giantLatexWizard',

    components: {uppy},

    data: {
        // Global
        priceWithoutVat: 0,
        priceWithVat: 0,
        pricePerBalloon: 0,
        calculatingPrice: false,
        loadingBasket: false,

        numberBalloons : 10,

        sizeOptions : [
            { name: '2ft Balloons', size: 2 },
            { name: '3ft Balloons', size: 3 },
        ],
        sizeOptionSelected: 2,

        sideOptions : [
            { name: '1 Colour on 1 Side', sides: 1 },
            { name: '1 Colour on 2 Sides', sides: 2 },
        ],
        sideOptionSelected : 1,

        artworkInkColour: 'Black',
        addCustomArtworkInkColour: '',

        giantLatexTypes : giantLatexTypes,
        giantLatexTypeSelected : giantLatexTypes[0],

        colourSelected : null,
        colourRemoveOption : false,
        assortmentSelected: null,
        coloursChosen: [],
        coloursChosenTypeId: null,
        displayImgSrc: '',

        uploadedArtwork: [],
        artworkText: '',
        artworkFont: ''
    },

    mounted() {
        this.calculatePrice();
    },

    created() {
        bus.$on('addArtwork', this.addArtwork);
    },

    methods: {

        showColourPreview(colour, removeOption = null){
            this.colourSelected = colour;
            this.colourRemoveOption = removeOption;

            if(this.colourRemoveOption){
                this.displayImgSrc = 'https://bballoons.s3.amazonaws.com/printingColours/latexGiant/'+_.toLower(this.colourTypeChosen.name)+'/'+_.snakeCase(colour.name)+'.jpg';
            }else{
                this.displayImgSrc = 'https://bballoons.s3.amazonaws.com/printingColours/latexGiant/'+_.toLower(this.giantLatexTypeSelected.name)+'/'+_.snakeCase(colour.name)+'.jpg';
            }
            $('#colourPickerInfo').modal('show');
        },

        addColour(){
            $('#colourPickerInfo').modal('hide');
            this.coloursChosenTypeId = this.giantLatexTypeSelected.id;
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

        addInkColour(Colour){
            this.artworkInkColour = Colour;
            $('#inkColourChangeModal').modal('hide');
        },

        addCustomInkColour(){
            if( this.addCustomArtworkInkColour.length ){
                this.artworkInkColour = this.addCustomArtworkInkColour;
                $('#inkColourChangeModal').modal('hide');
            }
        },

        addArtwork(result){
            this.uploadedArtwork.push(result);
        },

        removeArtwork(index){
            // todo - delete from s3
            this.uploadedArtwork.splice(index, 1);
        },

        calculatePrice(){

            if( this.numberBalloons > 0 ){

                this.calculatingPrice = true;

                let options = { params : {
                    numberBalloons: this.numberBalloons,
                    size: this.sizeOptionSelected,
                    sides: this.sideOptionSelected,
                    typeSelectedName: this.giantLatexTypeSelected.name
                } };

                axios.get('/api/giantLatexPrintingPrice', options).then( response => {

                    this.priceWithVat = _.round(response.data.totalPriceWithVat, 2);
                    this.pricePerBalloon = _.round(response.data.pricePerBalloon, 2);
                    this.priceWithoutVat = _.round(response.data.totalPriceWithoutVat, 2);
                    this.calculatingPrice = false;

                }).catch( () => {
                    toastr.error('There was an error fetching the price. Please check your internet connection and try again');
                    this.calculatingPrice = false;
                });
            }
        },

        addToBasket(){

            if( this.numberBalloons > 0 && this.coloursSelectedNameList.length ){

                this.loadingBasket = true;
                let data = _.clone(giantLatexWizard.$data);
                // Add computed props required by PrintedGiantLatexWizardProduct object
                data.coloursSelectedNameList = this.coloursSelectedNameList;

                axios.post('/api/basketAddPrintedWizardLatexGiant', { 'json' : JSON.stringify( data ) } ).then( () => {

                    this.loadingBasket = false;
                    updateBasketCount();
                    $("#basketAddedModal").modal('show');

                }).catch( () => {

                    this.loadingBasket = false;
                    toastr.error('Sorry, your printed balloons failed to add to the basket. Please check your internet connection and try again. Alternatively, please give us a call so we can help you resolve the issue.');
                });
            }
        }
    },

    computed: {

        chosenColoursDisplay(){
            return this.coloursChosenTypeId ? _.filter(this.colourTypeChosen.colours, colour => _.includes(this.coloursChosen, colour.id) ) : [];
        },

        colourTypeChosen(){
            return this.coloursChosenTypeId ? _.find( this.giantLatexTypes, ['id', this.coloursChosenTypeId] ) : null;
        },

        chosenColoursMatchTypeChosen() {
            if(this.coloursChosen.length){
                return this.giantLatexTypeSelected.id === this.coloursChosenTypeId;
            }
            return true;
        },

        coloursSelectedNameList(){

            if(this.chosenColoursDisplay.length){
                let list = _.map(this.chosenColoursDisplay, 'name');
                return list.join(', ');
            }
            return false;
        },
    },

    watch: {

        numberBalloons() {
            this.calculatePrice();
        },

        sizeOptionSelected() {
            this.calculatePrice();
        },

        sideOptionSelected() {
            this.calculatePrice();
        },

        giantLatexTypeSelected() {
            this.calculatePrice();
        }
    },
});