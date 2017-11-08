const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('polls-sms-notification-reminder', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('polls-sms-notification-reminder', locale, {});
    });
  });
});