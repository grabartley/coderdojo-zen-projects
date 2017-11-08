const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = [
  'bg_BG', 'de_DE', 'el_GR', 'en_US', 'es_AR',
  'es_ES', 'et_EE', 'fr_FR', 'hi_IN', 'it_IT',
  'ja_JP', 'lt_LT', 'mt_MT', 'nl_NL', 'pl_PL',
  'pt_PT', 'ro_RO', 'sk_SK', 'sl_SI', 'tr_TR',
  'uk_UA',
];

describe('parents-notify-all-members-recurring', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('parents-notify-all-members-recurring', locale, {
        dojoMember: 'Some Name',
        event: {
          name: 'Some Event',
        },
        dojo: {
          name: 'Some Dojo',
          email: 'somedojo@coderdojo.com'
        },
        childrenName: 'Some Child',
        link: 'http://example.com',
        year: 2017,
      });
    });
  });
});