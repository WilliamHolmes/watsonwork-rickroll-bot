const _ = require('underscore');
const Cloudant = require('cloudant');

const db = require('./db');

const constants = require('../js/constants');

let db = null;

const api = {
    isRickRoll: url  => {
        return api.process(url, constants.db.keys.CONFIRMED);
    },
    isIgnored: url => {
        return api.process(url, constants.db.keys.IGNORED);
    },
    process: (url, key) => {
        return db.getDOC()
            .then(({ [key]: data = [] }) =>  _.some(data, item => url.toLowerCase().includes(item.toLowerCase())))
            .catch(err => false);
    },
    addRickRoll: url => {
        return db.insert(doc => _.union(doc.confirmed, [url]), doc => _.without(doc.confirmed, url));
    }
}

module.exports = api;