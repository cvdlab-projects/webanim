Actor = function() {};

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
};

Event.prototype.inDegree = function() {
	return this.ingoingSegments.length;
};

Event.prototype.outDegree = function() {
	return this.outgoingSegments.length;
};

Event.prototype.addIngoingSegment = function(segment) {
	this.ingoingSegments.push(segment);
};

Event.prototype.addOutgoingSegment = function(segment) {
	this.outgoingSegments.push(segment);
};

Segment = function() {};

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

Storyboard.prototype.getEventById = function(id) {
	var event;
	var found = false;

	for (var i = 0; i < this.events.length && !found; i++) {
		if (this.events[i].id === id) {
			found = true;
			event = this.events[i];
		};
	};

	return event;
};

Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
};

Storyboard.prototype.addSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.addOutgoingSegment(segment);
	to.addIngoingSegment(segment);

	this.segments.push(segment);
};

/*
 * Checks if the Events in the Storyboard have
 * correct degrees (in = 0 for source, out = 0
 * for sink, in != 0 and out != 0 for remaining
 * Events).
 * Returns an object with an 'error' property wich
 * is true iff there is at least an Event with
 * wrong degree, followed by
 * some other properties referring to the first
 * wrong Event found:
 *
 * - ingoing: true iff the ingoing degree is wrong
 * - outgoing: true iff the outgoing degree is wrong
 * - source: true iff the wrong Event is the source
 * - sink: true iff the wrong Event is the sink
 * - event: the Event with wrong degree
 *
 */
Storyboard.prototype.checkDegrees = function() {
	var result = { error: false };
	for (var i = 0; i < this.events.length && !result.error; i++) {
		var e = this.events[i];
		if (e === this.source) {
			if (e.inDegree() !== 0) {
				result.error = true;
				result.source = true;
			};
		} else if (e === this.sink) {
			if (e.outDegree() !== 0) {
				result.error = true;
				result.sink = true;
			};
		} else {
			if (e.inDegree() === 0) {
				result.error = true;
				result.ingoing = true;
				result.event = e;
			};
			if (e.outDegree() === 0) {
				result.error = true;
				result.outgoing = true;
				result.event = e;
			};
		};
	};
	return result;
};