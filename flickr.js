function Flickr() {
  var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3929dc66b4439e3261143f1187ad2031&text={landmarkname}&sort=relevance&per_page=15&format=json&nojsoncallback=1';
  var imgsourceURL = 'https://farm{farm_id}.static.flickr.com/{server_id}/{photo_id}_{secret}_m.jpg';

  function search(landmarkname, callback) {
    var url = flickrAPI.replace('{landmarkname}', landmarkname);
    $.getJSON(url, callback).fail(function() {
      alert('ERROR: Failed to search Flickr for related photos');
      console.log('ERROR: Flickr photos.search failed');
    });
  }

  function initInfoObject(photoData) {
    var url = imgsourceURL.replace('{farm_id}', photoData.farm)
      .replace('{server_id}', photoData.server)
      .replace('{photo_id}', photoData.id)
      .replace('{secret}', photoData.secret);
    var obj = {
      imgThumbUrl: url
    }
    return obj;
  }


  this.getPhotos = function(landmarkname, callback) {
    search(landmarkname, function(results) {
      var photos = results.photos.photo;
      var infoObjects = [];
      var infoObj;
      var getInfoCounter = 0;
      // Iterate over each photo result, building URLs for the source
      // images as well as collecting extra info about the photo
      for (var i = 0; i < photos.length; i++) {
        // Create info object, initially containing photo's source URLs
        infoObj = initInfoObject(photos[i]);
        infoObjects.push(infoObj);
        getInfoCounter++;
        if (getInfoCounter === photos.length) {
          callback(infoObjects);
        }
      }
    });
  };

}


var flickr = new Flickr();