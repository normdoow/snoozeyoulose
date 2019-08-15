// Create a Stripe client.
var stripe = Stripe('pk_test_7tSD9h8SzUBIQYzH36qnlQTI');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
        color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
// card.addEventListener('change', function(event) {
//     var displayError = document.getElementById('card-errors');
//     if (event.error) {
//         displayError.textContent = event.error.message;
//     } else {
//         displayError.textContent = '';
//     }
// });

apiRequest('GET', 'http://localhost:5000/signup_button', onReceiveClientSecret)


function onReceiveClientSecret(clientSecret) {
    // var form = document.getElementById('save-button');


    var cardholderName = document.getElementById('cardholder-name');
    var cardButton = document.getElementById('card-button');
    // var clientSecret = cardButton.dataset.secret;

    cardButton.addEventListener('click', function(ev) {
        console.log('clicked submit')
        stripe.handleCardSetup(
            clientSecret, card, {
                payment_method_data: {
                    billing_details: {name: cardholderName.value}
                }
            }
        ).then(function(result) {
            if (result.error) {
                // Display error.message in your UI.
            } else {
                // The setup has succeeded. Display a success message.
                console.log('success got token', result)
                apiRequest('PUT', 'http://localhost:5000/add_stripe_customer?user_id=' + '2343434' + '&=intent' + result)
            }
        });
    });
}

// Submit the form with the token ID.
// function stripeTokenHandler(token) {
//     // Insert the token ID into the form so it gets submitted to the server
//     var form = document.getElementById('payment-form');
//     var hiddenInput = document.createElement('input');
//     hiddenInput.setAttribute('type', 'hidden');
//     hiddenInput.setAttribute('name', 'stripeToken');
//     hiddenInput.setAttribute('value', token.id);
//     form.appendChild(hiddenInput);

//     // Submit the form
//     form.submit();
// }



function apiRequest(method, url, onSuccess) {
    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup our listener to process completed requests
    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // What do when the request is successful
            console.log('success!', xhr.responseText);
            onSuccess(xhr.responseText);
        } else {
            // What do when the request fails
            console.log('The request failed!');
        }
    };

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    xhr.open(method, url);
    xhr.send();
}