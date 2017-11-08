const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = [
  'bg_BG', 'de_DE', 'el_GR', 'en_US', 'es_AR',
  'es_ES', 'et_EE', 'fr_FR', 'hi_IN', 'it_IT',
  'ja_JP', 'lt_LT', 'mt_MT', 'nl_NL', 'pl_PL',
  'pt_PT', 'ro_RO', 'sk_SK', 'sl_SI', 'tr_TR',
  'uk_UA',
];

describe('invited-to-session', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('invited-to-session', locale, {
        applicantName: 'Some Name',
        dojo: {
          name: 'Some Dojo',
          email: 'somedojo@coderdojo.com',
        },
        sessionName: 'Some Session',
        ticket: {
          name: 'Some Ticket',
        },
        eventDate: '01/01/1970',
        event: {
          address: '123 Fake St.',
        },
        inviteLink: 'http://example.com',
        year: 2017,
      });
    });
  });
});