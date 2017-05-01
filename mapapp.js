var map;

/*// Create a new blank array for all the landmark markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];*/

// Locations array
var initialLocations = [
  {name: 'Colosseum', lat: 41.8902, long: 12.4922, class: 'colo'},
  {name: 'Pantheon', lat: 41.8986, long: 12.4769, class: 'pan'},
  {name: 'Roman Forum', lat: 41.8925, long: 12.4853, class: 'forum'},
  {name: 'Trevi Fountain', lat: 41.9009, long: 12.4833, class: 'fountain'},
  {name: 'St. Peter\'s Basilica', lat: 41.9022, long: 12.4539, class: 'basil'},
  {name: 'Castel Sant\'Angelo', lat: 41.9031, long: 12.4663, class: 'angelo'},
  {name: 'Palatine Hill', lat: 41.8894, long: 12.4875, class: 'palatine'},
  {name: 'Vatican Museums', lat: 41.9065, long: 12.4536, class: 'vatican'},
  {name: 'Sistine Chapel', lat: 41.9029, long: 12.4545, class: 'sistine'},
  {name: 'Piazza Navona', lat: 41.8992, long: 12.4731, class: 'piazza'},
  {name: 'Spanish Steps', lat: 41.9060, long: 12.4828, class: 'spanish'},
  {name: 'Capitoline Hill', lat: 41.8934, long: 12.4828, class: 'capitoline'},
  {name: 'Galleria Borghese', lat: 41.9142, long: 12.4921, class: 'borghese'},
  {name: 'Basilica di Maggiore', lat: 41.8976, long: 12.4984, class: 'maggiore'},
  {name: 'Altare della Patria', lat: 41.8946, long: 12.4831, class: 'patria'},
  {name: 'Piazza di Spagna', lat: 41.9057, long: 12.4823, class: 'spagna'},
  {name: 'Bocca della Verità', lat: 41.8881, long: 12.4814, class: 'verita'},
  {name: 'Arch of Constantine', lat: 41.8898, long: 12.4906, class: 'constantine'},
  {name: 'Circus Maximus', lat: 41.8861, long: 12.4851, class: 'maximus'},
  {name: 'Aventine Hill', lat: 41.8825, long: 12.4776, class: 'aventine'},
  {name: 'Campo de\' Fiori', lat: 41.8956, long: 12.4722, class: 'fiori'},
  {name: 'Ponte Sisto', lat: 41.8924, long: 12.4708, class: 'sisto'},
  {name: 'Piazza Barberini', lat: 41.9038, long: 12.4886, class: 'barberini'},
  {name: 'Quirinal Palace', lat: 41.8996, long: 12.4870, class: 'quirinal'},
  {name: 'Palazzo delle Esposizioni', lat: 41.8995, long: 12.4901, class: 'esposizioni'},
  {name: 'Santa Cecilia in Trastevere', lat: 41.8876, long: 12.4758, class: 'trastevere'},
  {name: 'Trajan\'s Market', lat: 41.8956, long: 12.4862, class: 'trajmarket'},
  {name: 'Trajan\'s Forum', lat: 41.8952, long: 12.4853, class: 'trajforum'},
  {name: 'Trajan\'s Column', lat: 41.8958, long: 12.4843, class: 'trajcol'},
  {name: 'Forum of Augustus', lat: 41.8943, long: 12.4869, class: 'augustus'},
  {name: 'Capitoline Museums', lat: 41.8929, long: 12.4826, class: 'capitolinemuse'},
  {name: 'Theatre of Marcellus', lat: 41.8919, long: 12.4799, class: 'theatre'}
];



var Location = function(data) {
  var self = this;
  this.name = data.name;
  this.lat = data.lat;
  this.long = data.long;
  this.class = data.class;

  this.visible = ko.observable(true);

  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
      '<div class=' + data.class + '>' + data.lat + "</a></div>";

  this.infoWindow = new google.maps.InfoWindow({
    content: self.contentString
  });

  var defaultIcon = makeMarkerIcon('ff8100');
  var highlightedIcon = makeMarkerIcon('FFFF24');

  this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat, data.long),
      map: map,
      title: data.name,
      icon: defaultIcon
  });

  this.showMarker = ko.computed(function() {
    if(this.visible() === true) {
      this.marker.setMap(map);
    } else {
      this.marker.setMap(null);
    }
    return true;
  }, this);

  var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';

  this.params = {
          'query': data.name,
          'limit': 1,
          'indent': true,
          'key' : 'AIzaSyBm1yQY89TOUlWsuCm4GhIov8XgWLcQQeM',
      };

  // Bounce animation on mouseover
  this.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class=' + data.class + '>' + data.lat + "</a></div>";


          $.getJSON(service_url + '?callback=?', self.params, function(response) {
    $.each(response.itemListElement, function(i, element) {
      $('<div>', {text:element['result']['detailedDescription']['articleBody']}).appendTo('.' + data.class);
    });
  });

        self.infoWindow.setContent(self.contentString);

    self.infoWindow.open(map, this);

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
          self.marker.setAnimation(null);
      }, 2100);
  });

  this.bounce = function(place) {
    google.maps.event.trigger(self.marker, 'click');
  };

};



function AppViewModel() {
  var self = this;

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
  ]

  this.searchTerm = ko.observable("");

  this.locationList = ko.observableArray([]);

  map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: {lat: 41.8992, lng: 12.4731},
      styles: styles,
      mapTypeControl: false
  });

  initialLocations.forEach(function(locationItem){
    self.locationList.push( new Location(locationItem));
  });

  this.filteredList = ko.computed( function() {
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

  this.mapElem = document.getElementById('map');
  this.mapElem.style.height = window.innerHeight - 50;
}


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
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

function initialize() {
  ko.applyBindings(new AppViewModel());
}