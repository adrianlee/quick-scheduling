var mongoose = require("mongoose");
mongoose.connect('mongodb://adrian:123123123@ds031108.mongolab.com:31108/quickscheduling');

module.exports.Event = mongoose.model('Event', {
	name: String,
	detail: String,
	id: { type: String, default: function () { return makeid() }},
  events: [{
    title: String,
    date: Date,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}