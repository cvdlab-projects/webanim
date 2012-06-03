/**
 *	@class Represents an object of type Event, a node of the storyboard graph
*/
Event = function() {
	/**
	 *	Array of incoming segments
	 *	@type Segment[]
	 */
	this.incomingSegments = [];
	/**
	 *	Array of outgoing segments
	 *	@type Segment[]
	 */
	this.outgoingSegments = [];
	/**
	 *	Boolean to check if a node has been visited
	 *	@type Boolean
	 */
	this.marked = false;
};

/**
 *	Returns the indegree value of the event
 *	@return {number} The indegree value
 */
Event.prototype.inDegree = function() {
	return this.incomingSegments.length;
};

/**
 *	Returns the outdegree value of the event
 *	@return {number} The outdegree value
 */
Event.prototype.outDegree = function() {
	return this.outgoingSegments.length;
};

/**
 *	Adds a segment to the incoming segments of the event
 *	@param {Segment} segment The segment to add
 */
Event.prototype.addIncomingSegment = function(segment) {
	this.incomingSegments.push(segment);
};

/**
 *	Adds a segment to the outgoing segments of the event
 *	@param {Segment} segment The segment to add
 */
Event.prototype.addOutgoingSegment = function(segment) {
	this.outgoingSegments.push(segment);
};

/**
 *	Removes a segment from the incoming segments of the event
 *	@param {Segment} segment The segment to remove
 */
Event.prototype.removeIncomingSegment = function(segment) {
	var i = this.incomingSegments.indexOf(segment);
	this.incomingSegments.splice(i,1);
};

/**
 *	Removes a segment from the outgoing segments of the event
 *	@param {Segment} segment The segment to remove
 */
Event.prototype.removeOutgoingSegment = function(segment) {
	var i = this.outgoingSegments.indexOf(segment);
	this.outgoingSegments.splice(i,1);
};

/**
 *	@class Represents an object of type Segment, an edge of the storyboard graph
*/
Segment = function() {};


/**
 *	@class Represents an object of type Actor
*/
Actor = function() {};

/**
 *	@class Represents an object of type Storyboard, a graph
*/
Storyboard = function() {

	/**
	 *	Array of events composing the storyboard graph
	 *	@type Event[]
	 */
	this.events = [];
	/**
	 *	Array of segments composing the storyboard graph
	 *	@type Segment[]
	 */
	this.segments = [];

  this.actors = 0;
};

/**
 *	Sets an event as the source of the storyboard graph
 *	@param {Event} event The event to set as source
 */
Storyboard.prototype.setSource = function(event) {
	this.source = event;
};

/**
 *	Sets an event as the sink of the storyboard graph
 *	@param {Event} event The event to set as sink
 */
Storyboard.prototype.setSink = function(event) {
	this.sink = event;
};

/**
 *	Returns an event of the storyboard graph with the specified id
 *	@param {number} id The id of the event to return
 */
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

/**
 *	Returns a segment of the storyboard graph with the specified id
 *	@param {number} id The id of the segment to return
 */
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

/**
 *	Adds an event to the storyboard graph
 *	@param {Event} event The event to add to the storyboard graph
 */
Storyboard.prototype.addEvent = function(event) {
	this.events.push(event);
	this.topologicallySorted = false;
};

/**
 *	Adds a segment to the storyboard graph
 *	@param {Segment} segment The segment to add to the storyboard graph
 */
Storyboard.prototype.addSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.addOutgoingSegment(segment);
	to.addIncomingSegment(segment);

	this.segments.push(segment);
	this.topologicallySorted = false;
};

/**
 *	Removes an event from the storyboard graph, causing all the related segments to be removed too
 *	@param {Event} event The event to remove from the storyboard graph
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

/**
 *	Removes a segment from the storyboard graph, updating all the related events
 *	@param {Segment} segment The segment to remove from the storyboard graph
 */
Storyboard.prototype.removeSegment = function(segment) {
	// Update related Events
	segment.from.removeOutgoingSegment(segment);
	segment.to.removeIncomingSegment(segment);

	// Remove the Segment
	var i = this.segments.indexOf(segment);
	this.segments.splice(i,1);

	this.topologicallySorted = false;
};

/**
 * Returns true if and only if the events in the Storyboard have
 * correct degrees (indegree = 0 for source, outdegree = 0
 * for sink, indegree != 0 and outdegree != 0 for remaining
 * events).
 *
 * It also fills in the 'validityReport' property when it encounters an event
 * which doesn't follow the rule mentioned before. Its properties are:
 *
 * - incoming: true if and only if the value of the indegree of an event other than the source is 0.
 * - outgoing: true if and only if the value of the outdegree of an event other than the sink is 0.
 * - source: true iff the indegree of the source event is different from 0.
 * - sink: true iff the outdregree of the sink event is different from 0.
 * - event: the event with wrong degree value.
 *
 * @return {Boolean} Checks if all the events of the storyobard have correct degrees 
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

/**
 * For simplicity and/or performances, some
 * graph algorithms mark nodes instead of
 * copying and deleting them. This function removes these
 * marks, thus it is called by each function that needs to use them.
 */
Storyboard.prototype.resetMarks = function() {
	this.events.forEach(function(event) {
		if (event.marked) event.marked = false;
	});
};

/**
 * All events must be reachable from source event.
 * This can be checked by using any non-cycling
 * algorithm for graph visit and marking visited
 * events: the storyboard is valid if and only if every event
 * is marked.
 *
 * @return {Boolean} Checks if all the events of the storyboard are reachable from the source
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

/**
 * Resets the topological order of the events of the storyboard
 */
Storyboard.prototype.resetTopologicOrder = function() {
	this.topologicallySorted = false;
	this.events.forEach(function(event) {
		if (event.topologicalOrder !== undefined) {
			event.topologicalOrder = undefined;
		};
	});
}

/**
 * Kahn's algorithm for topological sorting.
 * It is also suitable for detecting cycles.
 * @return {Boolean} Checks if the storyboard graph contains cycles.
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

/**
 * Resets the 'validityReport' property of the storyboard.
 */
Storyboard.prototype.resetValidityReport = function() {
	this.validityReport = {};
	this.validityReport.degrees = {};
};

/**
 * Performs a full validation of the Storyboard.
 * @return {Boolean} Checks if the storyboard graph is valid.
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

/**
 * Detects cycles and provides topological sorting. It's necessary to the Critical Path Method.
 * @return {Boolean} Checks if the topologically sorted storyboard graph contains cycles.
 */
Storyboard.prototype.topologicalSort = function() {
	if (!this.topologicallySorted) {
		// Cycles detection also provides
		// topological sorting
		this.hasCycles();
	};
};

/**
 * Cleans data before storyboard processing.
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

/**
 * Executes the Critical Path Method.
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

/**
 * Sets start times for the segments of the storyboard.
 * It's meant to be called right after the Critical Path Method execution
 */
Storyboard.prototype.setStartTimeForSegments = function() {
	this.segments.forEach(function (segment) {
		var from = segment.from;
		segment.tStart = (from.tMax + from.tMin) / 2 ;
	});
};

/**
 * Returns the segments of the storyboard associated to the specified actor
 * @return {Segment[]} Segments associated to the actor
 * @param {Actor} actor The actor whose associated segments must be returned
 */
Storyboard.prototype.actor2Segments = function(actor) {
	return this.segments.filter(function (segment) {
			return segment.actor === actor;
		});
};


/**
 * Returns the structured data the timeline might need to show the segments of the actors
 * @return {Object[]} Structured data of the segments associated to the actor
 * @param {Actor[]} actors The actors whose associated segment data must be returned
 */
Storyboard.prototype.actors2SegmentsData = function (actors) {

	var ActorSegments = function (actor) {
		this.id = actor.id;
		this.name = actor.description;
		this.series = [];
	}
	var timelineData = [];
	var actorSegmentList = [];
	actors.forEach(function (actor) {
		var as = new ActorSegments(actor);
		actorSegmentList.push(as);
	});

	this.segments.forEach(function (segment) {
		var stop = false;
		for(var i=0; i < actorSegmentList.length && !stop; i++) {
			if(segment.actor.id === actorSegmentList[i].id){
				stop = true;
				var bar = {name: segment.id, start: segment.tStart, end: (segment.tStart + segment.duration)};
				actorSegmentList[i].series.push(bar);
			}
		}
	});

	actorSegmentList.forEach(function (as) {
		var al = {id: as.id, name: as.name, series: as.series};
		timelineData.push(al);
	});
	return timelineData;
}
