var axios = require('axios');

var _methods = {
    get: 'get',
    post: 'post',
    put: 'put',
    patch: 'patch',
    'delete': 'delete'
};

/**
 * Rebilly pagination headers for collections and members
 * @type {{}}
 * @private
 */
var _paginationHeaders = {
    /**
     * Amount of records requested at once
     */
    limit: 'pagination-limit',
    /**
     * Offset from which the records were requested
     */
    offset: 'pagination-offset',
    /**
     * Total amount of records for the collection
     */
    total: 'pagination-total'
};

/**
 * Generate an abstraction layer of Axios configured to use Rebilly for the specified host, API version and related API key
 * @param params
 * @constructor
 */
function RebillyApi(params) {
    this._config = params.config;
    this._apiKey = params.apiKey;
    this.init();
}

RebillyApi.prototype = {
    init: function () {
        this._createInstance();
        this._exposeMethods();
    },
    _createInstance: function () {
        this._instance = axios.create({
            baseURL: this._getBaseUrl(),
            timeout: 60000,
            headers: this._getAuthenticatioHeader(),
            withCredentials: true
        });
    },

    /**
     * Generates the base API URL using the provided configuration
     * @returns {string}
     * @private
     */
    _getBaseUrl: function () {
        return 'https://' + this._config.host + this._config.path;
    },

    /**
     * Using "REB-APIKEY" with your private API key will let you authenticate your requests to Rebilly
     * @returns {*}
     * @private
     */
    _getAuthenticatioHeader: function () {
        return {'REB-APIKEY': this._apiKey};
    },

    _interpolateUrl: function (url) {
        return '/' + url;
    },

    _request: function (params) {
        var url = this._interpolateUrl(params.url);
        var method = params.method;
        var config = params.config || null;
        return this._instance[method](url, config);
    },

    _exposeMethods: function () {
        var self = this;
        var generate = function (method) {
            return function (url, config) {
                return self._request({url: url, config: config, method: method});
            }
        };
        for (var method in _methods) {
            this[method] = generate(method);
        }
    },

    _getPaginationHeaders: function (responseHeaders) {
        var config = {};
        for (var paginationHeader in _paginationHeaders) {
            var header = _paginationHeaders[paginationHeader];
            if (header in responseHeaders) {
                config[paginationHeader] = responseHeaders[header];
            }
        }
        return config;
    },

    /**
     * Simple handler to standardize response
     * @param fn
     * @returns {Function}
     */
    responseHandler: function (fn) {
        var self = this;
        return function (response) {
            var data = response.data || {};
            var config = {};
            var rawResponse = response;

            if (Object.keys(response.headers).length) {
                config = self._getPaginationHeaders(response.headers);
            }

            config.status = response.status;
            config.config = response.config;

            return fn(data, config, rawResponse);
        }
    }
};


module.exports = RebillyApi;
