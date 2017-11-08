const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('polls-sms-cheering', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('polls-sms-cheering', locale, {
        pollLink: 'http://example.com',
      });
    });
  });
});