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
        return api.process(url, constants.db.keys.CONFIRMED);
    },
    isIgnored: url => {
        return api.process(url, constants.db.keys.IGNORED);
    },
    process: (url, key) => {
        console.log(`*** Check ${key}`, url);
        return api.getDOC()
        .then(data => {
            console.log(`${key} DATA`, data);
           const { [key]: arr = [] } = data;
            console.log(`**** ${key} map`, arr);
            return _.some(arr, item => url.includes(item));
        })
        .catch(err => {
            console.log(`***** ${key} ERROR`, err);
            return false;
        })
    }
}

module.exports = api;