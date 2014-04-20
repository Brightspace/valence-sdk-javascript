'use strict';

var expect = require('chai').expect,
	url = require('url'),
	sinon = require('sinon');

var D2L = require('../');

describe('D2L.UserContext.createAuthenticatedUrl', function () {
	var appContext;
	var userContext;

	before(function (done) {
		appContext = new D2L.ApplicationContext('foo', 'bar');
		userContext = appContext.createUserContextWithValues('http://somelms.edu', 80, 'baz', 'quux', 0);
		done();
	});

	it('should not include query params in signature', function (done) {
		var urlWith = url.parse(userContext.createAuthenticatedUrl('/d2l/api/foo?bar=baz', 'GET'), true);
		var urlWithout = url.parse(userContext.createAuthenticatedUrl('/d2l/api/foo', 'GET'), true);

		expect(urlWith.query['x_c']).to.equal(urlWithout.query['x_c']);
		expect(urlWith.query['x_d']).to.equal(urlWithout.query['x_d']);

		done();
	});

	it('should create a properly signed url', function (done) {
		sinon
			.stub(D2L.Util, 'getTimestamp')
			.returns(1397958932);

		var result = url.parse(userContext.createAuthenticatedUrl('/d2l/api/lp/1.0/users/whoami?abc=xyz', 'GET'), true),
			query = result.query;

		D2L.Util.getTimestamp.restore();

		expect(result.protocol).to.equal('http:');
		expect(result.hostname).to.equal('somelms.edu');
		expect(query.abc).to.equal('xyz');
		expect(query.x_a).to.equal('foo');
		expect(query.x_b).to.equal('baz');
		expect(query.x_c).to.equal('eInA7Qr4HYQn8b8x6RoMPioxftBYbRsa3oiIFCZFTgU');
		expect(query.x_d).to.equal('fkpwBDGOppT6DrsjJNxcsxFIaGo-RS3q3kmeJBwemc0');
		expect(query.x_t).to.equal('1397958932');

		done();
	});
});
