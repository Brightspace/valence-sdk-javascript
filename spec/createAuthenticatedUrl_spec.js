'use strict';

var expect = require('chai').expect,
	url = require('url');

var D2L = require('../');

describe('D2L.UserContext.createAuthenticatedUrl', function () {
	var appContext;
	var userContext;

	before(function (done) {
		appContext = new D2L.ApplicationContext('foo', 'bar');
		userContext = appContext.createUserContextWithValues('http://somelms.edu', 80, 'baz', 'quux', 0);
		done();
	});

	it('should not include query params in signature', function (done) {
		var urlWith = url.parse(userContext.createAuthenticatedUrl('/d2l/api/foo?bar=baz', 'GET'), true);
		var urlWithout = url.parse(userContext.createAuthenticatedUrl('/d2l/api/foo', 'GET'), true);

		expect(urlWith.query['x_c']).to.equal(urlWithout.query['x_c']);
		expect(urlWith.query['x_d']).to.equal(urlWithout.query['x_d']);

		done();
	});
});

