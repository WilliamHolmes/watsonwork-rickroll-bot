const getURLs = require('get-urls');
const scraperWeb = require('scraper-web');
const _ = require('underscore');

const appFramework = require('watsonworkspace-bot');
appFramework.level('verbose');
appFramework.startServer();
const app = appFramework.create();

const UI = require('watsonworkspace-sdk').UI;

const constants = require('./js/constants');

app.authenticate().then(() => app.uploadPhoto('./appicon.jpg'));

app.on('message-created', (message, annotation) => {
    const { content = '', spaceId } = message;
    _.each(getURLs(content), url => {
        scraperWeb(url, (arr = []) => {
            const res = (arr.join('|') || '').toLowerCase();
            const rickrolled = _.some(contants.FILTERS, filter => res.includes(filter));
            if (rickrolled) {
                app.sendMessage(spaceId, {
                    actor: { name: 'RickRoll Warning' },
                    color: constants.COLOR_ERROR,
                    text: 'Never Gonna Give You Up!',
                    title: '',
                    type: 'generic',
                    version: '1'
                });
            }
        });
    });
});
