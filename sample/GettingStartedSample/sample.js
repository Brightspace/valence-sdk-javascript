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

/******************************************************
/ Javascript functions for the sample HTML file       /
******************************************************/

var host;
var port;
var appId;
var appKey;
var userId;
var userKey;

function updateCookies() {
	var values = getCookie();
	values.host = document.getElementById('hostField').value;
	values.port = document.getElementById('portField').value;
	values.scheme = document.getElementById('schemeField').checked ? "https" : "http";
	values.appId = getAppId();
	values.appKey = getAppKey();
	setCookie(values);
}

function authenticateUser()
{
	host = document.getElementById('hostField').value;
	port = document.getElementById('portField').value;
	scheme = document.getElementById('schemeField').checked ? "https" : "http";
	appId = getAppId();
	appKey = getAppKey();

	updateCookies();

	authenticateUserResponse(scheme + "://" + host, port, appId, appKey);
}

function deauthenticate() {
	var values = getCookie();
	delete values.userId;
	delete values.userKey;
	setCookie(values);
	window.location.replace('index.html');
}

function doAPIRequest() {
	updateCookies();

	scheme = document.getElementById('schemeField').checked ? "https" : "http";
	host = document.getElementById('hostField').value;
	port = document.getElementById('portField').value;
	var req = document.getElementById('actionField').value;
	var method = $('#GETField').is(':checked') ? 'GET' :
	             $('#POSTField').is(':checked') ? 'POST' :
	             $('#PUTField').is(':checked') ? 'PUT' : 'DELETE';
	var data = $('#dataField').val();
	appId = getAppId();
	appKey = getAppKey();

	doAPIRequestResponse(scheme + "://" + host, port, appId, appKey, req, method, data);
}

/**
 * Returns the D2L app Id.
 *
 * Please note this is inherently insecure as other applications may use the app Id and app Key to impersonate this app.
 * Making an attempt to not leave it simple for the app Id and app Key to be discovered is advised.
 * Administrators will use greater scrutiny in approving apps with exposed keys.
 */
function getAppId() {
	return document.getElementById('appIdField').value;
}

/**
 * Returns the D2L app Id.
 *
 * Please note this is inherently insecure as other applications may use the app Id and app Key to impersonate this app.
 * Making an attempt to not leave it simple for the app Id and app Key to be discovered is advised.
 * Administrators will use greater scrutiny in approving apps with exposed keys.
 */
function getAppKey() {
	 return document.getElementById('appKeyField').value
}
