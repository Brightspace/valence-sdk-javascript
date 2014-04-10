'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Util.base64Url', function () {
	it('should replace "+" with "-"', function (done) {
		expect(D2L.Util.base64Url('someStringWhich+Has+Pluses+In+It')).to.equal('someStringWhich-Has-Pluses-In-It');
		done();
	});

	it('should replace "/" with "_"', function (done) {
		expect(D2L.Util.base64Url('SG93J3MgaXQgZ29pbmcgdmFsZW5jZSBwZW9wbGU/')).to.equal('SG93J3MgaXQgZ29pbmcgdmFsZW5jZSBwZW9wbGU_');
		done();
	});

	it('should remove "="', function (done) {
		expect(D2L.Util.base64Url('SGV5IHZhbGVuY2UgcGVvcGxlIQ==')).to.equal('SGV5IHZhbGVuY2UgcGVvcGxlIQ');
		done();
	});

	it('should do it all at once', function (done) {
		expect(D2L.Util.base64Url('SomeString+Which/Has+Stuff==')).to.equal('SomeString-Which_Has-Stuff');
		done();
	});
});
