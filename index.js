/* module imports *************************************************************/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const mustacheExpress = require('mustache-express');
// hard mode *******************************************************************
const jsonfile = require('jsonfile');
const file = './data/list.json';
const data = [];

jsonfile.readFile(file, function(err, obj) {
  if (err) {
    console.log(error);
  } else {
    data.concat(obj.items);
  }
});

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');


// parse all requests using the generic body parser (req.body is now available)
app.use(bodyParser.urlencoded({extended: true}));
// gives us a way to validate input (e.g., ensure emails are valid)
app.use(expressValidator());
app.use('/static', express.static(path.join(__dirname, 'public')));

const todos = [
  { id: 0, item: "Wake up in the morning", completed: false },
  { id: 1, item: "Take the 8:15 to the city", completed: false },
  { id: 2, item: "Start your slaving job to get your pay", completed: false }
];

app.get('/', function(req, res) {
  res.render('index', { todos: data });
});
app.get('/list', function(req, res) {
  res.render('index', { todos: data });
});

app.post('/', function(req, res) {
  req.checkBody('item', 'Add some text first!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    // console.log(errors);
    res.render('index', { errorMessage: errors[0].msg, todos: data });
  } else {
    data.push({ id: data.length, item: req.body.item, completed: false });
    jsonfile.writeFile(file, data, err => console.log(err));
    res.render('index', { todos: data });
  }
});

app.post('/list', function(req, res) {
  data[req.body.check].completed = true;
  jsonfile.writeFile(file, data, err => console.log(err));
  res.render('index', { todos: data });
});

app.listen(3030, () => console.log('Servin\'...'));
