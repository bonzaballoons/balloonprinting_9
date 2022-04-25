import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

// Todo - auto fill from other forms
// Todo - rest of the validation messages

const orderDetails = new Vue({

    el: '#orderDetails',

    data: {

        customerContactFullName: window.orderDetails.customerContactFullName,
        customerContactEmail: window.orderDetails.customerContactEmail,
        customerContactPhone: window.orderDetails.customerContactPhone,

        deliveryBonzaFullName: window.orderDetails.deliveryBonzaFullName,
        deliveryBonzaAdd1: window.orderDetails.deliveryBonzaAdd1,
        deliveryBonzaAdd2: window.orderDetails.deliveryBonzaAdd2,
        deliveryBonzaCityTown: window.orderDetails.deliveryBonzaCityTown,
        deliveryBonzaPostCode: window.orderDetails.deliveryBonzaPostCode,
        deliveryBonzaCountry: window.orderDetails.deliveryBonzaCountry,

        heliumSupplier: window.heliumSupplier,
        heliumStorageAdd1: window.orderDetails.heliumStorageAdd1,
        heliumStorageAdd2: window.orderDetails.heliumStorageAdd2,
        heliumStorageCityTown: window.orderDetails.heliumStorageCityTown,
        heliumStoragePostCode: window.orderDetails.heliumStoragePostCode,

        hireDeliveryCustomerName: window.orderDetails.hireDeliveryCustomerName,
        hireDeliveryCustomerPhone: window.orderDetails.hireDeliveryCustomerPhone,
        hireDeliveryAdd1: window.orderDetails.hireDeliveryAdd1,
        hireDeliveryAdd2: window.orderDetails.hireDeliveryAdd2,
        hireDeliveryCityTown: window.orderDetails.hireDeliveryCityTown,
        hireDeliveryPostCode: window.orderDetails.hireDeliveryPostCode,

        termsChecked: window.orderDetails.termsChecked,

        basketDetails: window.basketDetails
    },

    mounted() {
        this.createValidationCustomMessages();
    },

    methods: {

        submitForm: function () {

            this.$validator.validateAll().then( (result) => {

                if(result){

                    if(! this.termsChecked){
                        toastr.error('Please make sure you have checked the terms and conditions.');
                        return;
                    }

                    let data = { 'orderDetails' : _.clone( orderDetails.$data )  };

                    axios.post('/api/orderDetails', data).then( () => {

                        window.location.href = location.protocol + "//" + location.host + "/order/overview";

                    }).catch( () => toastr.error('Unfortunately there\'s been a problem adding your order details. Please check your internet connection, refresh your page and try again or, alternatively, phone us on '+window.sitePhone+', and we\'ll try to help.') )

                }else{
                    toastr.error('Please make sure you have filled the form out correctly. Errors will be highlighted in red.');
                }
            });
        },

        createValidationCustomMessages: function() {

            const dict = {
                custom: {
                    customerContactFullName : {
                        required: 'The \'Full Name\' field is required',
                    },

                    customerContactEmail : {
                        required: 'The \'Your Email\' field is required',
                        email: 'The \'Your Email\' must be a valid email'
                    },

                    customerContactPhone: {
                        required: 'The \'Your Daytime Telephone\' field is required'
                    },

                    termsChecked: {
                        required: 'You must agree to the terms and conditions'
                    },

                    deliveryBonzaFullName: {
                        required: 'The \'Recipients Full Name\' field is required'
                    },

                    deliveryBonzaAdd1: {
                        required: 'The \'Recipient Address Line 1\' field is required'
                    },

                    deliveryBonzaPostCode: {
                        required: 'The \'Postcode\' field is required'
                    },

                    hireDeliveryCustomerName: {
                        required: 'The \'Recipients Full Name\' field is required'
                    },

                    hireDeliveryCustomerPhone:  {
                        required: 'The \'Recipient Daytime Phone Number\' field is required'
                    },

                    hireDeliveryAdd1: {
                        required: 'The \'Recipient Address Line 1\' field is required'
                    },

                    hireDeliveryPostCode: {
                        required: 'The \'Postcode\' field is required'
                    },

                    heliumStorageBuildingNumName: {
                        required: 'The \'Building Number or Name\' field is required'
                    },

                    heliumStorageAdd1: {
                        required: 'The \'Address Line 1\' field is required'
                    },

                    heliumStoragePostCode: {
                        required: 'The \'Postcode\' field is required'
                    }
                }
            };

            this.$validator.localize('en', dict);
        }
    }
});
