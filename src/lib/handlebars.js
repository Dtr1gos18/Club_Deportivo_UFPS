const {format} = require('timeago.js');

const helpers = {};

helpers.timeago = (timeStamp) => {
    return format(timeStamp);
};

helpers.id_admin = (id_admin) => {
    return id_admin;
};

module.exports = helpers;