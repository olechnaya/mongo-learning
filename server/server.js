var express = require('express');
var bodyParser = require('body-parser');

var path = require('path')
var multer  =   require('multer');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectId} = require('mongodb');
const hbs = require('hbs');
// for partial views work properly
// https://github.com/dpolivy/hbs-utils
var hbsutils = require('hbs-utils')(hbs);

var app = express();
const port = process.env.PORT || 3000;
const projectFolder = process.env.PWD;

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage : storage}).single('userPhoto');


hbs.registerPartials(projectFolder + '/views/partials');
hbsutils.registerWatchedPartials(projectFolder + '/views/partials');
app.set('view engine', 'hbs');

app.use(express.static(projectFolder + '/public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/add-todo', (req, res) => {
  res.render('add-todo.hbs', {
    pageTitle: 'Adding to do',
    welcomeMessage: 'Adding to do page'
  });
});

app.post('/todos', (req, response) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (e) => {
    response.status(400).send(e);
  })
});

app.get('/todos', (req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req,res) => {
  var id = req.params.id;

  if(ObjectId.isValid(id)) {
    Todo.findById(id).then((todo) => {
      res.send({todo});
    }, (e) => {
      res.status(400).send(e);
    });
  } else {
    res.status(404).send(e);
  }
});

app.post('/photoUpload',function(req,res){
    upload(req,res,function(err) {
      console.log(req);
        if(err) {
            return res.end("Error uploading file.");
        }

        res.end("File is uploaded");
    });
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

app.listen(port, () => {
  console.log(`Started up at port: ${port}`);
});
