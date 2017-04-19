var map;

// Create a new blank array for all the landmark markers.
var markers = [];

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];

// Locations array
var locations = [
  {title: 'Colosseum', location: {lat: 41.8902, lng: 12.4922}},
  {title: 'Pantheon', location: {lat: 41.8986, lng: 12.4769}},
  {title: 'Roman Forum', location: {lat: 41.8925, lng: 12.4853}},
  {title: 'Trevi Fountain', location: {lat: 41.9009, lng: 12.4833}},
  {title: 'St. Peter\'s Basilica', location: {lat: 41.9022, lng: 12.4539}},
  {title: 'Castel Sant\'Angelo', location: {lat: 41.9031, lng: 12.4663}},
  {title: 'Palatine Hill', location: {lat: 41.8894, lng: 12.4875}},
  {title: 'Vatican Museums', location: {lat: 41.9065, lng: 12.4536}},
  {title: 'Sistine Chapel', location: {lat: 41.9029, lng: 12.4545}},
  {title: 'Piazza Navona', location: {lat: 41.8992, lng: 12.4731}},
  {title: 'Spanish Steps', location: {lat: 41.9060, lng: 12.4828}},
  {title: 'Capitoline Hill', location: {lat: 41.8934, lng: 12.4828}},
  {title: 'Galleria Borghese', location: {lat: 41.9142, lng: 12.4921}},
  {title: 'Basilica di Maggiore', location: {lat: 41.8976, lng: 12.4984}},
  {title: 'Altare della Patria', location: {lat: 41.8946, lng: 12.4831}},
  {title: 'Piazza di Spagna', location: {lat: 41.9057, lng: 12.4823}},
  {title: 'Bocca della Verità', location: {lat: 41.8881, lng: 12.4814}},
  {title: 'Arch of Constantine', location: {lat: 41.8898, lng: 12.4906}},
  {title: 'Circus Maximus', location: {lat: 41.8861, lng: 12.4851}},
  {title: 'Aventine Hill', location: {lat: 41.8825, lng: 12.4776}},
  {title: 'Campo de\' Fiori', location: {lat: 41.8956, lng: 12.4722}},
  {title: 'Ponte Sisto', location: {lat: 41.8924, lng: 12.4708}},
  {title: 'Piazza Barberini', location: {lat: 41.9038, lng: 12.4886}},
  {title: 'Quirinal Palace', location: {lat: 41.8996, lng: 12.4870}},
  {title: 'Palazzo delle Esposizioni', location: {lat: 41.8995, lng: 12.4901}},
  {title: 'Santa Cecilia in Trastevere', location: {lat: 41.8876, lng: 12.4758}},
  {title: 'Trajan\'s Market', location: {lat: 41.8956, lng: 12.4862}},
  {title: 'Trajan\'s Forum', location: {lat: 41.8952, lng: 12.4853}},
  {title: 'Trajan\'s Column', location: {lat: 41.8958, lng: 12.4843}},
  {title: 'Forum of Augustus', location: {lat: 41.8943, lng: 12.4869}},
  {title: 'Capitoline Museums', location: {lat: 41.8929, lng: 12.4826}},
  {title: 'Theatre of Marcellus', location: {lat: 41.8919, lng: 12.4799}}
];

var Location = function(data) {
  var self = this;
  this.title = data.title;
  this.lat = data.lat;
  this.lng = data.lng;

  this.visible = ko.observable(true);
};

// Knockout Model
function AppViewModel() {
  var self = this;
  self.landmarks = ko.observableArray([]);

  self.currentFilter = ko.observable("");

  locations.forEach(function(landmarkItem){
    self.landmarks.push( new Location(landmarkItem));
  });

  self.filterLandmarks = ko.computed(function() {
    var filter = self.currentFilter().toLowerCase();
    if (!filter) {
      self.landmarks().forEach(function(landmarkItem) {
        landmarkItem.visible(true);
      });
      return self.landmarks();
    } else {
      return ko.utils.arrayFilter(self.landmarks(), function(landmarkItem) {
        var string = landmarkItem.title.toLowerCase();
        var result = (string.search(filter) >= 0);
        landmarkItem.visible(result);
        return result;
      });
    }
  }, self);
}

function initMap() {
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

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.8992, lng: 12.4731},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

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
  document.getElementById('show-landmarks').addEventListener('click', showLandmarks);

  document.getElementById('hide-landmarks').addEventListener('click', function() {
    hideMarkers(markers);
  });

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

// This function will loop through the markers array and display them all.
function showLandmarks() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the landmarks and hide them all.
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
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