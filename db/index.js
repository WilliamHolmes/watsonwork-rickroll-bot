const _ = require('underscore');
const Cloudant = require('cloudant');
const constants = require('../js/constants');

const { env: { CLOUDANT_URL, CLOUDANT_DB, VCAP_SERVICES } } = process;

let cloudant = null;
let db = null;

let DOC = null;

const api = {
    getCloudant: () => {
        if (!cloudant) {
            cloudant = Cloudant({ vcapServices: JSON.parse(VCAP_SERVICES), plugins: 'promises' });
        }
        return cloudant;
    },
    getDB: () => {
        if (!db) {
            db = api.getCloudant().db.use(CLOUDANT_DB);
        }
        return db;
    },
    getDOC: () => {
        return new Promise((resolve, reject) => {
            if (DOC) {
               resolve(DOC);
            } else {
                api.getDB().get(constants.db.DOC, (err, data) => {
                    if (err) {
                        reject(err, data);
                    } else {
                        DOC = data;
                        resolve(DOC);
                    }
                });
            }
        })
    },
    isRickRoll: url  => {
        return api.process(url, constants.db.keys.CONFIRMED);
    },
    isIgnored: url => {
        return api.process(url, constants.db.keys.IGNORED);
    },
    process: (url, key) => {
        return api.getDOC()
        .then(({ [key]: data = [] }) =>  _.some(data, item => url.toLowerCase().includes(item.toLowerCase())))
        .catch(err => false);
    },
    addRickRoll: url => {
        DOC.confirmed = _.union(DOC.confirmed, [url]);
        api.getDB().insert(DOC, (err, data) => {
            if (data && data.rev) {
                DOC._rev = data.rev;
            }
            if (err) {
                DOC.confirmed = _.without(DOC.confirmed, url);
                console.log('*** addRickRoll ERROR', err);
            }
        })
    }
}

module.exports = api;