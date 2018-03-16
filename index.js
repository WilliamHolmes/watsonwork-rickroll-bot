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
    const urls = [...(getURLs(content) || [])];
    console.log('Message URLS', urls);
    _.each(urls, url => {
        console.log('Message URL', url);
        scraperWeb(url, (arr = []) => {
            const res = (arr.join(' ') || '').toLowerCase();
            console.log('Website Text', res);
            const rickrolled = _.some(constants.FILTERS, filter => res.includes(filter));
            console.log('rickrolled', rickrolled);
            if (rickrolled) {
                app.sendMessage(spaceId, {
                    actor: { name: 'Rick Astley' },
                    color: constants.COLOR_ERROR,
                    text: `[${url}](${url})\n*Never Gonna Give You Up!*`,
                    title: '',
                    type: 'generic',
                    version: '1'
                });
            }
        });
    });
});
