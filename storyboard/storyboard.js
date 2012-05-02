/* Events. */

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
	this.tMin = Number.NEGATIVE_INFINITY;
	this.tMax = Number.POSITIVE_INFINITY;
};

Event.prototype.setId = function(id) {
	this.id = id;
};

Event.prototype.setDescription = function(desc) {
	this.desc = desc;
};

Event.prototype.addIngoingSegment = function(segment) {
	this.ingoingSegments.push(segment);
};

Event.prototype.addOutgoingSegment = function(segment) {
	this.outgoingSegments.push(segment);
};

Event.prototype.removeIngoingSegment = function(segment) {
	this.ingoingSegments = this.ingoingSegments.remove(segment);
};

Event.prototype.removeOutgoingSegment = function(segment) {
	this.outgoingSegments = this.outgoingSegments.remove(segment);
};

Event.prototype.zeroInDegree = function() {
	return this.ingoingSegments.length === 0;
};

Event.prototype.zeroOutDegree = function() {
	return this.outgoingSegments.length === 0;
}

Event.prototype.zeroDegree = function() {
	return this.zeroInDegree() && this.zeroInDegree();
};

Event.prototype.setTMin = function(t) {
	this.tMin = t;
};

Event.prototype.setTMax = function(t) {
	this.tMax = t;
};

/* Segments. */

Segment = function() {};

Segment.prototype.setId = function(id) {
	this.id = id;
};

Segment.prototype.setDescription = function(desc) {
	this.desc = desc;
};

Segment.prototype.setFrom = function(from) {
	this.from = from;
};

Segment.prototype.setTo = function(to) {
	this.to = to;
};

Segment.prototype.setDuration = function(duration) {
	this.duration = duration;
};

/* Storyboard. */

Storyboard = function() {
	this.events = [];
	this.segments = [];
};

Storyboard.prototype.setSource = function(event) {
	this.source = event;
};

Storyboard.prototype.setSink = function(event) {
	this.sink = event;
};

Storyboard.prototype.newEvent = function(id) {
	return function(desc) {
		var event = new Event();

		event.setId(id);
		event.setDescription(desc);

		return event;
	};
};

Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
};

Storyboard.prototype.getEvent = function(id) {
	return this.events.findById(id);
};

Storyboard.prototype.removeEvent = function(event) {
	this.events = this.events.remove(event);
};

Storyboard.prototype.newSegment = function(id) {
	return function(desc) {
		var newSegment = new Segment();

		newSegment.setId(id);
		newSegment.setDescription(desc);

		return newSegment;
	};
};

Storyboard.prototype.addSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.addOutgoingSegment(segment);
	to.addIngoingSegment(segment);

	this.segments.push(segment);
};

Storyboard.prototype.getSegment = function(id) {
	return this.segments.findById(id);
};

Storyboard.prototype.removeSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.removeOutgoingSegment(segment);
	to.removeIngoingSegment(segment);

	this.segments = this.segments.remove(segment);
};

Storyboard.prototype.changeFrom = function(segment) {
	return function(event) {
		var oldFrom = segment.from;
		oldFrom.removeOutgoingSegment(segment);

		event.addOutgoingSegment(segment);
		segment.from = event;
	};
};

Storyboard.prototype.changeTo = function(segment) {
	return function(event) {
		var oldTo = segment.to;
		oldTo.removeIngoingSegment(segment);

		event.addIngoingSegment(segment);
		segment.to = event;
	};
};

Storyboard.prototype.isValid = function() {

	// to do

	// Note: a Storyboard is valid iff:
	//  - source has zero in-degree
	//  - sink has zero out-degree
	//  - all other nodes have non-zero degree
	//  - there are no oriented cycles (non-oriented cycles are allowed)
	//  - every event is reachable from the source
	//  - other conditions?

	return true;
};

Storyboard.prototype.executeCPM = function() {
	// Forward
	this.source.setTMin(0);
	var eventsToVisit = [ this.source ];

	while (eventsToVisit.length !== 0) {
		var event = eventsToVisit.pop();
		var outgoingSegments = event.outgoingSegments;

		outgoingSegments.forEach(function(segment) {
			var newTMin = event.tMin + segment.duration;
			var oldTMin = segment.to.tMin;

			segment.to.setTMin(Math.max(newTMin, oldTMin));

			eventsToVisit.push(segment.to);
		});
	};

	// Backward
	this.sink.setTMax(this.sink.tMin);
	var eventsToVisit = [ this.sink ];

	while (eventsToVisit.length !== 0) {
		var event = eventsToVisit.pop();
		var ingoingSegments = event.ingoingSegments;

		ingoingSegments.forEach(function(segment) {
			var newTMax = event.tMax - segment.duration;
			var oldTMax = segment.from.tMax;

			segment.from.setTMax(Math.min(newTMax, oldTMax));

			eventsToVisit.push(segment.from);
		});
	};
};

Storyboard.prototype.setStartTimeForEvents = function() {

	// to do
	
};

Storyboard.prototype.computeActor2SegmentsFunction = function() {

	// to do
	
};