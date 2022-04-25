import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
Vue.use(flatPickr);

// Disable Weekends
window.excludeDates.push( function (date) {
    return (date.getDay() === 0 || date.getDay() === 6);
});

const basketView = new Vue({

    el: '#basketView',

    data: {
        numberItems: window.numberItems,
        bonzaProducts: window.bonzaProducts,
        heliumHireCollections: window.heliumHireCollections,
        heliumHireDeliveries: window.heliumHireDeliveries,
        printedLatexFromWizard: window.printedLatexFromWizard,
        printedLatexGiantFromWizard: window.printedLatexGiantFromWizard,
        printedFoilFromWizard: window.printedFoilFromWizard,

        hasBonzaProducts: window.hasBonzaProducts,
        hasBonzaPrintedProducts:  window.hasBonzaPrintedProducts,

        hireDeliveryDiscount: window.hireDeliveryDiscount,
        basketSubtotal: window.basketSubtotal,
        totalPostageWeight: window.totalPostageWeight,
        totalPostageWeightPrice: window.totalPostageWeightPrice,
        totalPrice: window.totalPrice,
        postageWeightId : window.postageWeightId,

        heliumSupplier: window.heliumSupplier,
        postcode: window.depotPostcode,
        postageWeights : window.postageWeights,
        expressFees : window.expressFees,
        expressFeeTotal : window.expressFeeTotal,
        deliveryDateWithin5WorkingDays : window.deliveryDateWithin5WorkingDays,

        calculatingPrice: false,
        loadingSuppliers: false,
        supplierList: [],

        bonzaProductsDeliveryDate: window.bonzaProductsDeliveryDate,
        bonzaProductsDeliveryDateFpOptions: {
            altFormat:	"d/m/Y",
            altInput: true,
            dateFormat: "Y-m-d",
            disable: window.excludeDates,
            minDate: window.minDate
        },
    },

    methods: {

        removeProduct : function(arrayName, arrayKey) {

            this.calculatingPrice = true;

            let data = {
                'arrayName' : arrayName,
                'arrayKey' : arrayKey
            };

            axios.post('/api/basketRemoveProduct', data).then( response => {

                this.calculatingPrice = false;

                $("#basketNumberItems").text( response.data.numberItems );

                this[arrayName] = response.data.newArray;

                this.numberItems = response.data.numberItems;
                this.hireDeliveryDiscount = response.data.hireDeliveryDiscount;
                this.totalPostageWeight = response.data.totalPostageWeight;
                this.totalPostageWeightPrice = response.data.totalPostageWeightPrice;
                this.basketSubtotal = response.data.basketSubtotal;
                this.totalPrice = response.data.totalPrice;
                this.postageWeights = response.data.postageWeights;
                this.expressFees = response.data.expressFees;
                this.hasBonzaProducts = response.data.hasBonzaProducts;
                this.hasBonzaPrintedProducts = response.data.hasBonzaPrintedProducts;

            }).catch( () => {

                this.calculatingPrice = false;
                toastr.error('Unfortunately there\'s been a problem removing your product. Please refresh the page / check your internet connection and try again.');
            });
        },

        minusQuantity : function(arrayName, arrayKey, quantity) {
            quantity = Number(quantity) - 1;
            if(quantity > 0){
                this.changeQuantity(arrayName, arrayKey, quantity);
            }
        },

        addQuantity : function(arrayName, arrayKey, quantity) {
            quantity = Number(quantity) + 1;
            this.changeQuantity(arrayName, arrayKey, quantity);
        },

        changeInputQuantity : _.debounce( function(arrayName, arrayKey, quantity) {

            if( quantity === 0 ||  quantity < 0 ){
                quantity = 1;
            }

            this[arrayName][arrayKey].quantity = Math.ceil(quantity);
            this.changeQuantity(arrayName, arrayKey,  Math.ceil(quantity) );

        }, 1000),

        changeQuantity : function (arrayName, arrayKey, quantity) {

            this[arrayName][arrayKey].calculatingPrice = true;
            this.calculatingPrice = true;

            let data = {
                'arrayName' : arrayName,
                'arrayKey' : arrayKey,
                'quantity' : quantity
            };

            axios.post('/api/basketChangeProductQuantity', data).then( response => {

                this[arrayName][arrayKey].calculatingPrice = false;
                this.calculatingPrice = false;

                this[arrayName][arrayKey] = response.data.product;

                $("#navBasketTotalPrice").text( response.data.numberItems );

                this.numberItems = response.data.numberItems;
                this.totalPostageWeight = response.data.totalPostageWeight;
                this.totalPostageWeightPrice = response.data.totalPostageWeightPrice;
                this.postageWeights = response.data.postageWeights;
                this.basketSubtotal = response.data.basketSubtotal;
                this.totalPrice = response.data.totalPrice;
                this.hireDeliveryDiscount = response.data.hireDeliveryDiscount;
                this.expressFees = response.data.expressFees;

            }).catch( () => {

                this[arrayName][arrayKey].calculatingPrice = false;
                this.calculatingPrice = false;

                toastr.error('Unfortunately there\'s been a problem changing the quantities in your basket. Please refresh the page / check your internet connection and try again.');
            });
        },

        changePostageWeight: function (postageWeightId) {

            this.calculatingPrice = true;

            axios.post('/api/basketChangePostageWeightId', { 'postageWeightId' : postageWeightId } ).then( response => {

                this.calculatingPrice = false;

                $("#navBasketTotalPrice").text( response.data.numberItems );

                this.totalPostageWeightPrice = response.data.totalPostageWeightPrice;
                this.basketSubtotal = response.data.basketSubtotal;
                this.totalPrice = response.data.totalPrice;

            }).catch( () => {
                toastr.error('Unfortunately there\'s been a problem updating your delivery option. Please refresh the page / check your internet connection and try again.');
            });
        },

        changeHeliumSupplier : function (productID) {

            this.loadingSuppliers = true;
            this.supplierList = [];

            // Open Modal
            $('#modalSearchDepot').modal('show');

            axios.get('/api/heliumSearchSuppliers/'+this.postcode+'/'+productID).then(response => {

                this.loadingSuppliers = false;
                this.supplierList = response.data.suppliers.map( supplier => {
                    supplier.price = supplier.groupId === 1 ? this.bocCollectPrice : this.apCollectPrice;
                    return supplier;
                });
            });
        },

        selectSupplier: function (supplier) {

            this.heliumSupplier = supplier;
            $('#modalSearchDepot').modal('hide');

            axios.post('/api/heliumAddSupplierToSession', {
                supplier: this.heliumSupplier,
            });

            // Todo - helium add error - check helium page also

            // Todo - customer notification
        },
    },

    computed: {

        allPostageWeightItems(){
            return _.concat( this.bonzaProducts, this.printedLatexFromWizard, this.printedLatexGiantFromWizard, this.printedFoilFromWizard);
        },

        warningForTurnaroundTime(){

            return this.deliveryDateWithin5WorkingDays && (this.printedFoilFromWizard.length || this.printedLatexGiantFromWizard.length);
        },

        showDeliveryDateWarning(){
            return this.hasBonzaProducts && !this.bonzaProductsDeliveryDate;
        },

        showContinueButton(){

            let showBool = true;

            if( this.hasBonzaPrintedProducts ){
                showBool = showBool && !this.warningForTurnaroundTime;
            }

            if( this.hasBonzaProducts ){
                showBool = showBool && this.bonzaProductsDeliveryDate;
            }

            return showBool;
        }
    },

    filters: {

        imgThumb: function (refNum) {
            return 'http://bballoons.s3.amazonaws.com/converted_png/'+refNum+'_100.png';
        },

        gramsToKg(grams){
            let kg = grams / 1000;
            return kg.toFixed(2);
        }
    },

    watch: {

        postageWeightId(newVal){
            this.changePostageWeight(newVal)
        },

        bonzaProductsDeliveryDate(newVal){

            this.calculatePrice = true;

            axios.post('/api/basketAddDeliveryDate', { 'deliveryDate' : newVal }).then( response => {

                this.totalPostageWeight = response.data.totalPostageWeight;
                this.totalPostageWeightPrice = response.data.totalPostageWeightPrice;
                this.postageWeights = response.data.postageWeights;
                this.basketSubtotal = response.data.basketSubtotal;
                this.totalPrice = response.data.totalPrice;
                this.expressFees =  response.data.expressFees;
                this.expressFeeTotal = response.data.expressFeeTotal;
                this.deliveryDateWithin5WorkingDays = response.data.deliveryDateWithin5WorkingDays;
                this.printedLatexFromWizard = response.data.printedLatexFromWizard;

                this.calculatePrice = false;

            }).catch( () => {

                this.calculatePrice = false;
                toastr.error('Unfortunately there\'s been a problem calculating postage options. Please refresh the page / check your internet connection and try again.');
            });

        }
    }
});