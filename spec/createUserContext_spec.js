'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.ApplicationContext.createUserContext', function () {
	var appContext,
		url = 'https://apitesttool.desire2learnvalence.com/?x_a=someUserId&x_b=someUserToken&x_c=someSignatureThatTotallyDoesntMatter';
	before(function (done) {
		appContext = new D2L.ApplicationContext('foo', 'bar');
		done();
	});

	it('should use passed in host, port and skew', function (done) {
		var userContext = appContext.createUserContext('abc', 12345, url, 100);

		expect(userContext.host).to.equal('abc');
		expect(userContext.port).to.equal(12345);
		expect(userContext.skew).to.equal(100);
		done();
	});

	it('should default skew to 0', function (done) {
		var userContext = appContext.createUserContext('abc', 12345, url);

		expect(userContext.skew).to.equal(0);
		done();
	});

	it('should use appId and appKey from the application context', function (done) {
		var userContext = appContext.createUserContext('abc', 12345, url);

		expect(userContext.appId).to.equal('foo');
		expect(userContext.appKey).to.equal('bar');
		done();
	});

	it('should get userId and userToken from the url', function (done) {
		var userContext = appContext.createUserContext('abc', 12345, url);

		expect(userContext.userId).to.equal('someUserId');
		expect(userContext.userKey).to.equal('someUserToken');
		done();
	});

});

