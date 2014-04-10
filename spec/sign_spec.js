'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Util.Sign', function () {
	it('should return base64Url\'d HMAC-SHA256', function (done) {
		expect(D2L.Util.Sign('foobar', 'bar')).to.equal('8MWnO0rB4dhvQbYdde_vEx3dbLS3RgumO-9WT90kQnQ');
		done();
	});
});
