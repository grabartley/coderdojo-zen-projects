const renderTemplate = require('./helpers/renderTemplate');

const supportedLocales = [
  'bg_BG', 'de_DE', 'el_GR', 'en_US', 'es_AR',
  'es_ES', 'et_EE', 'fr_FR', 'hi_IN', 'it_IT',
  'ja_JP', 'lt_LT', 'mt_MT', 'nl_NL', 'pl_PL',
  'pt_PT', 'ro_RO', 'sk_SK', 'sl_SI', 'tr_TR',
  'uk_UA',
];

describe('ticket-application-received', () => {
  supportedLocales.forEach((locale) => {
    it(`should render ${locale}`, async () => {
      await renderTemplate('ticket-application-received', locale, {
        applicantName: 'Some Name',
        intro: 'Intro!',
        applicationDate: '01/01/1970',
        sessionName: 'Scratch',
        tickets: [
          {
            ticketName: 'Ninja',
            ticketType: 'ninja',
            quantity: 1
          },
          {
            ticketName: 'Parent',
            ticketType: 'parent-guardian',
            quantity: 1
          },
        ],
        status: 'Pending',
        eventDate: '01/01/1970',
        event: {
          id: 2,
          address: '123 Fake St.',
        },
        applicationId: 1,
        cancelLinkBase: 'http://example.com',
        year: 2017,
      });
    });
  });
});