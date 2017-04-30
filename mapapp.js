var map;

/*// Create a new blank array for all the landmark markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];*/

// Locations array
var initialLocations = [
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



var Location = function(data) {
  var self = this;
  this.name = data.name;
  this.lat = data.lat;
  this.long = data.long;

  this.visible = ko.observable(true);

  this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div></div>";

  this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

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

  this.marker.addListener('click', function(){
    self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div></div>";

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

      // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
  this.marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
  this.marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });

};



function AppViewModel() {
  var self = this;

  var styles = [
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#f49f53"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#f9ddc5"
            },
            {
                "lightness": -7
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#1994bf"
            },
            {
                "saturation": -69
            },
            {
                "gamma": 0.99
            },
            {
                "lightness": 43
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "weight": 1.3
            },
            {
                "visibility": "on"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi.business"
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "color": "#645c20"
            },
            {
                "lightness": 39
            }
        ]
    },
    {
        "featureType": "poi.school",
        "stylers": [
            {
                "color": "#a95521"
            },
            {
                "lightness": 35
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 38
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels"
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 32
            }
        ]
    },
    {
        "featureType": "poi.government",
        "stylers": [
            {
                "color": "#9e5916"
            },
            {
                "lightness": 46
            }
        ]
    },
    {
        "featureType": "transit.station",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "color": "#813033"
            },
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "lightness": 38
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#f19f53"
            },
            {
                "lightness": -10
            }
        ]
    }
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


/*function initMap() {
  // Create a styles array to use with the map.
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];


  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our landmark marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
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

// This is the PLACE DETAILS search - it's the most detailed so it's only
// executed when a marker is selected, indicating the user wants more
// details about that place.
function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: marker.id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
      infowindow.marker = marker;
      var innerHTML = '<div>';
      if (place.name) {
        innerHTML += '<strong>' + place.name + '</strong>';
      }
      if (place.formatted_address) {
        innerHTML += '<br>' + place.formatted_address;
      }
      if (place.formatted_phone_number) {
        innerHTML += '<br>' + place.formatted_phone_number;
      }
      if (place.opening_hours) {
        innerHTML += '<br><br><strong>Hours:</strong><br>' +
            place.opening_hours.weekday_text[0] + '<br>' +
            place.opening_hours.weekday_text[1] + '<br>' +
            place.opening_hours.weekday_text[2] + '<br>' +
            place.opening_hours.weekday_text[3] + '<br>' +
            place.opening_hours.weekday_text[4] + '<br>' +
            place.opening_hours.weekday_text[5] + '<br>' +
            place.opening_hours.weekday_text[6];
      }
      if (place.photos) {
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}) + '">';
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
}
*/


function initialize() {
  ko.applyBindings(new AppViewModel());
}