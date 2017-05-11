# rebilly-nodejs-basic
Basic demonstration of using the Rebilly API with Axios (HTTP Client) and an abstraction layer. The [wrapper](lib/api.js) handles the API authentication using the `REB-APIKEY` and exposes Axios request methods and a few other useful features like pagination headers. See the contents of the [main script](index.js) to view an example of how to use the Rebily API in Node JS.

## Setup
- Set your sandbox API key in [api-key.js](data/api-key.js)
- install dependencies with `npm install`

## Run
Use `npm start` to run the basic script (index.js). It will create a customer in your Rebilly sandbox with a random email address, add a contact for the new customer and then list the total amount of customers in your sandbox after a few seconds in your console.

## Links

- [Rebilly API documentation](https://rebilly.github.io/RebillyAPI)
- [Axios (HTTP Client) documentation](https://github.com/mzabriskie/axios)
