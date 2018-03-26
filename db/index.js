const Cloudant = require('cloudant');
const constants = require('../js/constants');

let cloudant = null;
let db = null;

let DOCS = {};

const api = {
    getCloudant: () => {
        if(!cloudant) {
            cloudant = Cloudant({ url: process.env.CLOUDANT_URL });
        }
        return cloudant;
    },
    getDB: () => {
        if(!db){
            db = api.getCloudant().db.use(process.env.CLOUDANT_DB);
        }
        return db;
    },
    getDOC: doc => {
        return new Promise((resolve, reject) => {
            if(DOCS[doc]) {
               resolve(DOCS[doc]);
            } else {
                api.getDB().get(doc, (err, data) => {
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

export default api;