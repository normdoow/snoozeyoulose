// Create a Stripe client.
var stripe = Stripe('pk_test_ojswax7TBah8rWdod27onIFO00Szp1i4mf');

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

var userId = 'none'
if(getUrlVars()["user_id"] != null) {
    userId = getUrlVars()["user_id"]
} else {
    userId = generateUUID()
    // insert typeform into html
    var link = document.getElementById("type-form");
    link.setAttribute("href", 'https://noah596066.typeform.com/to/rnaqI8?user_id=' + userId)
}
console.log(userId)

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
                apiRequest('PUT', 'http://localhost:5000/add_stripe_customer?user_id=' + userId + '&payment_method=' + result.setupIntent.payment_method)
            }
        });
    });
}

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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}