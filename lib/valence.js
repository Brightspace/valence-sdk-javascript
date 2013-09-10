/*
 * D2LValence package, js api.
 *
 * Copyright (c) 2012 Desire2Learn Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * This library provides helper classes and functions for use with the Valence
 * Learning Framework API.
 *
 * @fileOverview D2L API JS Library
 * @author Adnan Duric <adnan.duric@desire2learn.com>
 */


/**
 * General namespace value for use with the client SDK.
 *
 * @namespace
 * @this {D2L}
 */
var D2L = D2L || {};

/**
 * This namespace holds service-specific static values and utility functions.
 *
 * @namespace
 * @this {D2L.Auth}
 */
D2L.Auth = {

    // Application auth parameters
    APP_AUTH_ID_PARAM : 'x_a',
    APP_AUTH_KEY_PARAM : 'x_b',
    CALLBACK_PARAM : 'x_target',

    // Operation parameters
    APP_ID_PARAM : 'x_a',
    TOKEN_ID_PARAM : 'x_b',
    SIGNED_APP_PARAM : 'x_c',
    SIGNED_TOKEN_PARAM : 'x_d',

    TIMESTAMP_PARAM : 'x_t',

    AUTH_URL : '/d2l/auth/api/token',

    /**
     * Determine if an URL is decorated with an application context.
     *
     * @param {String} url URL to test
     *
     * @return {Boolean} True if URL has an embedded app ID paramter; otherwise, false.
     */
    isAuthenticated : function(url) {
	if(D2L.Util.parseFromUrl(APP_ID_PARAM, url) != "")
	    return true;
	else
	    return false;
    }

};

/**
 * This namespace holds utility functions for encoding, reading, and signing URLs.
 *
 * @namespace
 * @this {D2L.Util}
 */
D2L.Util = {

    /**
     * Build a full URL for making a Learning Framework API call from its components.
     *
     * This function takes a target web service host and constructs a full URL
     * including the Desire2Learn server address, authentication web-service
     * path, and target path to be used to authenticate the target request.
     *
     * @param {String} host Protocol and host for the URL (for example, "http://some.host.com").
     * @param {String} path API route on the host (for example, "/d2l/api/versions").
     * @param {Number} port Port number on which the service supports the API (for example, "8080").
     * @param {Array} parameters Array of key-value pairs to append as
     * parameters to the URL.
     *
     * @return {String} Full URL to use to make the API call.
     *
     * @this {D2L.Util}
     */
    getTokenUrl : function(host, path, port, parameters) {
	var targetUrl = '';
	targetUrl = host +
	    ":" +
	    port +
	    path +
	    "?";
	var paramList = new Array();
	for(p in parameters) {
	    paramList.push(p + '=' + parameters[p]);
	}
	targetUrl += paramList.join('&');

	return targetUrl;
    },

    /**
     * Retrieve a named query parameter value from an URL.
     *
     * @param {String} name Parameter key name.
     * @param {String} url Parameterized URL.
     *
     * @return {String} Parameter value associated with provided key name, or
     * empty string if no such key found.
     *
     * @this {D2L.Util}
     */
    parseFromUrl : function(name, url) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
	if(results == null)
	    return "";
	else
	    return decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    // Helper to ensure an URL is safe-encoded
    encodeURL : function(url) {
	return encodeURIComponent(url);
    },

    // b64-for-Valence helper used by D2L.Util.Sign()
    base64Url : function(b64) {
	var b64u = b64.replace( /\+/gi, "-" );
	b64u = b64u.replace( /\//gi, "_" );
	b64u = b64u.replace( /\=/gi, "" );

	return b64u;

    },

    /**
     * Sign a signature base string with a key.
     *
     * This method first generates an SHA-256 HMAC from your signature base
     * string, using your key. It then base64 encodes the HMAC and transforms it
     * into an URL-safe, Valence compatible token string by by replacing all '+' and '/'
     * characters with '-' and '_' (respectively), and by removing all '='
     * characters.
     *
     * Note that this method depends on the jsSHA library, which currently needs
     * to be loaded separately.
     *
     * @param {String} data Signature base string to sign.
     * @param {String} key Key to sign with.
     *
     * @return {String} Signature for provided base string.
     *
     * @this {D2L.Util}
     */
    Sign : function(data, key) {
	var hmacObj = new jsSHA( data, "ASCII" );
	var hmac = hmacObj.getHMAC(key,"ASCII","SHA-256","B64");
	var hmac_b64u = this.base64Url( hmac );
	return hmac_b64u;

    },

    // Helper to retrieve a Valence-compatible timestamp from the local system
    // Format should be a Unix-style timestamp, UTC timezone, expressed in seconds.
    getTimestamp : function() {
	var date = new Date();
	var ts =
	    Math.round(
		Date.UTC(
		    date.getUTCFullYear(),
		    date.getUTCMonth(),
		    date.getUTCDate(),
		    date.getUTCHours(),
		    date.getUTCMinutes(),
		    date.getUTCSeconds(),
		    date.getUTCMilliseconds() ) / 1000 );

	return ts;
    },

    // Calculates skew given the body of a 403 response
    calculateSkew : function(response) {
	var matches = /^Timestamp out of range\s*([0-9]+)/.exec(response);
	if(matches == null || matches.length != 2) return 0;
	return matches[1] - D2L.Util.getTimestamp();
    }

};

/**
 * Build a new ApplicationContext instance.
 *
 * An application context stores the state of the application (app URL, app ID,
 * and app Key) and provides methods for authentication. Given the
 * authentication information, it creates a {@link D2L.UserContext} with the
 * appropriate arguments.
 *
 * @param {String} appurl URL of the application.
 * @param {String} appid Application ID as provided by Desire2Learn's key tool.
 * @param {String} appkey Application Key as provided by Desire2Learn's key tool.
 *
 * @constructor
 * @this {D2L.ApplicationContext}
 */
D2L.ApplicationContext =
    function(appurl, appid, appkey) {
	this.appUrl = appurl;
	this.appId = appid;
	this.appKey = appkey;
    };

/**
 * Retrieve a URL the client can use to initiate the authentication process with
 * the back-end service.
 *
 * The client application will use the URL retrieved from this method by passing
 * it to a web control or browser to let the user authetnicate with the back-end
 * service. The callback URI you provide to this function is a URI that the
 * client-application will handle: when the back-end service finishes the
 * user-auth process, it will redirect back to this URI, including the User ID
 * and User Key tokens as quoted parameters.
 *
 * Note that this method uses {@link D2L.Util.getTokenUrl} to build the returned
 * authentication URL.
 *
 * @param {String} host Host name for the back-end service.
 * @param {Number} port Port the service uses for route requests.
 * @param {String} callback Client-application-handled callback URI.
 *
 * @return {String} url URL string.
 *
 * @this {D2L.ApplicationContext}
 */
D2L.ApplicationContext.prototype.createUrlForAuthentication =
    function(host, port, callback) {
	var params = new Array();
	params[D2L.Auth.CALLBACK_PARAM] = D2L.Util.encodeURL(callback);
	params[D2L.Auth.APP_AUTH_ID_PARAM] = this.appId;
	params[D2L.Auth.APP_AUTH_KEY_PARAM] = D2L.Util.Sign(callback, this.appKey);
	params[D2L.Auth.TIMESTAMP_PARAM] = D2L.Util.getTimestamp();

	var url = D2L.Util.getTokenUrl(host,
				       D2L.Auth.AUTH_URL,
				       port,
				       params);

	return url;
    };


/**
 * Build a new authenticated-user context the client application can use to
 * create decorated URLs for invoking routes on the back-end service API.
 *
 * @param {String} host Host name for the back-end service.
 * @param {String} port Port the service uses for route requests.
 * @param {String} url Entire result URI the service sent back with redirect
 * after user auth, from which to extract the token information.
 *
 * @return {D2L.UserContext} The new user context.
 *
 * @this {D2L.ApplicationContext}
 */
D2L.ApplicationContext.prototype.createUserContext =
    function(host, port, url, skew) {

	// TODO: parse out the url to create the tokenid, tokenkey
	var tokenid = D2L.Util.parseFromUrl(D2L.Auth.APP_ID_PARAM, url);
	var tokenkey = D2L.Util.parseFromUrl(D2L.Auth.TOKEN_ID_PARAM, url);
	var serverTime = D2L.Util.parseFromUrl(D2L.Auth.TIMESTAMP_PARAM, url);

	// create a user context
	return new D2L.UserContext({'host' : host,
				    'port' : port,
				    'userId' : tokenid,
				    'userKey' : tokenkey,
				    'appId' : this.appId,
				    'appKey' : this.appKey,
				    'serverOffset' : serverTime,
				    'skew': skew || 0});

    };

/**
 * Build a new authenticated-user context the client application can use to
 * create decorated URLs for invoking routes on the back-end service API.
 *
 * @param {String} host Host name for the back-end service.
 * @param {String} port Port the service uses for route requests.
 * @param {String} url Entire result URI the service sent back with redirect
 * @param {String} userId The D2L user ID to use
 * @param {String} userKey The D2L user key to use
 * after user auth, from which to extract the token information.
 *
 * @return {D2L.UserContext} The new user context.
 *
 * @this {D2L.ApplicationContext}
 */
D2L.ApplicationContext.prototype.createUserContextWithValues =
    function(host, port, userId, userKey, skew) {

	// create a user context
	return new D2L.UserContext({'host' : host,
				    'port' : port,
				    'userId' : userId,
				    'userKey' : userKey,
				    'appId' : this.appId,
				    'appKey' : this.appKey,
				    'serverOffset' : 0,
				    'skew': skew || 0});

    };

/**
 * Build a new UserContext instance.
 *
 * A user context stores the state of the authenticated application context
 * as well as the state of the current authenticated user. It provides methods
 * useful for crafting URLs for calling the Learning Framework API routes.
 *
 * If the user context state is already known (the user has already
 * authenticated), then you can rebuild a new user context by providing in a
 * UserContextParameters structure containing the appropriate cached state.
 *
 * Typically, however, you use createUserContext() on a {@link D2L.ApplicationContext}
 * to build a new user context.
 *
 * @param {Object} parameters User context state object (UserContextParameters).
 *
 * @constructor
 * @this {D2L.UserContext}
 */
D2L.UserContext =
    function(parameters) {
	// bind params to UserContext context
	this.host = parameters.host;
	this.port = parameters.port;
	this.userId = parameters.userId;
	this.userKey = parameters.userKey;
	this.appId = parameters.appId;
	this.appKey = parameters.appKey;
	this.serverOffset = parameters.serverTime;
	this.timestamp = parameters.skew + D2L.Util.getTimestamp();
    };


/**
 * Retrieves an appropriately decorated URI for invoking a REST route on the
 * back-end service.
 *
 * @param {String} path REST route for the action to invoke.
 * @param {String} method HTTP method to use with the route for the action.
 *
 * @return {String} The signed and encoded URL.
 *
 * @this {D2L.UserContext}
 */
D2L.UserContext.prototype.createUrlForAuthentication =
    function(path, method) {
	var params = new Array();
	params[D2L.Auth.APP_ID_PARAM] = this.appId;
	var path2 = decodeURI(path).toLowerCase();
	if(typeof this.userId !="undefined") {
		params[D2L.Auth.TOKEN_ID_PARAM] = this.userId;
		params[D2L.Auth.SIGNED_TOKEN_PARAM] =
	    D2L.Util.Sign(method.toUpperCase() +
			  '&' +
			  path2 +
			  '&' +
			  this.timestamp,
			  this.userKey);
	}
	params[D2L.Auth.SIGNED_APP_PARAM] =
	    D2L.Util.Sign(method.toUpperCase() +
			  '&' +
			  path2 +
			  '&' +
			  this.timestamp,
			  this.appKey);

	params[D2L.Auth.TIMESTAMP_PARAM] = this.timestamp;

	var url = D2L.Util.getTokenUrl(this.host,
				       path,
				       this.port,
				       params);

	return url;
    };

if(typeof window === 'undefined') { // node.js
    var crypto = require('crypto');
    var jsSHA = function(data) {
        this.data = data;
    }
    jsSHA.prototype.getHMAC = function(key) {
        var hash = crypto.createHmac('sha256', key);
        hash.update(this.data);
        return hash.digest('base64');
    }
    for(var X in D2L) {
        if(D2L.hasOwnProperty(X)) {
            exports[X] = D2L[X];
        }
    }
}
