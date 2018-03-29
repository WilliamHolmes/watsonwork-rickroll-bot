const Cloudant = require('cloudant');
const constants = require('../js/constants');

const { env: { CLOUDANT_URL, CLOUDANT_DB, VCAP_SERVICES } } = process;

let cloudant = null;
let db = null;

let DOCS = {};

const api = {
    getCloudant: () => {
        if(!cloudant) {
            cloudant = Cloudant({ vcapServices: JSON.parse(VCAP_SERVICES), plugins: 'promises' });
        }
        console.log('***** getCloudant', cloudant);
        return cloudant;
    },
    getDB: () => {
        if(!db){
            db = api.getCloudant().db.use(CLOUDANT_DB);
        }
        console.log('***** getDB', db);
        return db;
    },
    getDOC: doc => {
        return new Promise((resolve, reject) => {
            if(DOCS[doc]) {
               resolve(DOCS[doc]);
            } else {
                api.getDB().get(doc, (err, data) => {
                    console.log('***** Get Doc OK', err, data);
                    if(err) {
                        reject(err, data);
                    } else {
                        DOCS[doc] = data;
                        resolve(DOCS[doc]);
                    }
                });
            }
        })
    },
    isRickRoll: url  => {
        console.log('isRickRoll', url);
        return api.getDOC(constants.db.CONFIRMED)
            .then(({ confirmed }) => _.has(confirmed, url))
            .catch(err => {
                console.log('***** CONFIRMED ERROR', err);
                return false;
            });
    },
    isIgnored: url => {
        console.log('isIgnored', url);
        return api.getDOC(constants.db.IGNORED)
        .then(({ confirmed }) => _.has(confirmed, url))
        .catch(err => {
            console.log('***** isIgnored ERROR', err);
            return false;
        });
    }
}

module.exports = api;