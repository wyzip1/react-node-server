const mongoose = require('mongoose');
const config = require('./config');

module.exports = function () {
    const db = mongoose.connect(config.mongodb, config.options);
    require('../models');
    return db;
}