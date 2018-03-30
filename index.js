const Cloudant = require('cloudant');
const getURLs = require('get-urls');
const scraperWeb = require('scraper-web');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const API = require('./api');

const constants = require('./js/constants');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));

const sendAnnotaion = (spaceId, url) => {
    console.log('CONFIRMED RICKROLL', url);
    app.sendMessage(spaceId, {
        actor: { name: '! Warning !' },
        color: constants.COLOR_ERROR,
        text: `[${url}](${url})\n*♫♩ Never Gonna Give You Up!*`,
        title: '',
        type: 'generic',
        version: '1'
    });
}

app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    const urls = [...(getURLs(content) || [])];
    _.each(urls, url => {
        console.log('URL', url);
        API.isIgnored(url).then(isIgnored => {
            if(!isIgnored){
                API.isRickRoll(url).then(isConfirmed => {
                    if(isConfirmed) {
                        console.log('isRickRoll CONFIRMED', url);
                        sendAnnotaion(spaceId, url);
                    } else {
                        console.log('isRickRoll GET', url);
                        scraperWeb(url, (arr = []) => {
                            const res = (arr.join(' ') || '').toLowerCase();
                            const rickrolled = _.some(constants.FILTERS, filter => res.includes(filter));
                            console.log('isRickRoll IS FOUND', rickrolled);
                            if (rickrolled) {
                                sendAnnotaion(spaceId, url);
                                API.addRickRoll(url);
                            } else {
                                API.ignoreRickRoll(url);
                            }
                        });
                    }
                });
            } else {
                console.log('IGNORED', url);
            }
        });
    });
});
