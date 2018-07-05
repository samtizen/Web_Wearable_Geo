/*
 * File: main.geo-app.js
 * Project: GeoLocationGearApp
 * File Created: Sunday, 1st July 2018 11:05:25 pm
 * Author: Sergei Papulin
 * -----
 * Last Modified: Thursday, 5th July 2018 3:07:42 pm
 * Modified By: Sergei Papulin
 * -----
 * Copyright 2018 Sergei Papulin
 */

(function($) {
	
	var geoAppMain = {},
		watchId = null,
		startPosition = null,
		boolStart = false,
		$displayDistanceElement = null,
		$btnTrackerAction = null,
		$infoElement = null,
		$infoPopupElement = null;
	
	var defaults = {
		timeout: 5000,
		maximumAge: 0,
		enableHighAccuracy: true,
	};
	
	var settings = null;
	
	// ==================================
	// INITIALIZATION
	// ==================================
	geoAppMain.init = function(options) {
		
		// Apply settings
		settings = $.extend({}, defaults, options);
		
		// Assign element variables
		$btnTrackerAction = $("#btn-tracker-action"),
		$infoElement = $("#info-container-id"),
		$infoPopupElement = $("#info-popup-id");

		// Set an initial state
		setStopStateTracker();

		// UI Events
		$btnTrackerAction.click(function() {
			if (boolStart === false) setLoadingStateTracker();
			else setStopStateTracker();
		});

	};

	// ==================================
	// STATE
	// ==================================
	// Loading State
	function setLoadingStateTracker() {
		renderLoadingStateContent();
		startGeoLocationWatcher();
		boolStart = true;
	}
	// Stop State
	function setStopStateTracker() {
		renderStopTrackerContent();
		if (watchId != null) stopGeoLocationWatcher();
		boolStart = false;
	}
	// Start State
	function setStartStateTracker() {
		renderStartTrackerContent();
		boolStart = true;
	}

	// ==================================
	// Methods
	// ==================================
	// Start a position watcher
	function startGeoLocationWatcher() {
		
	    if (navigator.geolocation) {
	    	
	    	var options = {
	    		timeout: settings.timeout,
	    		maximumAge: settings.maximumAge,
	    		enableHighAccuracy: settings.enableHighAccuracy,
	    	};
	    	
	        watchId = navigator.geolocation.watchPosition(onSuccessCallback, onErrorCallback, options);
	        
	        function onSuccessCallback(position) {
	        	
	        	console.log(position);
	        	
	        	if (startPosition === null) {
					startPosition = position;
					
					// Set the Start State
					setStartStateTracker();
				}
	        	
	        	var distance = geolib.getDistance(startPosition.coords, position.coords);
				
				console.log("distance: " + distance);

				// Render information on the watch screen
				renderCurrentInfoContent(startPosition, position, distance)
	        	
	        }
	        
	        function onErrorCallback(error) {

				console.log(error);

				var message = "An unknown error occurred.";

	        	switch (error.code) {
					case error.PERMISSION_DENIED:
						message = "User denied the request for Geolocation.";
						break;
					case error.POSITION_UNAVAILABLE:
						message = "Location information is unavailable.";
						break;
					case error.TIMEOUT:
						message = "The request to get user location timed out.";
						break;
					case error.UNKNOWN_ERROR:
						message = "An unknown error occurred.";
						break;
				}

				renderInfoPopupText(message);
				setStopStateTracker();
	        }
	        
	    } else {
			renderInfoPopupText("Geolocation is not supported.");
			setStopStateTracker();
	    }
		
	}
	// Stop a position watcher
	function stopGeoLocationWatcher() {
		navigator.geolocation.clearWatch(watchId);
		watchId = null;
		startPosition = null;
	}

	// ==================================
	// RENDER
	// ==================================
	function renderLoadingStateContent() {
		$infoElement.html('<p>Loading...</p>');
		$btnTrackerAction.hide();
	}
	function renderStartTrackerContent() {
		$infoElement.html('<p id="txt-loc-id"></p>');
		$btnTrackerAction.text("STOP").show();
	}
	function renderStopTrackerContent() {
		$infoElement.html('<p>Click the Start Button to launch the tracker</p>');
		$btnTrackerAction.text("START").show();
	}
	function renderCurrentInfoContent(initialPosition, currentPosition, distance) {
		$infoElement.find("#txt-loc-id").text(distance + " m");
	}
	function renderInfoPopupText(message) {
		$infoPopupElement.find(".ui-popup-content").text(message);
		tau.openPopup($infoPopupElement);
		
	}
	
	return geoAppMain;
	
})(jQuery).init({timeout: 15000});
