'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		trim: true,
		default: ''
	},
	imageUri: {
		type: String
	},
	owner: { type: Schema.ObjectId, ref: 'User' },
	instrutors: [{ type: Schema.ObjectId, ref: 'User' }],
	followers: [{ type: Schema.ObjectId, ref: 'User' }]
});

mongoose.model('Organization', OrganizationSchema);
