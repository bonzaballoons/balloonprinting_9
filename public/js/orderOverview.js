/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************************!*\
  !*** ./resources/js/orderOverview.js ***!
  \***************************************/
$(function () {
  var stripe = Stripe(window.stripePubKey);
  $('#checkout').click(function () {
    stripe.redirectToCheckout({
      sessionId: window.checkoutSessionID
    }).then(function (result) {// If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    });
  });
});
/******/ })()
;