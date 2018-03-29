const _ = require('underscore');
const Cloudant = require('cloudant');
const constants = require('../js/constants');

const { env: { CLOUDANT_URL, CLOUDANT_DB, VCAP_SERVICES } } = process;

let cloudant = null;
let db = null;

let DOC = {};

const api = {
    getCloudant: () => {
        if(!cloudant) {
            cloudant = Cloudant({ vcapServices: JSON.parse(VCAP_SERVICES), plugins: 'promises' });
        }
        return cloudant;
    },
    getDB: () => {
        if(!db){
            db = api.getCloudant().db.use(CLOUDANT_DB);
        }
        return db;
    },
    getDOC: () => {
        return new Promise((resolve, reject) => {
            if(DOC) {
               resolve(DOC);
            } else {
                api.getDB().get(constants.db.DOC, (err, data) => {
                    if(err) {
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
        console.log('isRickRoll', url);
        return api.getDOC()
            .then(({ confirmed }) => {
                console.log('**** confirmed map', confirmed);
                return _.has(confirmed, url)
            })
            .catch(err => {
                console.log('***** CONFIRMED ERROR', err);
                return false;
            });
    },
    isIgnored: url => {
        console.log('isIgnored', url);
        return api.getDOC()
            .then(({ ignored }) => {
                console.log('**** confirmed map', ignored);
                return _.has(ignored, url)
            })
            .catch(err => {
                console.log('***** IGNORED ERROR', err);
                return false;
            })
    }
}

module.exports = api;