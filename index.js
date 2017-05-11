var config = require('./data/config');
var apiKey = require('./data/api-key').apiKey;
var RebillyApi = require('./lib/api');
var utils = require('./lib/utils');

var api = new RebillyApi({config: config, apiKey: apiKey});

var requestError = function (error) {
    console.log(error);
};

function getCustomers() {
    var handler = api.responseHandler(function (customers, config, rawResponse) {
        /**
         * Config is populated by the handler and exposes:
         * config.total - total amount of records
         * config.limit - amount of records fetched at once, defaults to 100
         * config.offset - offset from which to get the records
         * config.status - HTTP status received
         * config.config - original payload passed to Axios
         */
        console.log('Found %s customers', config.total);
    });

    return api.get('customers').then(handler).catch(requestError);
}

function createCustomer() {
    var customerHandler = api.responseHandler(function (customer, config, rawResponse) {
        console.log('Created a new customer with ID %s from email %s', customer.id, customer.email);
        //see API documentation for creating a contact
        // https://rebilly.github.io/RebillyAPI/#tag/Contacts%2Fpaths%2F~1contacts%2Fpost
        var contactPayload = {
            customerId: customer.id,
            firstName: customer.email.split('@').shift()
        };
        var contactHandler = api.responseHandler(function (contact, config, rawResponse) {
            console.log('Created contact %s for customer %s', contact.id, customer.id);
        });

        return api.post('contacts', contactPayload).then(contactHandler).catch(requestError);
    });
    //see API documentation for creating a customer at
    // https://rebilly.github.io/RebillyAPI/#tag/Customers%2Fpaths%2F~1customers%2Fpost
    var payload = {
        email: 'test_' + utils.randomString() + '@rebilly.com'
    };

    return api.post('customers', payload).then(customerHandler).catch(requestError);
}


getCustomers()
    .then(createCustomer)
    .then(function () {
        //wait for API to process new customer and update data then poll again
        setTimeout(getCustomers, 2000);
    });

