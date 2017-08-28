var express = require('express');
var router = express.Router();

var photoService = require('../services/photoService');

router.get('/photos', function (req, res) {
    var topic = req.query.targetTopic;
    photoService.getSearch(topic);
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

    console.log("Client Request from " + ip);

    var photos = photoService.recentPhotos;
    res.json(photos);
});

module.exports = router;