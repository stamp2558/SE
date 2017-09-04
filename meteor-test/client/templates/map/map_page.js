Meteor.startup(function() {
  GoogleMaps.load({ v: '3', key: 'AIzaSyDzgiOABUWqCUWLMX6bXkRnPn-K6jqfua0', libraries: 'geometry,places' });
});

Template.mapPage.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(13.1641, 100.9217),
        zoom: 12,
        // styles: [
        //     {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        //     {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        //     {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        //     {
        //       featureType: 'administrative.locality',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#d59563'}]
        //     },
        //     {
        //       featureType: 'poi',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#d59563'}]
        //     },
        //     {
        //       featureType: 'poi.park',
        //       elementType: 'geometry',
        //       stylers: [{color: '#263c3f'}]
        //     },
        //     {
        //       featureType: 'poi.park',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#6b9a76'}]
        //     },
        //     {
        //       featureType: 'road',
        //       elementType: 'geometry',
        //       stylers: [{color: '#38414e'}]
        //     },
        //     {
        //       featureType: 'road',
        //       elementType: 'geometry.stroke',
        //       stylers: [{color: '#212a37'}]
        //     },
        //     {
        //       featureType: 'road',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#9ca5b3'}]
        //     },
        //     {
        //       featureType: 'road.highway',
        //       elementType: 'geometry',
        //       stylers: [{color: '#746855'}]
        //     },
        //     {
        //       featureType: 'road.highway',
        //       elementType: 'geometry.stroke',
        //       stylers: [{color: '#1f2835'}]
        //     },
        //     {
        //       featureType: 'road.highway',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#f3d19c'}]
        //     },
        //     {
        //       featureType: 'transit',
        //       elementType: 'geometry',
        //       stylers: [{color: '#2f3948'}]
        //     },
        //     {
        //       featureType: 'transit.station',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#d59563'}]
        //     },
        //     {
        //       featureType: 'water',
        //       elementType: 'geometry',
        //       stylers: [{color: '#17263c'}]
        //     },
        //     {
        //       featureType: 'water',
        //       elementType: 'labels.text.fill',
        //       stylers: [{color: '#515c6d'}]
        //     },
        //     {
        //       featureType: 'water',
        //       elementType: 'labels.text.stroke',
        //       stylers: [{color: '#17263c'}]
        //     }
        //   ]

      };
    }
  }
});

Meteor.subscribe('markers');

Template.mapPage.onCreated(function() {

  // We can use the `ready` callback to interact with the map API once the map is ready.
	GoogleMaps.ready('mapEx', function(map) {
	    // Add a marker to the map once it's ready
	    // var marker1 = new google.maps.Marker({
	    //   position: map.options.center,
	    //   map: map.instance
      // );

      //  google.maps.event.addListener(map.instance, 'click', function(event) {
      //   var point = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      //   Meteor.call('markInsert',point);
      //   // Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      // });

       console.log(document.getElementById('info-content'));

        var markers = {};
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow({
          content: document.getElementById('info-content')
        });
        var service = new google.maps.places.PlacesService(map.instance);
        var hostnameRegexp = new RegExp('^https?://.+?/');

        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        var image2 = '/hospital-icon.png';
        var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        directionsDisplay.setMap(map.instance);


        Markers.find().observe({
          added: function(document) {

            var latlng = new google.maps.LatLng(document.lat, document.lng);

            geocoder.geocode({'location': latlng}, function(results, status) {
              if (status === 'OK') {
                if (results[0]) {
                  map.instance.setZoom(15);
                  var marker = new google.maps.Marker({
                    // draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: latlng,
                    map: map.instance
                  });

                  // infowindow.setContent(results[0].formatted_address);
                  infowindow.open(map.instance, marker);
                  buildIWContent(results[0]);

                  google.maps.event.addListener(marker, 'click', function(event) {
                    // infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map.instance, marker);
                    buildIWContent(results[0]);
                  });

                  // Store this marker instance within the markers object.
                  markers[document._id] = marker;
                  map.instance.setCenter(latlng);

                } else {
                  window.alert('No results found');
                }
              } else {
                window.alert('Geocoder failed due to: ' + status);
              }
            });

            service.nearbySearch({
                location: latlng,
                radius: 1000,
                type: ['hospital'],
              }, function(results, status){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  for (var i = 0; i < results.length; i++) {
                    createMarker(results[i],i);
                  }
                }
              }
            );

            // // Create a marker for this document
            // var marker = new google.maps.Marker({
            //   draggable: true,
            //   animation: google.maps.Animation.DROP,
            //   position: new google.maps.LatLng(document.lat, document.lng),
            //   map: map.instance,
            //   // icon: '/map-marker-icon.png',
            //   // We store the document _id on the marker in order
            //   // to update the document within the 'dragend' event below.
            //   id: document._id
            // });
            // var infowindow = new google.maps.InfoWindow({
            //   content: "Hello World"
            // });

            // This listener lets us drag markers on the map and update their corresponding document.
            // google.maps.event.addListener(marker, 'dragend', function(event) {
            //   Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
            // });
            // google.maps.event.addListener(marker, 'click', function(event) {
            //   infowindow.open(map.instance, marker);
            // });


            // Store this marker instance within the markers object.
            // markers[document._id] = marker;
            // infowindow.open(map, marker);
            // map.instance.setCenter(new google.maps.LatLng(document.lat, document.lng));
          },
          changed: function(newDocument, oldDocument) {
            markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
          },
          removed: function(oldDocument) {
            // Remove the marker from the map
            markers[oldDocument._id].setMap(null);

            // Clear the event listener
            google.maps.event.clearInstanceListeners(
              markers[oldDocument._id]);

            // Remove the reference to this marker instance
            delete markers[oldDocument._id];
          }
        });


        function createMarker(place,j) {
          var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (j % 26));
          var markerIcon = MARKER_PATH + markerLetter + '.png';

          var placeLoc = place.geometry.location;

          var m = new google.maps.Marker({
            map: map.instance,
            position: placeLoc,
            animation: google.maps.Animation.DROP,
            icon: markerIcon,
          });

          addResult(place,j,m);

          // console.log(place)

          // google.maps.event.addListener(m, 'click', showInfoWindow(place));
          google.maps.event.addListener(m, 'click', function(event) {
            // console.log(place)
            // infowindow.setContent(place.name);
            infowindow.open(map.instance, this);
            buildIWContent(place);
          });
        }

        function buildIWContent(place) {
          // console.log(place);
          if(place.icon){
            document.getElementById('iw-icon').style.display = '';
            document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
                'src="' + place.icon + '"/>';
          } else{
            document.getElementById('iw-icon').style.display = 'none';
          }

          if(place.name){
            document.getElementById('iw-url').style.display = '';
            document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
                '">' + place.name + '</a></b>';
          } else{
            document.getElementById('iw-url').style.display = 'none';
          }

          if(place.vicinity){
            document.getElementById('iw-address').style.display = '';
            document.getElementById('iw-address').textContent = place.vicinity;
          } else if(place.formatted_address){
            document.getElementById('iw-address').style.display = '';
            document.getElementById('iw-address').textContent = place.formatted_address;
          } else{
            document.getElementById('iw-address').style.display = 'none';
          }


          if (place.formatted_phone_number) {
            document.getElementById('iw-phone-row').style.display = '';
            document.getElementById('iw-phone').textContent =
                place.formatted_phone_number;
          } else {
            document.getElementById('iw-phone-row').style.display = 'none';
          }

          // Assign a five-star rating to the hotel, using a black star ('&#10029;')
          // to indicate the rating the hotel has earned, and a white star ('&#10025;')
          // for the rating points not achieved.
          if (place.rating) {
            var ratingHtml = '';
            for (var i = 0; i < 5; i++) {
              if (place.rating < (i + 0.5)) {
                ratingHtml += '&#10025;';
              } else {
                ratingHtml += '&#10029;';
              }
            document.getElementById('iw-rating-row').style.display = '';
            document.getElementById('iw-rating').innerHTML = ratingHtml;
            }
          } else {
            document.getElementById('iw-rating-row').style.display = 'none';
          }

          // The regexp isolates the first part of the URL (domain plus subdomain)
          // to give a short URL for displaying in the info window.
          if (place.website) {
            var fullUrl = place.website;
            var website = hostnameRegexp.exec(place.website);
            if (website === null) {
              website = 'http://' + place.website + '/';
              fullUrl = website;
            }
            document.getElementById('iw-website-row').style.display = '';
            document.getElementById('iw-website').textContent = website;
          } else {
            document.getElementById('iw-website-row').style.display = 'none';
          }
        }

        function addResult(result, i,m) {
         var results = document.getElementById('results');
         var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
         var markerIcon = MARKER_PATH + markerLetter + '.png';

         var tr = document.createElement('tr');
         tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
         tr.onclick = function() {
           google.maps.event.trigger(m, 'click');
         };

         var iconTd = document.createElement('td');
         var nameTd = document.createElement('td');
         var icon = document.createElement('img');
         icon.src = markerIcon;
         icon.setAttribute('class', 'placeIcon');
         icon.setAttribute('className', 'placeIcon');
         var name = document.createTextNode(result.name);
         iconTd.appendChild(icon);
         nameTd.appendChild(name);
         tr.appendChild(iconTd);
         tr.appendChild(nameTd);
         results.appendChild(tr);
       }




	});
});
