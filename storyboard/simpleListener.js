Listener = function() {};

Listener.prototype.storyboardNotValid = function(validityReport) {
	console.log(validityReport);
};

Listener.prototype.storyboardProcessingCompleted = function(storyboard) {
	console.log("Storyboard processing succesfully completed!");
	// Use storyboard.actor2SegmentsFunction to display each Actor's Segments
};