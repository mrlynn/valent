var express = require('express');
var router = express.Router();
var logger = require('morgan');
var ValueDriver = require('../models/valuedriver.js');
var ProofPoint = require('../models/proofpoint.js');
var slugify = require('slugify');
var validator = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	res.render('index', {
		layout: 'layout.hbs',
		allvaluedrivers: req.app.get('allvaluedrivers'),
		allcasesforchange: req.app.get('allcasesforchange'),
		allproofpoints: req.app.get('allproofpoints'),
		title: 'MongoDB Value Navigator',
		errorMsg: errorMsg,
		successMsg: successMsg,
		noErrorMsg: !errorMsg,
		noMessage: !successMsg
	});
});
router.get('/casesforchange', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ValueDriver.find({}, function(err, valuedrivers) {
		if (err) {
			console.log("error: " + err.message);
			return res.error('err');
		} else {
			console.log("No error");
		}
		res.render('casesforchange', {
			layout: 'layout.hbs',
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allproofpoints: req.app.get('allproofpoints'),
			allcasesforchange: req.app.get('allcasesforchange'),
			valuedriver: 'drivegrowth',
			errorMsg: errorMsg,
			successMsg: successMsg,
			noErrorMsg: !errorMsg,
			noMessage: !successMsg
		});
	});
});
router.get('/valuedrivers', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ValueDriver.find({}, function(err, valuedrivers) {
		if (err) {
			console.log("error: " + err.message);
			return res.error('err');
		} else {
			console.log("No error");
		}
		res.render('valuedrivers', {
			layout: 'layout.hbs',
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allproofpoints: req.app.get('allproofpoints'),
			allcasesforchange: req.app.get('allcasesforchange'),
			valuedriver: 'drivegrowth',
			errorMsg: errorMsg,
			successMsg: successMsg,
			noErrorMsg: !errorMsg,
			noMessage: !successMsg
		});
	});
});
router.get('/proofpoints', function(req, res, next) {
	// eval(require('locus'));
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ProofPoint.find({}, function(err, proofpoints) {
		if (err) {
			console.log("error: " + err.message);
			return res.error('err');
		} else {
			console.log("No error");
		}
		res.render('proofpoints', {
			layout: 'layout.hbs',
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allcasesforchange: req.app.get('allcasesforchange'),
			allproofpoints: req.app.get('allproofpoints'),
			proofpoints: proofpoints,
			errorMsg: errorMsg,
			successMsg: successMsg,
			noErrorMsg: !errorMsg,
			noMessage: !successMsg
		});
	});
});
router.get('/proofpoints/:bySomething?', function(req, res, next) {
	var something = req.params.bySomething;
	if (something=='byCompany') {
		var page='proofpoints-by-company';
	} else {
		var page = 'proofpoints-by-industry';
	}
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ProofPoint.find().sort("company").exec(function(err, proofpoints) {
		if (err) {
			console.log("error: " + err.message);
			return res.error('err');
		} else {
			console.log("No error");
		}
		proofpointChunks = [];
		chunkSize = 3;
		for (var i = (3 - chunkSize); i < proofpoints.length; i += chunkSize) {
			proofpointChunks.push(proofpoints.slice(i, i + chunkSize));
		}
		res.render(page, {
			layout: 'layout.hbs',
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allcasesforchange: req.app.get('allcasesforchange'),
			allproofpoints: req.app.get('allproofpoints'),
			proofpoints: proofpoints,
			proofpointChunks: proofpointChunks,
			errorMsg: errorMsg,
			successMsg: successMsg,
			noErrorMsg: !errorMsg,
			noMessage: !successMsg
		});
	});
});
router.get('/proofpoint/:proofpoint?', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	var proofpoint_id = req.params.proofpoint;
	ProofPoint.findOne({
		slug: proofpoint_id
	}, function(err, proofpoint) {
		res.render('proofpoint', {
			layout: 'layout.hbs',
			proofpoint: proofpoint,
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allproofpoints: req.app.get('allproofpoints'),
			allcasesforchange: req.app.get('allcasesforchange'),
		})
	})

});
router.post('/proofpoint', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	var company = req.body.company;
	var title = req.body.title;
	var slug = slugify(company + title);
	// var image = '../images/pp/' + slugify(company) + '.png';
	var description = req.body.description;
	var image = req.body.image;
	var problem = req.body.problem;
	var solution = req.body.solution;
	var industry = req.body.industry;
	var results = req.body.results;
	var products_comma = req.body.products;
	var products_array = products_comma.split(',');
	var tags = "";
	req.checkBody("company", "Enter a valid company.");
	req.checkBody("title", "Enter a valid title.");
  var errors = req.validationErrors();
  if (errors) {
      returnObject = {
          errorMsg: errors,
          noErrorMsg: false,
          noMessage: true
      };
      req.flash('error', 'Invalid email address.  Please re-enter.');
      return res.redirect('/proofpoints');
  }
	tags = req.body.tags;
	var tags_array = tags.split(',');
	var doc = {
		errorMsg: errorMsg,
		successMsg: successMsg,
		company: company,
		slug: slug,
		title: title,
		industry: industry,
		description: description,
		image: image,
		problem: problem,
		solution: solution,
		results: results,
		products: products_array,
		tags: tags_array
	}
	var proofpoint = new ProofPoint(doc);
	proofpoint.save(function(err, createdDocument) {
		if (err) {
			console.log(JSON.stringify(err));
			res.render('err: ' + err.message);
			return;
		}
		res.redirect('/proofpoints');
	})

});
router.get('/search', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	res.render('searchresults', {
		layout: 'valuedriver.hbs',
		allvaluedrivers: req.app.get('allvaluedrivers'),
		allproofpoints: req.app.get('allproofpoints'),
		allcasesforchange: req.app.get('allcasesforchange'),
		valuedrivers: req.app.get('allvaluedrivers'),
		errorMsg: errorMsg,
		successMsg: successMsg,
		noErrorMsg: !errorMsg,
		noMessage: !successMsg,
		results: null
	})
});
router.post('/search', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	var q = req.body.q;
	const regex = new RegExp(escapeRegex(req.body.q), 'gi');

	ValueDriver
		.find({
			$text: {
				$search: q
			}
		}, {
			score: {
				$meta: "textScore"
			}
		})
		.sort({
			score: {
				$meta: 'textScore'
			}
		})
		.exec(function(err, vdresults) {
			if (err) {
				console.log("Err: " + err);
			}
			console.log("Search Results: " + JSON.stringify(vdresults));
			ProofPoint
				.find({
					$text: {
						$search: q
					}
				}, {
					score: {
						$meta: "textScore"
					}
				})
				.sort({
					score: {
						$meta: 'textScore'
					}
				})
				.exec(function(err, ppresults) {
					res.render('searchresults', {
						layout: 'valuedriver.hbs',
						errorMsg: errorMsg,
						successMsg: successMsg,
						noErrorMsg: !errorMsg,
						noMessage: !successMsg,
						vdresults: vdresults,
						allvaluedrivers: req.app.get('allvaluedrivers'),
						allcasesforchange: req.app.get('allcasesforchange'),
						allproofpoints: req.app.get('allproofpoints'),
						ppresults: ppresults,
						q: q
					})
				});
		});
});
router.get('/addvaluedriver', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	res.render('addvaluedriver', {
		layout: 'layout.hbs',
		allvaluedrivers: req.app.get('allvaluedrivers'),
		allproofpoints: req.app.get('allproofpoints'),
		allcasesforchange: req.app.get('allcasesforchange'),
		errorMsg: errorMsg,
		successMsg: successMsg,
		noErrorMsg: !errorMsg,
		noMessage: !successMsg
	});
});
router.post('/addvaluedriver', function(req, res, next) {
	console.log(JSON.stringify(req.body));
	var beforescenarios = req.body.beforescenario;
	vd = new ValueDriver(req.body);
	console.log(JSON.stringify(vd));
})
router.get('/valuedriver/:valuedriver?', function(req, res, next) {
	var valuedriver_slug = req.params.valuedriver;
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ValueDriver.findOne({
		valuedriver_slug: valuedriver_slug
	}, function(err, valuedriver) {
		if (err || valuedriver == null) {
			res.send('err');
			return;
		}
		proofpoints = [];
		if (valuedriver.proofpoints) {
			for (ii = 0; ii < valuedriver.proofpoints.length; ii++) {
				var pp = valuedriver.proofpoints[ii];
				ProofPoint.findOne({
					slug: pp
				}, function(err, ppdoc) {
					proofpoints.push(ppdoc);

				})
			}
		} else {
			proofpoints = {};
		}

		res.render('valuedriver', {
			layout: 'layout.hbs',
			valuedriver: valuedriver,
			allvaluedrivers: req.app.get('allvaluedrivers'),
			allproofpoints: req.app.get('allproofpoints'),
			allcasesforchange: req.app.get('allcasesforchange'),
			proofpoints: proofpoints,
			errorMsg: errorMsg,
			successMsg: successMsg,
			noErrorMsg: !errorMsg,
			noMessage: !successMsg
		});
	});
});
router.get('/tag/:tag?', function(req, res, next) {
  var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ValueDriver.find({
		tags: {
			$in: req.params.tag
		}
	}, function(err, vdresults) {
		ProofPoint.find({
			tags: {
				$in: req.params.tag
			}
		}, function(err, ppresults) {
			res.render('tag', {
				layout: 'valuedriver.hbs',
				tag: req.params.tag,
				errorMsg: errorMsg,
				successMsg: successMsg,
				noErrorMsg: !errorMsg,
				noMessage: !successMsg,
				vdresults: vdresults,
				ppresults: ppresults,
				allvaluedrivers: req.app.get('allvaluedrivers'),
				allproofpoints: req.app.get('allproofpoints'),
				allcasesforchange: req.app.get('allcasesforchange'),
				valuedrivers: req.app.get('allvaluedrivers'),
				results: null
			})
		});
	});
});
router.get('/tags', function(req, res, next) {
  var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	ProofPoint.aggregate([{
		$group: {
			_id: '$tags',
			count: {
				$sum: 1
			}
		}
	}], function(err, tags1) {
		if (err) {
			console.log("error: " + err.message);
			return res.error('err');
		} else {
			console.log("No error");
		}
		ValueDriver.aggregate([{
			$group: {
				_id: '$tags',
				count: {
					$sum: 1
				}
			}
		}], function(err, tags2) {
			errorMsg = req.flash('error', 'this is a test');
			res.render('tags', {
				layout: 'layout.hbs',
				allvaluedrivers: req.app.get('allvaluedrivers'),
				tags: tags2,
				errorMsg: errorMsg,
				successMsg: successMsg,
				noErrorMsg: !errorMsg,
				noMessage: !successMsg
			});
		});
	});
});
module.exports = router;

function sortByField(a, b) {
	if (a.fieldName < b.fieldName) {
		return -1;
	} else if (a.fieldName == b.fieldName) {
		return 0;
	} else return 1;
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
