import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
Vue.use(flatPickr);

// Disable Weekends
excludeDates.push( function (date) {
    return (date.getDay() === 6 || date.getDay() === 0);
});

const moment = require('moment');

let HeliumProductView = new Vue({

    el: '#heliumProductView',

    data: {
        productID: '',
        balloonTypeID: '',
        collectOrDeliveryPrice: 'collected',

        // Calender Options
        fpOptionsCollectStartDate : {
            altFormat:	"d/m/Y",
            altInput: true,
            dateFormat: "Y-m-d",
            disable: excludeDates,
            minDate: hireCollectMinDate
        },

        fpOptionsCollectEndDate : {
            altFormat:	"d/m/Y",
            altInput: true,
            dateFormat: "Y-m-d",
            disable: excludeDates,
            minDate: hireCollectMinDate
        },

        fpOptionsDeliveryStartDate : {
            altFormat:	"d/m/Y",
            altInput: true,
            dateFormat: "Y-m-d",
            disable: excludeDates,
            minDate: hireDeliveryMinDate
        },

        fpOptionsDeliveryEndDate : {
            altFormat:	"d/m/Y",
            altInput: true,
            dateFormat: "Y-m-d",
            disable: excludeDates,
            minDate: hireDeliveryMinDate
        },

        collectStartDate: hireCollectMinDate,
        collectEndDate: hireCollectMaxDate,
        collectAdditionalDays: 0,
        collectAdditionalWeeks: 0,
        collectAdditionalPrice: 0,
        collectDateBeforeWarning: false,

        deliveryStartDate: hireDeliveryMinDate,
        deliveryEndDate: hireDeliveryMaxDate,
        deliveryAdditionalDays: 0,
        deliveryAdditionalWeeks: 0,
        deliveryAdditionalPrice: 0,
        deliveryDateBeforeWarning: false,

        deliveryPrice: deliveryPrice,
        apCollectPrice: apCollectPrice,
        bocCollectPrice: bocCollectPrice,
        collectPriceRange: collectPriceRange,
        collectPrice: collectPrice,
        supplierGroupIdsCanCollectFrom: supplierGroupIdsCanCollectFrom,

        saveTotal: 0,
        postcode: postcode,
        postcodeNotFound: false,
        loadingSuppliers: false,
        supplierList: [],
        supplierSelected: supplier,
        pagePath : ''
    },

    mounted: function(){

        this.productID = _.last( window.location.pathname.split( '/' ) );
        this.balloonTypeID = $("#balloonTypeIDFirst").val();
        this.pagePath = window.location.pathname;

        this.calculateAdditionalWeeks(this.collectStartDate, this.collectEndDate, 'collect');
        this.calculateAdditionalWeeks(this.deliveryStartDate, this.deliveryEndDate, 'delivery');
    },

    methods: {

        searchDepot: function(){

            this.loadingSuppliers = true;
            this.supplierList = [];
            this.postcodeNotFound = false;

            // Open Modal
            if(this.postcode.trim().length){

                $('#modalSearchDepot').modal('show');

                axios.get('/api/heliumSearchSuppliers/'+this.postcode+'/'+this.productID).then(response => {

                    if( response.data.postcodeNotFound ){

                        this.postcodeNotFound = true;
                        this.loadingSuppliers = false;
                        return;
                    }

                    this.loadingSuppliers = false;
                    this.supplierList = response.data.suppliers.map( supplier => {
                        supplier.price = supplier.groupId === 1 ? this.bocCollectPrice : this.apCollectPrice;
                        return supplier;
                    });
                });
            }
        },

        selectSupplier: function (supplier) {

            this.supplierSelected = supplier;
            $('#modalSearchDepot').modal('hide');

            axios.post('/api/heliumAddSupplierToSession', { supplier: this.supplierSelected }).then( () => {
                updateBasketCount();
            });
        },

        changeDepot: function (e) {
            e.preventDefault();
            this.supplierSelected = false;
        },

        addToBasket: function () {

            let productQuantity = $("#product_quantity").val();

            if( ! productQuantity > 0 ){
                productQuantity = 1;
            }

            if( this.collectOrDeliveryPrice === 'collected' && !this.supplierSelected){
                toastr.error('Please select the depot you\'d like to collect the hire cylinder from. You can search for your nearest depot using the box above!');
                return;
            }

            let data = {
                id: this.productID,
                quantity: productQuantity,
                balloonTypeID: this.balloonTypeID,
                collectOrDeliveryPrice: this.collectOrDeliveryPrice,
                pagePath : window.location.pathname
            };

            if(this.collectOrDeliveryPrice === 'collected'){

                data.startDate = this.collectStartDate;
                data.endDate = this.collectEndDate;
                data.additionalWeeks = this.collectAdditionalWeeks;
                data.additionalWeekPrice = this.collectAdditionalPrice;

            }else{ // delivered

                data.startDate = this.deliveryStartDate;
                data.endDate = this.deliveryEndDate;
                data.additionalWeeks = this.deliveryAdditionalWeeks;
                data.additionalWeekPrice = this.deliveryAdditionalPrice;
            }

            axios.post('/api/basketAddHelium', data).then(function () {

                updateBasketCount();
                $("#basketAddedModal").modal('show');

            }).catch(function () {
                toastr.error('Unfortunately there\'s been a problem adding this item to the basket. Please refresh the page / check your internet connection and try again.');
            });
        },
        
        calculateAdditionalWeeks: function (startDate, endDate, orderType) {

            this[orderType+'DatesNotValid'] = false;
            this[orderType+'DateBeforeWarning'] = false;

            startDate = moment(startDate);
            endDate = moment(endDate);

            if( startDate.isBefore(endDate) ){

                // Add 1 day because we include start day in difference in calculation
                let differenceInDays = endDate.diff(startDate, 'days') + 1;
                let additionalWeeks = 0;
                let additionalDays = 0;

                if(differenceInDays > 28){
                    additionalDays = differenceInDays - 28;
                    additionalWeeks = Math.ceil(additionalDays / 7);
                }

                this[orderType+'AdditionalDays'] = additionalDays;
                this[orderType+'AdditionalWeeks'] = additionalWeeks;
                this[orderType+'AdditionalPrice'] = additionalWeeks * 8.95;

            }else{
                this[orderType+'DateBeforeWarning'] = true;
            }
        }
    },

    computed: {
        canCollectFromCurrentDepot(){
            return this.supplierSelected ? _.includes(this.supplierGroupIdsCanCollectFrom, this.supplierSelected.groupId) : true;
        }
    },

    watch: {
        // Set up watchers
        collectStartDate () {
            this.calculateAdditionalWeeks(this.collectStartDate, this.collectEndDate, 'collect');
        },

        collectEndDate() {
            this.calculateAdditionalWeeks(this.collectStartDate, this.collectEndDate, 'collect');
        },

        deliveryStartDate() {
            this.calculateAdditionalWeeks(this.deliveryStartDate, this.deliveryEndDate, 'delivery');
        },

        deliveryEndDate() {
            this.calculateAdditionalWeeks(this.deliveryStartDate, this.deliveryEndDate, 'delivery');
        }
    }

});