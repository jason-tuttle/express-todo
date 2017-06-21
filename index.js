/* module imports *************************************************************/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const mustacheExpress = require('mustache-express');

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
  res.render('index', { todos: todos });
});
app.get('/list', function(req, res) {
  res.render('index', { todos: todos });
});

app.post('/', function(req, res) {
  req.checkBody('item', 'Add some text first!').notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    // console.log(errors);
    res.render('index', { errorMessage: errors[0].msg, todos: todos });
  } else {
    todos.push({ id: todos.length, item: req.body.item, completed: false });
    res.render('index', { todos: todos });
  }
});

app.post('/list', function(req, res) {
  todos[req.body.check].completed = true;
  res.render('index', { todos: todos });
});

app.listen(3030, () => console.log('Servin\'...'));
