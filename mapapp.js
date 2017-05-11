var map;

// Location data
var locationData = [
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









var Landmark = function(data) {
  
  var self = this;

  self.name = data.name;
  self.lat = data.lat;
  self.long = data.long;
  self.class = data.class;
  self.flickrContent = null;

  self.visible = ko.observable(true);

  // Creates empty string for infowindow
  self.infoString = '';

  // Creates infowindow object
  self.infoWindow = new google.maps.InfoWindow();

  // Marker icon styles
  var defaultIcon = makeMarkerIcon('ff8100');
  var highlightedIcon = makeMarkerIcon('FFFF24');

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










  // Parameters for knowledge graph API
  self.params = {
    'query': data.name,
    'limit': 1,
    'indent': true,
    'key' : 'AIzaSyBm1yQY89TOUlWsuCm4GhIov8XgWLcQQeM',
  };














  self.showInfoWindow = function() {
    if (!self.infoWindow.getContent()) {
      self.infoWindow.setContent('Loading content...');
      var content = '<div class="info-window-content"><div class="title"><h2>' + self.name + "</h2></div>";
      content += '<div class="accordion"><h2>View Details</h2><div class="' + self.class + '"></div>';
      content += '<h2>View Images</h2><div class="flickimages"></div></div>';
      self.infoWindow.setContent(content);
    }

    // Build the Flickr content for the info window, if hasn't been done
    if (!self.flickrContent) {
        // Use Flickr API to retrieve photos related to the location,
        // then display the data using a callback function
        flickr.getPhotos(self.name, function(results) {
            var content = '<div class="flickr-box">';
            content += '<h3 class="flickr-headline">Flickr Photos</h3>';
            results.forEach(function(info) {
                content += '<img src="' + info.imgThumbUrl + '"></a>';
            });
            content +='</div>';
            self.flickrContent = content;
            var allContent = self.infoWindow.getContent() + content;
            self.infoWindow.setContent(allContent);
        });
    }


    self.infoWindow.open(map, self.marker);

  }

  self.activate = function() {
    if (Landmark.prototype.active) {
      if (Landmark.prototype.active !== self) {
        Landmark.prototype.active.deactivate();
      }
    }

    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    self.showInfoWindow();

    // Limits bounce animation
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 3500);

    Landmark.prototype.active = self;
  };

  self.deactivate = function() {
    self.marker.setAnimation(null);
    self.infoWindow.close();

    Landmark.prototype.active = null;
  };

  self.focus = function() {
    map.panTo({lat: self.lat, lng: self.long});
    self.activate();
  };

  self.mapMarkerClickHandler = function() {
    if (Landmark.prototype.active === self) {
      self.deactivate();
    } else {
      self.activate();
    }
  };

  self.infoWindowCloseClickHandler = function() {
    self.deactivate();
  }

  self.marker.addListener('click', self.mapMarkerClickHandler);

  self.infoWindow.addListener('closeclick', self.infoWindowCloseClickHandler);














/*
  // Endpoint for Flickr API
  var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=3929dc66b4439e3261143f1187ad2031&text=';

  // Endpoint for knowledge graph API
  var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';

  // Parameters for knowledge graph API
  self.params = {
    'query': data.name,
    'limit': 1,
    'indent': true,
    'key' : 'AIzaSyBm1yQY89TOUlWsuCm4GhIov8XgWLcQQeM',
  };
*/


/* 
  // Adding click listeners on markers
 self.marker.addListener('click', function(){
    // Populates content string for infowindow
    self.infoString = '<div class="info-window-content"><div class="title"><h2>' + data.name + "</h2></div>" +
        '<div class="accordion"><h2>View Details</h2><div class="' + data.class + '"></div>' +
        '<h2>View Images</h2><div class="flickimages"></div></div>';

    // Gets image data from Flickr API and adds it to infowindow
    $.getJSON(flickrAPI + data.name + "&per_page=15&format=json&jsoncallback=?", function(response){
      $.each(response.photos.photo, function(i, element){
        src = "http://farm"+ element.farm +".static.flickr.com/"+ element.server +"/"+ element.id +"_"+ element.secret +"_m.jpg";
        $('<img class="img-thumbnail img-responsive">').attr("src", src).appendTo(".flickimages");
      });
    });

    // Gets image and description data from Google Knowledge Graph API
    $.getJSON(service_url + '?callback=?', self.params, function(response) {
      $.each(response.itemListElement, function(i, element) {
        $('<div>', {id:'thebody', text:element['result']['detailedDescription']['articleBody']}).appendTo('.' + data.class);
        $('.' + data.class).prepend($('<img>',{class:'img-thumbnail img-responsive center-block', id:'theimg',src:element['result']['image']['contentUrl']}));
      });
    });

    // Sets infowindow content 
    self.infoWindow.setContent(self.infoString);

    // Centers map on clicked marker
    map.panTo(self.marker.getPosition());

    // Attach the info window to a new marker
    self.infoWindow.open(map, self.marker);

    // Creates marker animation
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    
    // Limits bounce animation
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 3000);

    // Expand collapse jQuery function
    $( function() {
      $( ".accordion" ).accordion({
        collapsible: true,
        active: false
      });
    } );

  });
*/

  // Triggers marker when filterable list item is clicked
  self.animate = function() {
    google.maps.event.trigger(self.marker, 'click');
  };


}


//Landmark.prototype.active = null;



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
  ]


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