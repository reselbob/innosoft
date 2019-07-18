'use strict';
const supertest = require('supertest');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const {server,shutdown} = require('../server');
const {createFakeUser} =  require('./test-utils');

describe('HTTP Tests: ', () => {
    after(function () {
        shutdown();
    });
    it('Can access GET /api', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                done();
            })
            .catch(done);
    });

    it('Can access GET /api/fortunes', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api/fortunes')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('array');
                done();
            })
            .catch(done);
    });

    it('Can access POST /api/fortunes', function(done){
        //Go get all the lists
        supertest(server)
            .post('/api/fortunes')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                done();
            })
            .catch(done);
    });

    it('Can access GET /api/users', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api/users')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body).to.be.an('array');
                done();
            })
            .catch(done);
    });

    it('Can access POST /api/users', function(done){
        const user = createFakeUser();
        user.period = '*/2 * * * * *' //run every two seconds
        supertest(server)
            .post('/api/users')
            .set('Accept', 'application/json')
            .send(user)
            .then((res) => {
                expect(res.body).to.be.an('object');
                done();
            })
            .catch(done);
    });

    it('Can access GET /api/reports/usage', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api/reports/usage')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                done();
            })
            .catch(done);
    });

    it('Can access GET /api/reports/users', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api/reports/users')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                //process.exit(0)
                done();
            })
            .catch(done);
    });

    it('Can access GET /api/users/:userId', function(done){
        //Go get all the lists
        supertest(server)
            .get('/api/users/123')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                //process.exit(0)
                done();
            })
            .catch(done);
    });

    it('Can access PUT /api/users/:userId', function(done){
        //Go get all the lists
        supertest(server)
            .put('/api/users/123')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                //process.exit(0)
                done();
            })
            .catch(done);
    });

    it('Can access DELETE /api/users/:userId', function(done){
        //Go get all the lists
        supertest(server)
            .delete('/api/users/123')
            .set('Accept', 'application/json')
            .then((res) => {
                expect(res.body.message).to.be.a('string');
                //process.exit(0)
                done();
            })
            .catch(done);
    });
});