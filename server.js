var express = require('express');
var app = express();

var photoService = require('./services/photoService');
photoService.getPhotos(function () {
    var restRouter = require('./routes/rest');
    var port = 3000;
    app.use('/', express.static(__dirname + '/'));
    app.use('/api/v1', restRouter);

    app.listen(port);
    console.log("Listening to " + port);
});

