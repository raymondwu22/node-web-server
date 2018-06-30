const express = require('express');
const hbs = require('hbs');
const moment = require('moment');
const fs = require('fs');

const app = express();
hbs.registerPartials(`${__dirname}/views/partials`);
app.set('view engine', 'hbs');

// Middleware - note the app.use()
// logger for request
app.use((req, res, next) => {
  const now = moment().format('YYYY-MM-DD HH:MM');
  const log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile('server.log', `${log}\n`, err => {
    if (err) {
      console.log('Unable to append to server log.');
    }
  });

  next();
});

// stops everything else from executing (no next call)
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});

app.use(express.static(`${__dirname}/public`));

// register global helper fn
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

app.get('/', (req, res) => {
  // res.send('<h1>Hello express from root</h1>');
  res.render('home.hbs', {
    title: 'Home page',
    welcomeMsg: 'Welcome to my home page',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'About page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    error: 'ERROR!',
  });
});

app.listen(3000, () => {
  console.log('Server is listening!');
});
