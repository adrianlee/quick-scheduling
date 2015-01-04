var bodyParser = require('body-parser');
var express = require('express')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html')
// });

// create a new event
app.post('/event', function (req, res) {
  console.log(req);

  res.send(req.body);
});

// fetch event
app.get('/event/:id', function (req, res) {
  console.log(req.params.id);

  res.send(req.params);
});

// create event entry
app.post('/event/:id', function (req, res) {
  console.log(req);

  res.send(req.body);
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