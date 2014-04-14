'use strict';

var expect = require('chai').expect,
	sinon = require('sinon');

var D2L = require('../');

describe('D2L.Util.calculateSkew', function () {
	before(function (done) {
		sinon
			.stub(D2L.Util, 'getTimestamp')
			.returns(1397500200);
		done();
	});

	after(function (done) {
		D2L.Util.getTimestamp.restore();
		done();
	});

	it('return 0 if the message isn\'t recognized', function (done) {
		expect(D2L.Util.calculateSkew('tiddlywinks')).to.equal(0);
		done();
	});

	it('return the difference between timestamp in message and current timestamp', function (done) {
		expect(D2L.Util.calculateSkew('Timestamp out of range 1397500300')).to.equal(100);
		done();
	});

	it('return a negative difference between timestamp in message and current timestamp if the current timestamp is later', function (done) {
		expect(D2L.Util.calculateSkew('Timestamp out of range 1397500100')).to.equal(-100);
		done();
	});
});
