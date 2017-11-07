/**
 * Expose dojo leads search to the front-end
 * TODO: Doesn't contain any logic so far, so missing test
 * @param  {Object}   query Seneca-entity select object
 * @return {[Leads]}        List of leads
 */
module.exports = function cmd_search_dojo_leads (args, done) {
  var seneca = this;
  var plugin = args.role;
  var query = args.query;
  if (query.name) query.name = new RegExp(query.name, 'i');
  if (query.email) query.email = new RegExp(query.email, 'i');
  seneca.act({role: plugin, entity: 'lead', cmd: 'list', query: query}, done);
};
