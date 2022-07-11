// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express') , bodyParser = require('body-parser');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
require('./config/session.config')(app);
// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);
const index = require('./routes/shared');
app.use('/', index);
app.use(bodyParser.json());
const index1 = require('./routes/private');
app.use('/', index1);

// default value for title local
const projectName = 'tracker';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();
//app.locals.title = `${capitalized(projectName)};

module.exports = app;








