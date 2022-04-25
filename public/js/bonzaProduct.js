/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./resources/js/bonzaProduct.js ***!
  \**************************************/
$(document).ready(function () {
  $("#addProductButton").click(function () {
    var productQuantity = $('#product_quantity').val();

    if (productQuantity === 0 || !productQuantity > 0) {
      $("#product_quantity").val(1);
      productQuantity = 1;
    }

    var data = {
      id: _.last(window.location.pathname.split('/')),
      quantity: productQuantity,
      pagePath: window.location.pathname
    }; // See if product has a delivery option - at moment only with disposable helium

    var deliveryOption = $("#deliveryOptionSelect");

    if (deliveryOption.length) {
      data.deliveryOptionID = deliveryOption.val();
    }

    axios.post('/api/basketAddBonza', data).then(function () {
      updateBasketCount();
      $("#basketAddedModal").modal('show');
    })["catch"](function () {
      toastr.error('Unfortunately there\'s been a problem adding this item to the basket. Please refresh the page / check your internet connection and try again.');
    });
  });
});
/******/ })()
;