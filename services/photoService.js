var flickrApi = require('flickrapi');
var apiKey = {api_key: "hidden my key"};

var recentPhotos = [];
var photoCount = 300;
var searchTag = 'mountain';

function getSearch(tag){
    searchTag = tag;
}

function getPhotos(callback) {
    flickrApi.tokenOnly(apiKey, function (err, flickr) {
        flickr.photos.search({tags: searchTag, page: 1, per_page: photoCount}, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            var photos = result.photos.photo;
            var i = 0;
            photos.forEach(function (photo) {
                // get the meta data
                var title = photo.title;
                var link = composePhotoUrl(photo.owner, photo.id);
                var src = composePhotoSrc(photo);

                populateTags(flickr, photo.id, function (tags) {
                    recentPhotos.push({
                        title: title,
                        link: link,
                        src: src,
                        tags: tags,
                        originalIndex: i++
                    });
                    if (recentPhotos.length == 100) {
                        callback();
                    }
                });
            });
        });
    });
}

function composePhotoUrl(userId, photoId) {
    return 'https://www.flickr.com/photos/' + userId + '/' + photoId;
}

function composePhotoSrc(photo) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';
}

function populateTags(flickr, photoId, callback) {
    flickr.photos.getInfo({photo_id: photoId}, function (err, result) {
        var rawTags = [];
        result.photo.tags.tag.forEach(function (tag) {
            rawTags.push(tag.raw);
        });
        tags = rawTags.join();
        callback(tags);
    });
}

module.exports = {
    getPhotos: getPhotos,
    recentPhotos: recentPhotos,
    getSearch: getSearch
};
