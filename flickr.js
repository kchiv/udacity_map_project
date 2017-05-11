function Flickr() {
  var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3929dc66b4439e3261143f1187ad2031&text={landmarkname}&per_page=15&format=json&nojsoncallback=1';
  var imgsourceURL = 'https://farm{farm_id}.static.flickr.com/{server_id}/{photo_id}_{secret}_m.jpg';
  var getInfoUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=3929dc66b4439e3261143f1187ad2031&photo_id={photo_id}&format=json&nojsoncallback=1';

  function search(landmarkname, callback) {
      var url = flickrAPI.replace('{landmarkname}', landmarkname);
      $.getJSON(url, callback).fail(function() {
          alert('ERROR: Failed to search Flickr for related photos');
          console.log('ERROR: Flickr photos.search failed');
      });
  }

  // Internal function that uses the Flickr API flickr.photos.getInfo to
  // obtain extended info on a photo
  function getInfo(photo_id, callback) {
      var url = getInfoUrl.replace('{photo_id}', photo_id);
      $.getJSON(url, callback).fail(function() {
          alert('ERROR: Failed to obtain info for Flickr photo (id: ' +
              photo_id + ')');
          console.log('ERROR: Flickr photos.getInfo failed');
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

          // Iterate over each photo result, building URLs for the source
          // images as well as collecting extra info about the photo
          for (var i = 0; i < photos.length; i++) {
              // Create info object, initially containing photo's source URLs
              infoObj = initInfoObject(photos[i]);
              infoObjects.push(infoObj);

              // Get extra info about the photo and add it to the info
              // object. Since this creates a callback that needs access to
              // a local variable that changes with each loop iteration, the
              // code uses an immediately-invoked function expression.
              var getInfoCounter = 0;
              getInfo(photos[i].id, (function(infoObj) {
                  return function(info) {


                      // Keep track of how many successful getInfo calls
                      // we've made
                      getInfoCounter++;

                      // Once the number of getInfo calls reaches the number
                      // of original photo results, invoke the callback arg
                      // since the info objects are now completely built
                      if (getInfoCounter === photos.length) {
                          callback(infoObjects);
                      }
                  };
              })(infoObj));
          }
      });
  };



}


var flickr = new Flickr();