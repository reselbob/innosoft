const uuidv4 = require('uuid/v4');
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const {getScheduleItem} = require('../scheduler');

describe('Scheduler Tests Tests: ', () => {
    it('Can run schedulerItem', function (done) {
        const id = uuidv4();
        createScheduleItem({userId})
            .then(item => {
                //Let just do a visual console read for now
                done();
            })
            .catch(done)
    }).timeout(15000)
});