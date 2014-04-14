'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Util.getTimestamp', function () {
	it('return current unix timestamp', function (done) {
		expect(D2L.Util.getTimestamp()).to.equal(Math.round(Date.now() / 1000));
		done();
	});
});
