var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var db = require('./database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html')
// });

// create a new event
app.post('/event', function (req, res) {
  console.log(req.body);

  if (!req.body.name) {
    return res.sendStatus(400);
  }

  var newEvent = new db.Event({ name: req.body.name, detail: req.body.detail });

  newEvent.save(function (err, doc) {
    if (err)
      return res.send(400, err);

    res.send(doc);
  });

});

// fetch event
app.get('/event/:id', function (req, res) {
  db.Event.findOne({ id: req.params.id }, function (err, doc) {
    if (err) return res.sendStatus(400);

    if (doc) {
      res.send(doc);
    } else {
      res.sendStatus(404);
    }
  });

});

// create event entry
app.post('/event/:id', function (req, res) {
  console.log(req);

  res.send(req.body);
});

// fetch event
app.get('/vote/:id', function (req, res) {
  db.Event.findOne({ id: req.params.id }, function (err, doc) {
    if (err) return res.sendStatus(400);

    if (doc) {
      res.send(doc);
    } else {
      res.sendStatus(404);
    }
  });
});

app.use(express.static(__dirname + '/public'));

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var server = app.listen(4000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Listening at http://%s:%s', host, port)
});