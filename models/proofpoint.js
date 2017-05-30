var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	company: {
		type: String,
		required: false
	},
  title: String,
	description: String,
  slug: String,
  tags: [],
  image: String,
	industry: String,
  problem: String,
  solution: String,
  results: String,
  products:[],
	created: {
		type: Date,
		default: Date.now,
		required: false
	}
}, {collection: 'proofpoints'});

schema.virtual('url').get(function() {
  return '/proofpoint/' + this.slug;
});

schema.index({ title: 'text', description: 'text', tags: 'text', problem: 'text', solution: 'text', results: 'text' });

module.exports = mongoose.model('ProofPoint',schema);
