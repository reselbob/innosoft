const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;


const {getRandomFortune} = require('../fortunes');

describe('Fortunes Tests: ', () => {
    it('Can get random fortune', function(done){
        getRandomFortune()
            .then(fortune => {
                expect(fortune.fortune).to.be.a('string');
                done();
            })
            .catch(done);

    });
});