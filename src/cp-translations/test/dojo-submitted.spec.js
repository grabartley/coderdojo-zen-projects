const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('dojo-submitted', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('dojo-submitted', locale, {
        name: 'Some Name',
        year: 2017,
      });
    });
  });
});