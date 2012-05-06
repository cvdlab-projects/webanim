/* Events. */

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
	this.tMin = Number.NEGATIVE_INFINITY;
	this.tMax = Number.POSITIVE_INFINITY;
	this.tMean = Number.POSITIVE_INFINITY; // @
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
	var index = this.ingoingSegments.indexOf(segment);
	this.ingoingSegments.splice(index,1);
};

Event.prototype.removeOutgoingSegment = function(segment) {
	var index = this.outgoingSegments.indexOf(segment);
	this.outgoingSegments.splice(index,1);
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

Event.prototype.setTMean = function(t) { // @
	this.tMean = t;
};


/* Segments. */

Segment = function() {};

Segment.prototype.setId = function(id) {
	this.id = id;
};

/* Si potrebbe passare come descrizione un oggetto contenente attore e azione */
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
	var results = this.events.filter(function (item, index) {
		return item.id === id;
	});
	return results[0];
};

Storyboard.prototype.removeEvent = function(event) {
	var index = this.events.indexOf(event);
	this.events.splice(index,1);
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

Storyboard.prototype.getSegment = function(id) { // @
	var results = this.segments.filter(function (item, index){
		return item.id === id;
	})
	return results[0];
};

Storyboard.prototype.removeSegment = function(segment) {
	var from = segment.from;
	var to = segment.to;

	from.removeOutgoingSegment(segment);
	to.removeIngoingSegment(segment);

	var index = this.segments.indexOf(segment);
	this.segments.splice(index,1); // rimuove l'elemento nella posizione index
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


Storyboard.prototype.isReachableFromSource = function(event) { // @
	return isReachableFrom(this.sink,event);
};

Storyboard.prototype.isReachableFrom = function (start, target) { // @
	if (start === target)
		return true;
	var found = start.outgoingSegments.some(function (item, index){
		return (item.to === target || isReachableFrom(item.to, target));
	});
	return found;
}

Storyboard.prototype.isCycling = function (event) { // @
	return event.outgoingSegments.some(function (item, index){
		return (item.to === event || isReachableFrom(item.to, event));
	});
}


Storyboard.prototype.isValid = function() { // @
	var source = this.source; // *
	var sink = this.sink; //  * non riesce ad accedere a questi dati all'interno della some e della every
	var metodo = this.isCycling; // *
	if(this.source.zeroInDegree() && this.sink.zeroOutDegree()){ // source has zero in-degree and sink has zero out-degree
		var nodesCheck = this.events.some(function (item, index) {
			if(item === sink || item === source)
				return false;
			return item.zeroDegree(); // all other nodes have non-zero degree
		});
		if(nodesCheck === false) { // all other nodes have non-zero degree
			return this.events.every(function (item, index) {
				return this.isReachableFrom(source, item) && (!metodo(item)); //there are no oriented cycles and every event is reachable from the source
			});
		}
		else
			return false;
	}
	else
		return false;
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

Storyboard.prototype.setStartTimeForEvents = function() { // @
	this.events.forEach(function (item, index) {
		item.setStartTime((item.tMax + item.tMin)/2);
	});
};

/* Utile per l'output */
AnimationSegment = function (description, startTime, endTime) { // @
	this.description = description; // assumiamo, come sopra, che contenga informazioni su attore e azione da eseguire
	this.startTime = startTime;
	this.endTime = endTime;
}


Storyboard.prototype.computeActor2SegmentsFunction = function() { // @
	var timeline = [];
	this.segments.forEach(function (item, index) {
		var start = item.from.startTime;
		var end = item.to.startTime;
		var animationSegment = new AnimationSegment(item.description, start, end);
		timeline.push(segment);
	})
	timeline.sort(function (segment1, segment2) {
		return segment1.start - segment2.start;
	});
	return timeline;
};