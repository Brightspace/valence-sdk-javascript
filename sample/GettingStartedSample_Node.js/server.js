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

var express = require('express');
var mu = require('mu2');
var util = require('util');
var http = require('http');
var https = require('https');
var D2L = require('../../lib/valence.js');

var app = express();
var store = new express.session.MemoryStore;

app.use(express.cookieParser());
app.use(express.session({ secret: 'SuperSecretKeyForCookies', store: store }));

function setProps(req, update) {
    req.session.props = req.session.props || {};
    var props = req.session.props;

    if(typeof props.Scheme === 'undefined') props.Scheme = 'https';
    else if(update) props.Scheme = req.param('schemeField') ? 'https' : 'http';
    props.HTTPS = props.Scheme === 'http' ? '' : 'checked="true"';

    props.Host = req.param('hostField') || props.Host || 'valence.desire2learn.com';
    props.Port = req.param('portField') || props.Port || '443';

    props.AppKey = req.param('appKeyField') || props.AppKey || 'ybZu7fm_JKJTFwKEHfoZ7Q';
    props.AppID = req.param('appIDField') || props.AppID || 'G9nUpvbZQyiPrk3um2YAkQ';

    var appContext = new D2L.ApplicationContext('localhost', '', '');
    var userContext = appContext.createUserContext(props.Host, props.Port, req.header('host') + req.url);
    if(typeof userContext !== 'undefined' && userContext.userId) {
        props.UserID = userContext.userId;
        props.UserKey = userContext.userKey;
    }

    req.session.props = props;
    return props;
}

app.get('/', function(req, res) {
    var props = setProps(req);
    var stream = mu.compileAndRender('index.html', props);
    util.pump(stream, res);
});

app.get('/reset', function(req, res) {
    req.session.props = {};
    res.redirect('/');
});

app.get('/logout', function(req, res) {
    req.session.props = req.session.props || {}
    req.session.props.UserID = undefined;
    req.session.props.UserKey = undefined;
    res.redirect('/');
});

app.get('/auth', function(req, res) {
    var props = setProps(req, true);
    var appContext = new D2L.ApplicationContext('localhost', props.AppID, props.AppKey);
    var callback = 'http://' + req.header('host');
    var url = props.Scheme + '://' + appContext.createUrlForAuthentication(props.Host, props.Port, callback);
    res.redirect(url, 307);
});

app.get('/call', function(req, res) {
    var props = setProps(req);
    var appContext = new D2L.ApplicationContext('localhost', props.AppID, props.AppKey);
    var userContext = appContext.createUserContextWithValues(props.Host, props.Port, props.UserID, props.UserKey);
    if(typeof userContext === 'undefined') {
        res.writeHead(500);
        res.end();
        return;
    }
    var url = userContext.createUrlForAuthentication(req.param('req'), req.param('method'));
    var method = req.param('method');
    var options = {
        host: props.Host,
        port: props.Port,
        path: url.replace(/^[^\/]*/, ''),
        method: method
    };
    if(method == 'PUT' || method == 'POST') {
        options.headers = {
            'Content-Type': 'application/json',
            'Content-Length': req.param('data').length,
        };
    }

    var foo = props.Scheme === 'https' ? https : http;
    var req2 = foo.request(options, function(res2) {
        var data = '';
        res.writeHead(res2.statusCode, { 'Content-Type': 'text/plain' });
        res2.setEncoding('utf8')
        res2.on('data', function(chunk) { data += chunk; });
        res2.on('end', function() {
            res.end(data);
        });
    });

    req2.on('error', function(e) {
        console.log('Error: ' + e.message);
        res.redirect('/');
    });

    if(method == 'PUT' || method == 'POST') {
        req2.write(req.param('data'));
    }

    req2.end();
});

app.listen(10099);
