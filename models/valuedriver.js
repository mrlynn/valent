var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	valuedriver: {
		type: String,
		required: false
	},
	metrics: [],
  tags: [],
  valuedriver_slug: String,
  valuedriver_desc: String,
  valuedriver_short: String,
  positivebusinessoutcomes: [],
  requiredcapabilities: [],
  howwedoit: [],
  howwedoitbetter: [],
  afterscenarios: [],
  beforescenarios: [],
  icon: String,
  negativeconsequences: [],
  casesforchange: {},
	created: {
		type: Date,
		default: Date.now,
		required: false
	},
  proofpoints: []
}, {collection: 'valuecards'});

schema.virtual('url').get(function() {
  return '/valuedriver/' + this.valuedriver_slug;
});
schema.index({ valuedriver: 'text', valuedriver_desc: 'text', tags: 'text', positivebusinessoutcomes: 'text', negativeconsequences: 'text', afterscenarios: 'text' });


module.exports = mongoose.model('ValueDriver',schema);
