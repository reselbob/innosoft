const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const {createFakeUser} =  require('./test-utils');
const {addUser,getUsersSync} = require('../users');



describe('User Tests: ', () => {
    it('Can add user', function(done){
        const user = createFakeUser();
        addUser(user)
            .then(user => {
                expect(user.id).to.be.a('string');
                done();
            })
            .catch(done);

    });

    it('Can get users', function(done){
        const users = getUsersSync();
        expect(users).to.be.an('array');
    });
});