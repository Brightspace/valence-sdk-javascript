'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.ApplicationContext.createUserContextWithValues', function () {
	var appContext;
	before(function (done) {
		appContext = new D2L.ApplicationContext('foo', 'bar');
		done();
	});

	it('should use passed in host, port, userId, userKey and skew', function (done) {
		var userContext = appContext.createUserContextWithValues('http://abc', 12345, 'someUserId', 'someUserKey', 100);

		expect(userContext.host).to.equal('http://abc');
		expect(userContext.port).to.equal(12345);
		expect(userContext.userId).to.equal('someUserId');
		expect(userContext.userKey).to.equal('someUserKey');
		expect(userContext.skew).to.equal(100);
		done();
	});

	it('should default skew to 0', function (done) {
		var userContext = appContext.createUserContextWithValues('http://abc', 12345, 'someUserId', 'someUserKey');

		expect(userContext.skew).to.equal(0);
		done();
	});

	it('should use appId and appKey from the application context', function (done) {
		var userContext = appContext.createUserContextWithValues('http://abc', 12345, 'someUserId', 'someUserKey');

		expect(userContext.appId).to.equal('foo');
		expect(userContext.appKey).to.equal('bar');
		done();
	});

});

