const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = ['en_US'];

describe('new-dojo', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('new-dojo', locale, {
        dojoEmail: 'somedojo@coderdojo.com',
        dojoLink: 'http://example.com',
        dojoName: 'Some Dojo',
        dojoLeadName: 'Some Name',
        applicationLink: 'http://example.com',
        year: 2017,
      });
    });
  });
});