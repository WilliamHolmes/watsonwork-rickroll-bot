const Cloudant = require('cloudant');
const getURLs = require('get-urls');
const scraperWeb = require('scraper-web');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const API = require('./db');

const constants = require('./js/constants');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));

const sendAnnotaion = (spaceId, url) => {
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
    console.log('Message URLS', urls);
    _.each(urls, url => {
        console.log('Message URL', url);
        API.isIgnore(url).then(isIgnore => {
            if(!isIgnore){
                API.isConfirmed(url).then(isConfirmed => {
                    if(isConfirmed) {
                        sendAnnotaion(spaceId, url);
                    } else {
                        scraperWeb(url, (arr = []) => {
                            const res = (arr.join(' ') || '').toLowerCase();
                            console.log('Website Text', res);
                            const rickrolled = _.some(constants.FILTERS, filter => res.includes(filter));
                            console.log('rickrolled', rickrolled);
                            if (rickrolled) {
                                sendAnnotaion(spaceId, url);
                            }
                        });
                    }
                });
            }
        });
    });
});
