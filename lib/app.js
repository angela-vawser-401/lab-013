const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');
app.use(morgan('dev'));
const ensureAuth = require('./middleware/ensure-auth');
const ensureRole = require('./middleware/ensure-role');
app.use(express.json());
app.use(checkConnection());

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

// API ROUTES
const auth = require('./routes/auth');
const bands = require('./routes/bands');
const dogs = require('./routes/dogs');
const me = require('./routes/me');
app.use('/api/auth', auth);
app.use('/api/bands', ensureAuth(), bands);
app.use('/api/dogs', ensureAuth(), dogs);
app.use('/api/me', ensureAuth(), me);

// NOT FOUND
const api404 = require('./middleware/api-404');
app.use('/api', api404);
// using express default 404 for non-api routes

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;