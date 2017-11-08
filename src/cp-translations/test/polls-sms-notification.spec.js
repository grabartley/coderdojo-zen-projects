const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('polls-sms-notification', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('polls-sms-notification', locale, {
        question: 'Some Question',
        pollLink: 'http://example.com',
      });
    });
  });
});