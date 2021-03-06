var map;

// Location data
var locationData = [
  {name: 'Colosseum', lat: 41.8902, long: 12.4922},
  {name: 'Pantheon', lat: 41.8986, long: 12.4769},
  {name: 'Roman Forum', lat: 41.8925, long: 12.4853},
  {name: 'Trevi Fountain', lat: 41.9009, long: 12.4833},
  {name: 'St. Peter\'s Basilica', lat: 41.9022, long: 12.4539},
  {name: 'Castel Sant\'Angelo', lat: 41.9031, long: 12.4663},
  {name: 'Palatine Hill', lat: 41.8894, long: 12.4875},
  {name: 'Vatican Museums', lat: 41.9065, long: 12.4536},
  {name: 'Sistine Chapel', lat: 41.9029, long: 12.4545},
  {name: 'Piazza Navona', lat: 41.8992, long: 12.4731},
  {name: 'Spanish Steps', lat: 41.9060, long: 12.4828},
  {name: 'Capitoline Hill', lat: 41.8934, long: 12.4828},
  {name: 'Galleria Borghese', lat: 41.9142, long: 12.4921},
  {name: 'Basilica di Maggiore', lat: 41.8976, long: 12.4984},
  {name: 'Altare della Patria', lat: 41.8946, long: 12.4831},
  {name: 'Piazza di Spagna', lat: 41.9057, long: 12.4823},
  {name: 'Bocca della Verità', lat: 41.8881, long: 12.4814},
  {name: 'Arch of Constantine', lat: 41.8898, long: 12.4906},
  {name: 'Circus Maximus', lat: 41.8861, long: 12.4851},
  {name: 'Aventine Hill', lat: 41.8825, long: 12.4776},
  {name: 'Campo de\' Fiori', lat: 41.8956, long: 12.4722},
  {name: 'Ponte Sisto', lat: 41.8924, long: 12.4708},
  {name: 'Piazza Barberini', lat: 41.9038, long: 12.4886},
  {name: 'Quirinal Palace', lat: 41.8996, long: 12.4870},
  {name: 'Palazzo delle Esposizioni', lat: 41.8995, long: 12.4901},
  {name: 'Santa Cecilia in Trastevere', lat: 41.8876, long: 12.4758},
  {name: 'Trajan\'s Market', lat: 41.8956, long: 12.4862},
  {name: 'Trajan\'s Forum', lat: 41.8952, long: 12.4853},
  {name: 'Trajan\'s Column', lat: 41.8958, long: 12.4843},
  {name: 'Forum of Augustus', lat: 41.8943, long: 12.4869},
  {name: 'Capitoline Museums', lat: 41.8929, long: 12.4826},
  {name: 'Theatre of Marcellus', lat: 41.8919, long: 12.4799}
];

var Landmark = function(data) {
  
  var self = this;

  self.name = data.name;
  self.lat = data.lat;
  self.long = data.long;
  self.class = data.class;
  self.flickrPics = null;
  self.knowInfo = null;

  self.visible = ko.observable(true);

  // Creates empty string for infowindow
  self.infoString = '';

  // Creates infowindow object
  self.infoWindow = new google.maps.InfoWindow();

  // Marker icon style
  var defaultIcon = makeMarkerIcon('ff8100');

  // Creates marker objects
  self.marker = new google.maps.Marker({
      position: {lat: self.lat, lng: self.long},
      map: map,
      title: self.name,
      icon: defaultIcon
  });

  // Shows markers on map if locations on list are visible
  self.showMarker = ko.computed(function() {
    if(self.visible() === true) {
      self.marker.setMap(map);
    } else {
      self.marker.setMap(null);
    }
    return true;
  }, self);


  // Adds content to infowindow
  self.showInfo = function() {
    // Adds basic content to infowindow
    if (!self.infoWindow.getContent()) {
      var content = '<div class="info-window-content"><div class="title"><h2>' + self.name + "</h2></div>";
      content += '<div id="accordion"><h2>Details</h2>';
      self.infoWindow.setContent(content);
    }

    // Adds knowledge graph content to infowindow
    if (!self.knowInfo) {
      var service_url = 'https://kgsearch.googleapis.com/v1/entities:search?query=' + self.name + '&key=AIzaSyBm1yQY89TOUlWsuCm4GhIov8XgWLcQQeM&limit=1&indent=True';

      $.getJSON(service_url, function(response) {
        var content = '<div><img id="theimg" class="img-thumbnail img-responsive center-block" src="' + response.itemListElement[0].result.image.contentUrl + '"/>';
        content +=  '<p id="thebody">' + response.itemListElement[0].result.detailedDescription.articleBody + '</p></div>';
        self.knowInfo = content;
        var addContent = self.infoWindow.getContent() + content;
        self.infoWindow.setContent(addContent);
      });
      $.getJSON(service_url).fail(function() {
        var content = 'Could not retrieve information about the ' + self.name;
        self.knowInfo = content;
        var errorContent = self.infoWindow.getContent() + content;
        self.infoWindow.setContent(errorContent);
      });
    }

    // Adds flickr content to infowindow
    if (!self.flickrPics) {
      flickr.flickrPhotos(self.name, function(results) {
        var content = '<h2>Images</h2>';
        results.forEach(function(results) {
            content += '<div><img class="img-thumbnail img-responsive center-block" src="' + results.cdnUrl + '"/></div>';
        });
        content +='</div>';
        self.flickrPics = content;
        var addContent = self.infoWindow.getContent() + content;
        self.infoWindow.setContent(addContent);
      });
    }


    self.infoWindow.open(map, self.marker);

  };

  self.activateInfo = function() {
    // Deactivates infowindow if another landmark is activated
    if (Landmark.active) {
      if (Landmark.active !== self) {
        Landmark.active.deactivateInfo();
      }
    }

    // Creates marker bounce animation
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    
    // Enables infowindow
    self.showInfo();

    // Limits bounce animation
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 3500);

    // Centers map to marker
    map.panTo(self.marker.getPosition());

    // Sets current landmark as active
    Landmark.active = self;
  };

  // Function for deactivating the infowindow
  self.deactivateInfo = function() {
    self.infoWindow.close();

    Landmark.active = null;
  };

  // Activate infowindow for clicked marker and deactivate
  // for previously selected marker
  self.clickMarker = function() {
    if (Landmark.active === self) {
      self.deactivateInfo();
    } else {
      self.activateInfo();
    }
  };

  // Deactivates infowindow when clicking close button
  self.closeInfoWindow = function() {
    self.deactivateInfo();
  };

  self.marker.addListener('click', self.clickMarker);

  self.infoWindow.addListener('closeclick', self.closeInfoWindow);

  // Triggers marker when filterable list item is clicked
  self.animate = function() {
    google.maps.event.trigger(self.marker, 'click');
  };


};


function AppViewModel() {
  var self = this;
  self.locationList = ko.observableArray([]);
  self.searchTerm = ko.observable("");

  // Adds locations to observable array
  locationData.forEach(function(locationItem){
    self.locationList.push( new Landmark(locationItem));
  });

  // Filters locations based upon input in input field
  self.filteredList = ko.computed( function() {
    var filter = self.searchTerm().toLowerCase();
    if (!filter) {
      self.locationList().forEach(function(locationItem){
        locationItem.visible(true);
      });
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
        var string = locationItem.name.toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);
        return result;
      });
    }
  }, self);

}


function initMap() {

  // Defines styles for the map
  var styles = [
    { "elementType": "labels",
        "stylers": [
            { "visibility": "off" },
            { "color": "#f49f53" }
        ]},
    { "featureType": "landscape",
        "stylers": [
            { "color": "#f9ddc5" },
            { "lightness": -7 }
        ]},
    { "featureType": "road",
        "stylers": [
            { "color": "#813033" },
            { "lightness": 43 }
        ]},
    { "featureType": "poi.business",
        "stylers": [
            { "color": "#645c20" },
            { "lightness": 38 }
        ]},
    { "featureType": "water",
        "stylers": [
            { "color": "#1994bf" },
            { "saturation": -69 },
            { "gamma": 0.99 },
            { "lightness": 43 }
        ]},
    { "featureType": "road.local",
      "elementType": "geometry.fill",
        "stylers": [
            { "color": "#f19f53" },
            { "weight": 1.3 },
            { "visibility": "on" },
            { "lightness": 16 }
        ]},
    { "featureType": "poi.business" },
    { "featureType": "poi.park",
        "stylers": [
            { "color": "#645c20" },
            { "lightness": 39 }
        ]},
    { "featureType": "poi.school",
        "stylers": [
            { "color": "#a95521" },
            { "lightness": 35 }
        ]},
    { "featureType": "poi.medical",
      "elementType": "geometry.fill",
        "stylers": [
            { "color": "#813033" },
            { "lightness": 38 },
            { "visibility": "off" }
        ]},
    { "elementType": "labels" },
    { "featureType": "poi.sports_complex",
        "stylers": [
            { "color": "#9e5916" },
            { "lightness": 32 }
        ]},
    { "featureType": "poi.government",
        "stylers": [
            { "color": "#9e5916" },
            { "lightness": 46 }
        ]},
    { "featureType": "transit.station",
        "stylers": [
            { "visibility": "off" }
        ]},
    { "featureType": "transit.line",
        "stylers": [
            { "color": "#813033" },
            { "lightness": 22 }
        ]},
    { "featureType": "transit",
        "stylers": [
            { "lightness": 38 }
        ]},
    { "featureType": "road.local",
      "elementType": "geometry.stroke",
        "stylers": [
            { "color": "#f19f53" },
            { "lightness": -10}
        ]}
  ];

  // Creates Google Map object
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 41.8992, lng: 12.4731},
    styles: styles,
    mapTypeControl: false
  });


  // Activate Knockout once the map is initialized
  ko.applyBindings(new AppViewModel());
}

// Function to create custom marker color
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// Creates alert if app cannot connect to Google Maps API
function mapError() {
    alert('Google Maps could not load!');
}


function Flickr() {
  // Photo search function for Flickr API
  function searchFlickr(landmarkname, callback) {
    var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3929dc66b4439e3261143f1187ad2031&text=' + landmarkname + '&sort=relevance&per_page=15&format=json&nojsoncallback=1';
    $.getJSON(flickrAPI, callback).fail(function() {
      alert('Flickr photos could not load!');
    });
  }

  // Creates image object and builds image ref
  function createImgObj(info) {
    var url = 'https://farm' + info.farm + '.static.flickr.com/' + info.server + '/' + info.id + '_' + info.secret + '_m.jpg';
    var imageObj = {
      cdnUrl: url
    };
    return imageObj;
  }

  // Loops through image objects and builds URLs based upon data returned
  // from Flickr API
  this.flickrPhotos = function(landmarkname, callback) {
    searchFlickr(landmarkname, function(results) {
      var photos = results.photos.photo;
      var photoArray = [];
      var imageObject;
      var photoIter = 0;
      for (var i = 0; i < photos.length; i++) {
        imageObject = createImgObj(photos[i]);
        photoArray.push(imageObject);
        photoIter++;
        if (photoIter === photos.length) {
          callback(photoArray);
        }
      }
    });
  };

}


var flickr = new Flickr();