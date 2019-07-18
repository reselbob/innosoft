// BASE SETUP
// =============================================================================

// call the packages we need
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const {loadScheduleItems, stopScheduleItems,createScheduleItem} = require('./scheduler');
const {getFortunes} = require('./fortunes');
const {getUsers, addUser} = require('./users');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // set our port

// create our router
const router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({message: 'Welcome to Fortune Cookies API!'});
});

router.route('/users')
    .post(function (req, res) {
        addUser(req.body)
            .then(rslt =>{
                return createScheduleItem(rslt, globalSchedulerArray)
            })
            .then(rslt =>{
                //Clean up the json so as not create a circular issue
                res.json({id: rslt.id, firstName: rslt.firstName, lastName: rslt.lastName, dob: rslt.dob});
            })
            .catch(e => {
                res.error(e);
            });
    })
    .get( async (req, res) => {
        const users = await getUsers();
        res.json(users);
    });

router.route('/fortunes')
    .post(function (req, res) {
        console.log(req.body.name);
        res.json({message: 'Not Implemented: POST /fortunes'});
    })
    .get(function (req, res) {
        getFortunes()
            .then(fortunes => {
                const arr = [];
                if (fortunes) {
                    fortunes.forEach(fortune => {
                        arr.push({fortune});
                    });
                }
                return res.json(arr);
            });
    });


router.route('/users/:userId')
    .get(function (req, res) {
        res.json({message: `Not Implemented: GET /users/:userID on userId: ${req.params.userId}`});
    })
    .put(function (req, res) {
        res.json({message: `Not Implemented: PUT /users/:userID on userId: ${req.params.userId}`});
    })
    .delete(function (req, res) {
        res.json({message: `Not Implemented: DELETE /users/:userID on userId: ${req.params.userId}`});
    });

router.route('/reports/users')
    .get(function (req, res) {
        res.json({message: 'Not Implemented: GET /reports/users'});
    });
router.route('/reports/users/:userID')
    .get(function (req, res) {
        res.json({message: 'Not Implemented: /reports/users/:userID'});
    });
router.route('/reports/usage')
    .get(function (req, res) {
        res.json({message: 'Not Implemented: GET /reports/usage'});
    });
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);


let globalSchedulerArray;

loadScheduleItems()
    .then(arr => {
        console.log(`Fortune cookies running at ${new Date()}`);
        globalSchedulerArray = arr;
        return arr;
    });

const server = app.listen(port);
const shutdown = () => {
    stopScheduleItems(globalSchedulerArray)
        .then(() => {
            console.log(`Server shutting down at ${new Date()}`);
            server.close()
        })
};

console.log('Listening on port: ' + port);
module.exports = {server, shutdown};

