/**
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
 * @fileOverview D2L API JS Library client
 * @author Adnan Duric <adnan.duric@desire2learn.com>
 */

function doAPIRequestResponse(host, port, appId, appKey, req, method, data)
{
	var appContext = new D2L.ApplicationContext('localhost', appId, appKey);

	var userId=document.getElementById('userIdField').value;
	var userKey=document.getElementById('userKeyField').value;

	var errorHandler = function(xhr, ajaxOptions, errorThrown) {
		$('#errorField').val("bad");
	};

	var successHandler = function(data) {
		var output;
		if(data == "") return;
		try {
			if(typeof data === 'string') {
				data = JSON.parse(data);
			}
			output = JSON.stringify(data, null, "\t");
		} catch(e) {
			output = 'Unexpected error, data: ' + data;
		}
		$('#responseField').val(output);
		document.getElementById('responseField').hidden = false;
	}

	var url;
	if(userId == '' || userKey == '') {
		//var userContext = appContext.createUserContext(host, port, window.location.href);
		var userContext = appContext.createUserContextWithValues(host, port, '', '');
		url = userContext.createUrlForAuthentication(req, method);
	} else {
			var userContext = appContext.createUserContextWithValues(host, port,userId,userKey);
		if(typeof userContext=="undefined"||typeof userContext.userId=="undefined"||userContext.userId=="") {
			return error(0, "Not authenticated");
		}
		url = userContext.createUrlForAuthentication(req, method);
	}
	switch(method) {
		case 'GET':
			/**
			 * For GET requests, we can use JSONP to do cross-domain requests and this will basically
			 * always work.
			 *
			 * For POST/PUT/DELETE we are more restricted due to the same-origin
			 * policy, and so we use ajax. If this application is running on a different
			 * host from D2L you will need to add the host to your web servers Access-Control-Allow-Origin
			 * and add the necessary HTTP methods (GET, PUT etc.) to Access-Control-Allow-Methods.
			 *
			 * There are serious security problems that could arise from allowing remote origin calls,
			 * so be careful.
			 *
			 * If you are using node.js for server-side JavaScript, things are considerably simpler.
			 */
			$.jsonp({
				url: url,
				callbackParameter: "callback",
				success: successHandler,
				error: errorHandler
			});
			break;
		case 'DELETE':
			$.ajax({
				type: "DELETE",
				url: url,
				success: success,
				error: function(x) { error(0, x); }
			});
			break;
		default: // PUT, POST
			var http = new XMLHttpRequest();
			$.ajax({
				type: method,
				url: url,
				success: successHandler,
				error: function(x) { errorHandler(0, x); },
				dataType: 'text',
				contentType: "application/json",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				data: data
			});
	}
}

function authenticateUserResponse(host, port, appId, appKey) {
	// create an app context
	var appContext = new D2L.ApplicationContext('localhost', appId, appKey);

	// create url
	var callback = window.location.href;
	var url = appContext.createUrlForAuthentication(host, port, callback);

	// go to login page and enter credentials
	window.location = url;
}

$(document).ready(function() {
	var appContext = new D2L.ApplicationContext('localhost', "", "");
	var userContext = appContext.createUserContext("devcop.brightspace.com", 443, window.location.href);
	if(typeof userContext=="undefined"||typeof userContext.userId=="undefined"||userContext.userId=="") {
		return;
	}
	// set the textboxes to show the user id and user key
	document.getElementById('userIdField').value = userContext.userId;
	document.getElementById('userKeyField').value = userContext.userKey;
});
