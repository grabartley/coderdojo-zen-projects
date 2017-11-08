const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = [
  'bg_BG', 'de_DE', 'el_GR', 'en_US', 'es_AR',
  'es_ES', 'et_EE', 'fr_FR', 'hi_IN', 'it_IT',
  'ja_JP', 'lt_LT', 'mt_MT', 'nl_NL', 'pl_PL',
  'pt_PT', 'ro_RO', 'sk_SK', 'sl_SI', 'tr_TR',
  'uk_UA',
];

describe('notify-all-members-oneoff', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('notify-all-members-oneoff', locale, {
        dojoMember: 'Some Name',
        event: {
          name: 'Some Event',
          date: '01/01/1970',
        },
        dojo: {
          name: 'Some Dojo',
        },
        link: 'http://example.com',
        year: 2017,
      });
    });
  });
});