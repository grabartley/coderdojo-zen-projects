const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;

module.exports = (templateName, locale, data) => {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, '../../', 'email-templates', `${templateName}-${locale}`);
    const template = new EmailTemplate(templateDir);
    template.render(data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};