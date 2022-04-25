$(function() {
    const stripe = Stripe(window.stripePubKey);

    $('#checkout').click(() =>{

        stripe.redirectToCheckout({
            sessionId: window.checkoutSessionID
        }).then((result) => {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        });
    });
});
