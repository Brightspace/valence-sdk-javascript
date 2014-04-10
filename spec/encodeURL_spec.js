'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Util.encodeURL', function () {
	it('should return value equivalent to encodeURIComponent', function (done) {
		var string = 'abc xyz&&+q//:';
		expect(D2L.Util.encodeURL(string)).to.equal(encodeURIComponent(string));
		done();
	});
});
