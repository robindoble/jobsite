$(document).ready(function(){
	// window.map works like var, but changes scope of following object to whole window, so you can access it from tests
	var map = new GMaps({
		div: '#map',
		lat: 51.523126,
		lng: -0.087019,
		zoom: 14,	
		zoomControl: true,
		zoomControlOpt: {
			style: 'MEDIUM',
			position: 'LEFT_BOTTOM'
		},
		panControl: false,
		mapTypeControl: false,
		streetViewControl: false,

		styles: [
		{
			stylers: [
			{ hue: "#00ff6f" },
			{ saturation: -50 }
			]
		}, {
			featureType: "road",
			elementType: "geometry",
			stylers: [
			{ lightness: 100 },
			{ visibility: "simplified" }
			]
		}, {
			featureType: "transit",
			elementType: "geometry",
			stylers: [
			{ hue: "#ff6600" },
			{ saturation: +80 }
			]
		}, {
			featureType: "transit",
			elementType: "labels",
			stylers: [
			{ hue: "#ff0066" },
			{ saturation: +80 }
			]
		}, {
			featureType: "poi",
			elementType: "labels",
			stylers: [
			{ visibility: "off" }
			]
		}, {
			featureType: "poi.park",
			elementType: "labels",
			stylers: [
			{ visibility: "on" }
			]
		}, {
			featureType: "water",
			elementType: "geometry",
			stylers: [
			{ hue: "#c4f4f4" }
			]
		}, {
			featureType: "road",
			elementType: "labels",
			stylers: [
			{ visibility: "off" }
			]
		}
		]
	});
	
	console.log("hello")
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(51.2901, -0.5651),
		new google.maps.LatLng(51.6167, 0.2463)
		);

	var input = document.getElementById('searchTextField');

	var search_options = {
		bounds: defaultBounds,
		types: ['establishment']
	};

	autocomplete = new google.maps.places.Autocomplete(input, search_options);

	var zoom_options = { minZoom: 10, maxZoom: 17};

	map.setOptions(zoom_options);

	$('#search_box').on('submit', function(event) {
		event.preventDefault();
		GMaps.geocode({
			address: $('#searchTextField').val(),
			callback: function(results, status) {
				if (status == 'OK') {
					var latlng = results[0].geometry.location;
					map.setCenter(latlng.lat(), latlng.lng());
				} 
			}
		});
	});

	$.get("/jobs.json", function(jobs) {
		var markers = [];
		console.log(jobs.length);
		jobs.forEach(function(job) {
			category = job.category;
			var marker = map.addMarker({
				lat: job.latitude,
				lng: job.longitude,
				title: job.advert_title,
				category: job.category,
				icon: "https://dl.dropboxusercontent.com/u/9315601/" + category + ".png",
				infoWindow: { content: job.category }
			});
			markers.push(marker);
			// map.clearOverlays();
		});
	});

	$('#filter_form').on('submit', function(event){
		event.preventDefault();
		$.get('/jobs.json', $(this).serialize(), function(jobs){
			// console.log(jobs.length);
			// console.log(map);
			map.removeMarkers();
				jobs.forEach(function(job) {
					category = job.category;	
					var marker = map.addMarker({
						lat: job.latitude,
						lng: job.longitude,
						title: job.advert_title,
						category: job.category,
						icon: "https://dl.dropboxusercontent.com/u/9315601/" + category + ".png",
						infoWindow: { content: job.category }
					});
				});


					// console.log(jobs);
					$('.advert_column').empty();
					jobs.forEach(function(job) {
						// console.log(job);
						var template = $('#individual_job_advert').html();
						// console.log(template);
						var newAdvert = Mustache.render(template,job);
						// console.log(newAdvert);
						$('.advert_column').append(newAdvert);
						// $('.advert_column').append(
						// 	'<ul>
						// 		<div class="advert_info">
						// 			<h1><%= job.advert_title %></h1>
						// 			<p><%= job.category %> // 
						// 				<%= job.company %> //
						// 				<%= job.detail %> //
						// 				<%= job.address %> //
						// 				£<%= job.wage %> per hour //
						// 				<%= job.email %> //
						// 				<%= job.phone %>
						// 			</p>
						// 		</div>
						// 	</ul>')
					// });
				});

		});
});
});
