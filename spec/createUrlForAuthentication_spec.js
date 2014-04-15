'use strict';

var expect = require('chai').expect,
	url = require('url');

var D2L = require('../');

describe('D2L.ApplicationContext.createUrlForAuthentication', function () {
	var appContext;
	before(function (done) {
		appContext = new D2L.ApplicationContext('foo', 'bar');
		done();
	});

	it('should return a signed url with host, port, appKey, callback', function (done) {
		var result = url.parse(appContext.createUrlForAuthentication('http://cattle', 11111, 'https://apitesttool.desire2learnvalence.com/'), true);

		expect(result.protocol).to.equal('http:');
		expect(result.hostname).to.equal('cattle');
		expect(result.port).to.equal('11111');
		expect(result.pathname).to.equal('/d2l/auth/api/token');
		expect(result.query).to.deep.equal({
			x_a: 'foo',
			x_b: '0QJBME4jpLirHJS3XNCy87bolTPucH6uJ5npgC2vkHE',
			x_target: 'https://apitesttool.desire2learnvalence.com/'
		});
		done();
	});
});

