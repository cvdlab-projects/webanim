Actor = function() {};

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
};

Segment = function() {};

Storyboard = function() {
	this.events = [];
	this.segments = [];
};

Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
};