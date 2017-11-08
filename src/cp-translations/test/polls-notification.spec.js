const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('polls-notification', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('polls-notification', locale, {
        question: 'Some Question',
        dojoName: 'Some Dojo',
        pollLink: 'http://example.com',
        year: 2017,
      });
    });
  });
});