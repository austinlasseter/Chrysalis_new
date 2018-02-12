console.log('something');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');


var index = require('./routes/index');
var users = require('./routes/users');
// var api = require('./routes/api');
var categories = require('./routes/api/categories');
var transactions = require('./routes/api/transactions');

var app = express();
const { PORT } = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

console.log(PORT);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ secret: 'grace',
	resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

app.use('/api/categories', categories);
app.use('/api/transactions', transactions);

// app.use('/users', users);

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


///////////////////////////////////////////////////////////////////////////


// add let server, run server, and close server
let server;

function runServer( port = PORT) { //*?* why do there need to be inputs now?
	// const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		// console.log(DATABASE_URL);
		 mongoose.connect("mongodb://chrysalis:chrysalis@ds155577.mlab.com:55577/chrysalis", err => {
			if (err) {
				return reject(err); //*?* how does this work?
			}

		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${port}`);
			resolve (server);

		})

		.on('error', err => {
			mongoose.disconnect(); //*?* why is this needed in addition to the close server?
			// it seems like it's because the connection is within the runserver, so it needs to 
			reject(err)
		});
});
});
};

function closeServer() {
	// return mongoose.disconnect().then(() => { //*?* same question as above: what is the purpose of this line
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if (err) {
				return reject(err);
				// VS.
				// reject(err);
				// return;
			}
			resolve();
		});
	});
	// });
};

if (require.main === module) {
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
