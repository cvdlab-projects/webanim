Event = function() {
	this.incomingSegments = [];
	this.outgoingSegments = [];
	this.marked = false;
};

Event.prototype.inDegree = function() {
	return this.incomingSegments.length;
};

Event.prototype.outDegree = function() {
	return this.outgoingSegments.length;
};

Event.prototype.addIncomingSegment = function(segment) {
	this.incomingSegments.push(segment);
};

Event.prototype.addOutgoingSegment = function(segment) {
	this.outgoingSegments.push(segment);
};

Event.prototype.removeIncomingSegment = function(segment) {
	var i = this.incomingSegments.indexOf(segment);
	this.incomingSegments.splice(i,1);
};

Event.prototype.removeOutgoingSegment = function(segment) {
	var i = this.outgoingSegments.indexOf(segment);
	this.outgoingSegments.splice(i,1);
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

Storyboard.prototype.getSegmentById = function(id) {
	var segment;
	var found = false;

	for (var i = 0; i < this.segments.length && !found; i++) {
		if (this.segments[i].id === id) {
			found = true;
			segment = this.segments[i];
		};
	};

	return segment;
};

Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
	this.topologicallySorted = false;
};

Storyboard.prototype.addSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.addOutgoingSegment(segment);
	to.addIncomingSegment(segment);

	this.segments.push(segment);
	this.topologicallySorted = false;
};

/*
 * Removing an Event causes the removal of related
 * Segments too.
 */
Storyboard.prototype.removeEvent = function(event) {
	// Remove all related Segments
	var segmentsToRemove = this.segments.filter(function(segment) {
		return segment.from === event || segment.to === event;
	});
	for (var i = 0; i < segmentsToRemove.length; i++) {
		this.removeSegment(segmentsToRemove[i]);
	};
	
	// Remove the Event
	var i = this.events.indexOf(event);
	this.events.splice(i,1);

	this.topologicallySorted = false;
};

Storyboard.prototype.removeSegment = function(segment) {
	// Update related Events
	segment.from.removeOutgoingSegment(segment);
	segment.to.removeIncomingSegment(segment);

	// Remove the Segment
	var i = this.segments.indexOf(segment);
	this.segments.splice(i,1);

	this.topologicallySorted = false;
};

/*
 * Returns true iff the Events in the Storyboard have
 * correct degrees (in = 0 for source, out = 0
 * for sink, in != 0 and out != 0 for remaining
 * Events).
 *
 * It also fills the property 'validityReport',
 * wich is an object with the following
 * properties referring to the first
 * wrong Event found:
 *
 * - incoming: true iff the incoming degree is wrong
 * - outgoing: true iff the outgoing degree is wrong
 * - source: true iff the wrong Event is the source
 * - sink: true iff the wrong Event is the sink
 * - event: the Event with wrong degree
 *
 */
Storyboard.prototype.hasCorrectDegrees = function() {
	var correct = true;
	for (var i = 0; i < this.events.length && correct; i++) {
		var e = this.events[i];
		if (e === this.source) {
			if (e.inDegree() !== 0) {
				this.validityReport.degrees.error = true;
				this.validityReport.degrees.source = true;
				correct = false;
			};
		} else if (e === this.sink) {
			if (e.outDegree() !== 0) {
				this.validityReport.degrees.error = true;
				this.validityReport.degrees.sink = true;
				correct = false;
			};
		} else {
			if (e.inDegree() === 0) {
				this.validityReport.degrees.error = true;
				this.validityReport.degrees.incoming = true;
				this.validityReport.degrees.event = e;
				correct = false;
			};
			if (e.outDegree() === 0) {
				this.validityReport.degrees.error = true;
				this.validityReport.degrees.outgoing = true;
				this.validityReport.degrees.event = e;
				correct = false;
			};
		};
	};
	return correct;
};

/*
 * For simplicity and / or performances, some
 * graph algorithms mark nodes instead of
 * copy or delete. This function removes these
 * marks, thus it is called by each function
 * that uses marks.
 */
Storyboard.prototype.resetMarks = function() {
	this.events.forEach(function(event) {
		if (event.marked) event.marked = false;
	});
};

/*
 * All Events must be reachable from source Event.
 * This can be checked by using any non-cycling
 * algorithm for graph visit and by marking visited
 * Events: the Storyboard is valid iff every Event
 * is marked.
 */
Storyboard.prototype.hasAllEventsReachable = function() {
	// Graph visit for marking Events
	this.resetMarks();
	var eventsToVisit = [ this.source ];
	while (eventsToVisit.length !== 0) {
		var next = eventsToVisit.pop();
		if (!next.marked) {
			next.marked = true;
			next.outgoingSegments.forEach(function(segment) {
				if (!segment.to.marked) {
					eventsToVisit.push(segment.to);
				};
			});
		};
	};

	// Search for non-marked Events
	var nonMarked = false;
	for (var i = 0; i < this.events.length && !nonMarked; i++) {
		if (!this.events[i].marked) nonMarked = true;
	};

	// Filling validity report
	if (this.validityReport === undefined) {
		this.validityReport = {};
		this.validityReport.reachability = false;
	};
	if (nonMarked) {
		this.validityReport.reachability = true;
	};

	// Finally, return check result
	return !nonMarked;
};

Storyboard.prototype.resetTopologicOrder = function() {
	this.topologicallySorted = false;
	this.events.forEach(function(event) {
		if (event.topologicalOrder !== undefined) {
			event.topologicalOrder = undefined;
		};
	});
}

/*
 * Kahn's algorithm for topological sorting.
 * It is also suitable for detecting cycles.
 */
Storyboard.prototype.hasCycles = function() {
	// Resetting...
	this.resetMarks();
	this.resetTopologicOrder();

	// Kahn's algorithm
	var S = [ this.source ];
	var k = 0;
	while (S.length != 0) {
		// Remove an Event from S
		var event = S.pop();
		// Number the chosen Event
		event.topologicalOrder = k;
		k++;

		// For each outgoing Segment ...
		event.outgoingSegments.forEach(
			function(segment) {
				// ... mark it
				segment.marked = true;

				// ... push its TO Event into S iff it has no marked incoming Segments
				var to = segment.to;
				var incomings = to.incomingSegments;
				var found = false;
				for (var i = 0; i < incomings.length && !found; i++) {
					if (!incomings[i].marked) found = true;
				};
				if (!found) S.push(to);
			}
		);
	};

	// Search for non-marked Segments
	var found = false;
	for (var i = 0; i < this.segments.length && !found; i++) {
		if (!this.segments[i].marked) found = true;
	};

	// Iff there are non-marked Segments, the Storyboard contains cycles
	if (found) {
		this.validityReport.cycles = true;
		return true;
	} else {
		this.events.sort(function(e1, e2) {
			return e1.topologicalOrder - e2.topologicalOrder;
		});
		this.topologicallySorted = true;
		return false;
	};
};

Storyboard.prototype.resetValidityReport = function() {
	this.validityReport = {};
	this.validityReport.degrees = {};
};

/*
 * Performs a full validation of the Storyboard.
 */
Storyboard.prototype.isValid = function() {
	this.resetValidityReport();

	if (this.hasCorrectDegrees()) {
		if (this.hasAllEventsReachable()) {
			if (!this.hasCycles()) return true;
		};
	};

	return false;
};

/*
 * Necessary for CPM.
 */
Storyboard.prototype.topologicalSort = function() {
	if (!this.topologicallySorted) {
		// Cycles detection also provides
		// topological sorting
		this.hasCycles();
	};
};

/*
 * Necessary to clean data before Storyboard processing.
 */
Storyboard.prototype.resetTimes = function() {
	this.events.forEach(function(event) {
		event.tMin = Number.NEGATIVE_INFINITY;
		event.tMax = Number.POSITIVE_INFINITY;
	});
	this.segments.forEach(function(segment) {
		segment.tStart = undefined;
	});
};

/*
 * Critical Path Method.
 */
Storyboard.prototype.executeCPM = function() {
	this.topologicalSort();
	this.resetTimes();

	// Forward
	this.events[0].tMin = 0;
	for (var i = 1; i < this.events.length; i++) {
		var segments = this.events[i].incomingSegments;
		for (var j = 0; j < segments.length; j++) {
			var from = segments[j].from;
			var duration = segments[j].duration;
			this.events[i].tMin = Math.max(this.events[i].tMin, from.tMin + duration);
		};
	};

	// Backward
	var last = this.events.length - 1;
	this.events[last].tMax = this.events[last].tMin;
	for (var i = last - 1; i >= 0; i--) {
		var segments = this.events[i].outgoingSegments;
		for (var j = 0; j < segments.length; j++) {
			var to = segments[j].to;
			var duration = segments[j].duration;
			this.events[i].tMax = Math.min(this.events[i].tMax, to.tMax - duration);
		};
	};
};

Storyboard.prototype.setStartTimeForSegments = function() {
	this.segments.forEach(function(segment) {
		var from = segment.from;
		segment.tStart = (from.tMax + from.tMin) / 2 ;
	});
};


Storyboard.prototype.actor2Segments = function(actor) {
	return this.segments.filter(function(segment) {
			return segment.actor === actor;
		});
};