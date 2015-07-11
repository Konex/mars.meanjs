'use strict';

var users = require('../../app/controllers/users.server.controller'),
	organizations = require('../../app/controllers/organizations.server.controller');

module.exports = function(app) {
	app.route('/organizations')
		.get(organizations.list)
		.post(users.requiresLogin, organizations.create);

	app.route('/organizations/:organizationId')
		.get(organizations.read)
		.put(users.requiresLogin, organizations.hasAuthorization, organizations.update)
		.delete(users.requiresLogin, organizations.hasAuthorization, organizations.delete);

	app.param('organizationId', organizations.organizationByID);
};