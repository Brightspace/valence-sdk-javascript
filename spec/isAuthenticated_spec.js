'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Auth.isAuthenticated', function () {
	it('should return true if APP_ID_PARAM is in the query and has a value', function (done) {
		expect(D2L.Auth.isAuthenticated('/d2l/lp/1.4/whoami?x_a=xyz')).to.be.true;
		done();
	});

	it('should return false if APP_ID_PARAM is in the query and has no value', function (done) {
		expect(D2L.Auth.isAuthenticated('/d2l/lp/1.4/whoami?x_a=')).to.be.false;
		done();
	});

	it('should return false if APP_ID_PARAM is not in the query', function (done) {
		expect(D2L.Auth.isAuthenticated('/d2l/lp/1.4/whoami?x_b=xyz')).to.be.false;
		done();
	});
});
