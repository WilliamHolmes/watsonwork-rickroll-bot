const Cloudant = require('cloudant');
const constants = require('./js/constants');

let cloudant = null;
let db = null;

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
        return new Promise((resovle, reject) => {
            api.getDB().get(doc, (err, data) => {
                err ? reject(err, data) : resolve(data);
            });
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