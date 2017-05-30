var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
var expressHbs = require('express-handlebars');
var flash = require('connect-flash');
var ValueDriver = require('./models/valuedriver.js');
var ProofPoint = require('./models/proofpoint.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var util = require('util');
var expressValidator = require('express-validator');

var app = express();
app.use(expressValidator())

// view engine setup
var hbs = expressHbs.create({
    helpers: {
        inc: function (value, options) {
          return parseInt(value) + 1;
        },
        option: function(value) {
          var selected = value.toLowerCase() === (this.toString()).toLowerCase() ? 'selected="selected"' : '';
          return '<option value="' + this + '" ' + selected + '>' + this + '</option>';
        },
        compare: function(lvalue, rvalue, options) {
          if (arguments.length < 3)
              throw new Error("Handlebars Helper equals needs 2 parameters");
              var operator = options.hash.operator || "==";

              var operators = {
                  '==':       function(l,r) { return l == r; },
                  '===':      function(l,r) { return l === r; },
                  '!=':       function(l,r) { return l != r; },
                  '<':        function(l,r) { return l < r; },
                  '>':        function(l,r) { return l > r; },
                  '<=':       function(l,r) { return l <= r; },
                  '>=':       function(l,r) { return l >= r; },
                  'typeof':   function(l,r) { return typeof l == r; }
              }

              if (!operators[operator])
                  throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

              var result = operators[operator](lvalue,rvalue);
              if( result ) {
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
        },
        formatDate: function (date, format) {
            return moment(date).format(format);
        },
        timeAgo: function(date) {
          return timeago(date);
        },
        JSON: function(obj) {
          return JSON.stringify(obj,null,2);
        },
        Upper: function(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        },
        money: function(num) {
          var p = parseFloat(num/100).toFixed(2).split(".");
          return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
              return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
          }, "") + "." + p[1];
        }
    },
    defaultLayout: 'layout',
    extname: '.hbs',
});
app.engine('.hbs', hbs.engine);
app.use(flash());

app.set('view engine', '.hbs');
if (process.env.NODE_ENV) {
  // console.log("USING .env.hackathon-" + process.env.NODE_ENV);
  dotenv.load({ path: '.env.hackathon-' + process.env.NODE_ENV });
} else {
  console.log("USING .env.hackathon" );
  dotenv.load({ path: '.env.hackathon' });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var options = {
  db: { native_parser: true },
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  authSource: 'admin'
}
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI,options);
if (process.env.MONGODB_URI) {
   console.log("USING MONGODB_URI " + process.env.MONGODB_URI)
  mongoose.connect(process.env.MONGODB_URI, function() {/*dummy*/})
    .then(()=> {
      console.log("MongoDB Connected");
    })
    .catch(err => { // mongoose connection error will be handled here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
  } else {
  // mongoose.connect('mongodb://localhost:27017/valuecards');
  mongoose.connect('mongodb://127.0.0.1/valuecards', function() { /* dummy function */ })
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => { // mongoose connection error will be handled here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });
}
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error in app.js Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
app.use(session({
    secret:'mysecret',
    resave: false,
    saveUninitialized: false,
    // Re-use our existing mongoose connection to mongodb.
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    // 3 hours - connect mongo will hover up old sessions
    cookie: { maxAge: 180 * 60 * 1000 },
    secure: false
}));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
Array.prototype.inArray = function(comparer) {
    for(var i=0; i < this.length; i++) {
        if(comparer(this[i])) return true;
    }
    return false;
};
app.use(logger('dev'));

// adds an element to the array if it does not already exist using a comparer
// function
Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
    }
};
ValueDriver.find({},function(err, allvaluedrivers) {
  if (err) {
    console.log("error: " + err.message);
    return res.error('err');
  }

  JSON.stringify("AVD: " + allvaluedrivers);
  app.set('allvaluedrivers',allvaluedrivers);
});
ProofPoint.find({},function(err, allproofpoints) {
  if (err) {
    logger("error: " + err.message);
    return res.error('err');
  }
  app.set('allproofpoints',allproofpoints);
});
ValueDriver.distinct("casesforchange.name", function(err, allcasesforchange) {
  if (err) {
    console.log("error: " + err.message);
    return res.error('err');
  }
  app.set('allcasesforchange',allcasesforchange);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
