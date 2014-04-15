'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.ApplicationContext', function () {
	it('should use passed in appId and appKey', function (done) {
		var appContext = new D2L.ApplicationContext('foo', 'bar');

		expect(appContext.appId).to.equal('foo');
		expect(appContext.appKey).to.equal('bar');
		done();
	});

	it('should use passed in appId and appKey while ignoring appUrl', function (done) {
		var appContext = new D2L.ApplicationContext('localhost', 'foo', 'bar');

		expect(appContext.appId).to.equal('foo');
		expect(appContext.appKey).to.equal('bar');
		done();
	});
});
