const os = require('os');

exports.addMeta = function addMeta(obj) {
    obj.meta = {
        host: os.hostname,
        now: Date()
    };
};