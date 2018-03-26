const Cloudant = require('cloudant');
const constants = require('../js/constants');

const { env: { CLOUDANT_URL, CLOUDANT_DB } } = process;

let cloudant = null;
let db = null;

let DOCS = {};

const api = {
    getCloudant: () => {
        if(!cloudant) {
            cloudant = Cloudant({ url: CLOUDANT_URL });
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
    isRickRoll: () => {
        console.log('isRickRoll', constants.db.CONFIRMED);
        return api.getDOC(constants.db.CONFIRMED).then(data => {
            console.log('***** CONFIRMED OK', data);
        })
        .catch(err => {
            console.log('***** CONFIRMED ERROR', err);
        });
    },
    isIgnore: () => {
        return api.getDOC(constants.db.IGNORED).then(data => {
            console.log('***** isIgnore OK', data);
        })
        .catch(err => {
            console.log('***** isIgnore ERROR', err);
        });
    }
}

module.exports = api;