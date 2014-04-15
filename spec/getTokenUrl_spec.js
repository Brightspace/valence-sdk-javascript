'use strict';

var expect = require('chai').expect,
	url = require('url');

var D2L = require('../');

describe('D2L.Util.getTokenUrl', function () {
	it('should work properly in a simple case', function (done) {
		var tokenUrl = D2L.Util.getTokenUrl(
			'http://someserver',
			'/api/lp/1.4/whoami',
			44444,
			{
				abc: 'xyz'
			}
		);

		expect(tokenUrl).to.equal('http://someserver:44444/api/lp/1.4/whoami?abc=xyz');
		done();
	});

	it('should respect the protocol on host', function (done) {
		var tokenUrl = D2L.Util.getTokenUrl(
			'https://someserver',
			'/api/lp/1.4/whoami',
			44444,
			{
				abc: 'xyz'
			}
		);

		expect(tokenUrl).to.equal('https://someserver:44444/api/lp/1.4/whoami?abc=xyz');
		done();
	});

	it('should allow for parameters in the path', function (done) {
		var tokenUrl = D2L.Util.getTokenUrl(
			'http://someserver',
			'/api/lp/1.4/whoami?foo=bar',
			44444,
			{
				abc: 'xyz'
			}
		);

		var parsedQuery = url.parse(tokenUrl, true).query;
		expect(parsedQuery).to.deep.equal({
			abc: 'xyz',
			foo: 'bar'
		});
		done();
	});

	it('should omit port 80 for http urls', function (done) {
		var tokenUrl = D2L.Util.getTokenUrl(
			'http://someserver',
			'/',
			80,
			{
				'abc': 'xyz'
			}
		);

		expect(tokenUrl).to.equal('http://someserver/?abc=xyz');

		done();
	});

	it('should omit port 443 for https urls', function (done) {
		var tokenUrl = D2L.Util.getTokenUrl(
			'https://someserver',
			'/',
			443,
			{
				'abc': 'xyz'
			}
		);

		expect(tokenUrl).to.equal('https://someserver/?abc=xyz');

		done();
	});
});
