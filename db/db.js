const Cloudant = require('cloudant');
const constants = require('../js/constants');

const { env: { CLOUDANT_URL, CLOUDANT_DB, VCAP_SERVICES } } = process;

let cloudant = null;
let cloudantDB = null;

const db = {
    DOC: null,
    getCloudant: () => {
        if (!cloudant) {
            cloudant = Cloudant({ vcapServices: JSON.parse(VCAP_SERVICES), plugins: 'promises' });
        }
        return cloudant;
    },
    getDB: () => {
        if (!cloudantDB) {
            cloudantDB = api.getCloudant().db.use(CLOUDANT_DB);
        }
        return cloudantDB;
    },
    getDOC: () => {
        return new Promise((resolve, reject) => {
            if (api.DOC) {
                resolve(api.DOC);
            } else {
                api.getDB().get(constants.db.DOC, (err, data) => {
                    if (err) {
                        reject(err, data);
                    } else {
                        api.DOC = data;
                        resolve(api.DOC);
                    }
                });
            }
        })
    },
    insert: (onInsert, onRevert) => {
        db.getDOC().then(doc => {
            doc = onInsert(doc);
            db.getDB().insert(doc, (err, data) => {
                if (data && data.rev) {
                    db.DOC._rev = data.rev;
                }
                if (err) {
                    doc = onRevert(doc);
                }
            });
        });
    }
}

module.exports = db;