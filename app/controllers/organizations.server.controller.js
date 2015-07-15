'use strict';

var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Organization = mongoose.model('Organization'),
	_ = require('lodash');

/**
 * Create a Organization
 */
exports.create = function(req, res) {
	var Organization = new Organization(req.body);
	Organization.owner = req.user;

	Organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Organization);
		}
	});
};

/**
 * Show the current Organization
 */
exports.read = function(req, res) {
	res.json(req.Organization);
};

/**
 * Update a Organization
 */
exports.update = function(req, res) {
	var Organization = req.Organization;

	Organization = _.extend(Organization, req.body);

	Organization.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Organization);
		}
	});
};

/**
 * Delete an Organization
 */
exports.delete = function(req, res) {
	var Organization = req.Organization;

	Organization.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Organization);
		}
	});
};

/**
 * List of Organization
 */
exports.list = function(req, res) {
	var populateQuery = [{path:'owner', select:'displayName'}, 
						 {path:'instructors', select:'displayName'}, 
						 {path:'followers', select:'displayName'}];

	Organization.find().sort('-title').populate(populateQuery).exec(function(err, Organization) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(Organization);
		}
	});
};

/**
 * Organization middleware
 */
exports.organizationByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Organization is invalid'
		});
	}

	var populateQuery = [{path:'owner', select:'displayName'}, 
						 {path:'instructors', select:'displayName'}, 
						 {path:'followers', select:'displayName'}];

	Organization.findById(id).populate(populateQuery).exec(function(err, Organization) {
		if (err) return next(err);
		if (!Organization) {
			return res.status(404).send({
				message: 'Organization not found'
			});
		}
		req.Organization = Organization;
		next();
	});
};


var organizationServerControllerAuthHelper = {};
(function () {

	function isOwner (req) {
		return (req.Organization.owner.id === req.user.id);
	}

	function isInstructor (req) {
		var instructors = req.Organization.instructors; 
		var found = false;
		_(instructors).each(function(instructor) {
			if (instructor.id === req.user.id) {
				found = true;
				return false; // break early.
			}  
		});
		return found;
	}

	organizationServerControllerAuthHelper.isOwner = isOwner;
	organizationServerControllerAuthHelper.isInstructor = isInstructor;
})();

/**
 * Organization authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.Organization.owner.id !== req.owner.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};