const _ = require('underscore');
const Cloudant = require('cloudant');

const db = require('../db');

const constants = require('../js/constants');

const api = {
    isRickRoll: url  => {
        return api.hasURL(url, constants.db.keys.CONFIRMED);
    },
    isIgnored: url => {
        return api.hasURL(url, constants.db.keys.IGNORED);
    },
    hasURL: (url, key) => {
        return db.getDOC()
            .then(({ [key]: data = [] }) =>  _.some(data, item => url.toLowerCase().includes(item.toLowerCase())))
            .catch(err => false);
    },
    addRickRoll: url => {
        return db.insert(doc => _.union(doc[constants.db.keys.CONFIRMED], [url]), doc => _.without(doc[constants.db.keys.CONFIRMED], url));
    },
    ignoreRickRoll: url => {
        return db.insert(doc => _.without(doc[constants.db.keys.IGNORED], url), doc => _.union(doc[constants.db.keys.IGNORED], [url]));
    }
}

module.exports = api;