const faker = require('faker');

const createFakeUser = () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const dob = faker.date.between('1950-01-01', '2001-12-31').toISOString().slice(0, 10);
    const email = `${firstName}.${lastName}@${faker.internet.domainName()}`;

    return {firstName, lastName, dob, email};
};

module.exports = {createFakeUser};