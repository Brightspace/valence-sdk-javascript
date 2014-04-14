'use strict';

var expect = require('chai').expect;

var D2L = require('../');

describe('D2L.Util.parseFromUrl', function () {
	it('should return empty string when no params are present', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami');
		expect(result).to.equal('');
		done();
	});

	it('should return empty string when not present', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami?foo=bar');
		expect(result).to.equal('');
		done();
	});

	it('should return empty string when present without value', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami?foo=bar&abc=');
		expect(result).to.equal('');
		done();
	});

	it('should return value string when present', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami?foo=bar&abc=xyz');
		expect(result).to.equal('xyz');
		done();
	});

	it('should return first value string when multiple instances are present', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami?foo=bar&abc=xyz&abc=tuv');
		expect(result).to.equal('xyz');
		done();
	});

	it('should return decoded value ', function (done) {
		var result = D2L.Util.parseFromUrl('abc', '/api/lp/1.4/whoami?foo=bar&abc=xyz+123');
		expect(result).to.equal('xyz 123');
		done();
	});
});
