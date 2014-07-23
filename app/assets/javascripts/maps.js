$(document).ready(function(){

	var map = new GMaps({
		div: '#map',
		lat: 51.523126,
		lng: -0.087019,
		zoom: 13
	});

	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(51.2901, -0.5651),
		new google.maps.LatLng(51.6167, 0.2463));

	var input = document.getElementById('searchTextField');

	var search_options = {
		bounds: defaultBounds,
		types: ['establishment']
	};

	var zoom_options = { minZoom: 10, maxZoom: 17};

	map.setOptions(zoom_options);

	autocomplete = new google.maps.places.Autocomplete(input, search_options);

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
	})

	$.get("/jobs.json", function(jobs) {
		jobs.forEach(function(job) {
			var category = job.category;
			map.addMarker({
				lat: job.latitude,
				lng: job.longitude,
				title: job.advert_title,
				icon: "https://dl.dropboxusercontent.com/u/9315601/" + category + ".png",
				infoWindow: {
					content: job.advert_title
				} 
			});


		});
	});

})