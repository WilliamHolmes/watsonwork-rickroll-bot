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
    addRickRoll: url => {
        return db.insert(doc => api.addURL(doc, constants.db.keys.CONFIRMED), doc => api.removeURL(doc, constants.db.keys.CONFIRMED));
    },
    ignoreRickRoll: url => {
        return db.insert(doc => api.addURL(doc, constants.db.keys.IGNORED), doc => api.removeURL(doc, constants.db.keys.IGNORED));
    },
    addURL: (doc, key) => {
        doc[key] = _.union(doc[key], [url]);
        return doc;
    },
    removeURL: (doc, key) => {
        doc[key] = _.without(doc[key], url);
        return doc;
    },
    hasURL: (url, key) => {
        return db.getDOC()
            .then(({ [key]: data = [] }) =>  _.some(data, item => url.toLowerCase().includes(item.toLowerCase())))
            .catch(err => false);
    }
}

module.exports = api;