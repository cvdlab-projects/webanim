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
	var index = this.ingoingSegments.indexOf(segment);
	this.ingoingSegments.splice(index,1);
};

Event.prototype.removeOutgoingSegment = function(segment) {
	var index = this.outgoingSegments.indexOf(segment);
	this.outgoingSegments.splice(index,1);
};

Event.prototype.hasZeroInDegree = function() {
	return this.ingoingSegments.length === 0;
};

Event.prototype.hasZeroOutDegree = function() {
	return this.outgoingSegments.length === 0;
}

Event.prototype.hasZeroDegree = function() {
	return this.hasZeroInDegree() && this.hasZeroInDegree();
};

Event.prototype.setTMin = function(t) {
	this.tMin = t;
};

Event.prototype.setTMax = function(t) {
	this.tMax = t;
};

Event.prototype.setStartTime = function(t) {
	this.outgoingSegments.forEach(
		function (segment) {
			segment.setStartTime(t);
		};
	);
};

/* Transition info, contenente le info necessarie al rendering */

TransitionInfo = function() {
	this.dx = 0;
	this.dy = 0;
	this.dz = 0;
	this.osx = 1;
	this.osy = 1;
	this.osz = 1;
	this.ini = false;
	this.rx = 0;
	this.ry = 0;
	this.rz = 0;
};

/* Per identificare l'oggetto a cui fa riferimento la transizione */
TransitionInfo.prototype.setIdObject = function(idObject) {
	this.idObject = idObject;
}

/* Impostato dal Segment nel momento in cui viene generata la timeline */
TransitionInfo.prototype.setId = function(id) {
	this.id = id;
}

/* translate, rotate, scale */
TransitionInfo.prototype.setType = function(type) {
	this.type = type;
}


/* Info per le traslazioni */
TransitionInfo.prototype.setDxf = function(dxf) {
	this.dxf = dxf;
}

TransitionInfo.prototype.setDyf = function(dyf) {
	this.dyf = dyf;
}

TransitionInfo.prototype.setDzf = function(dzf) {
	this.dzf = dzf;
}


/* Info per gli scalamenti */
TransitionInfo.prototype.setX = function(x) {
	this.x = x;
}

TransitionInfo.prototype.setY = function(y) {
	this.y = y;
}

TransitionInfo.prototype.setZ = function(z) {
	this.z = z;
}


/* Info per le rotazioni */
TransitionInfo.prototype.setDgx = function(dgx) {
	this.dgx = dgx;
}

TransitionInfo.prototype.setDgy = function(dgy) {
	this.dgy = dgy;
}

TransitionInfo.prototype.setDgz = function(dgz) {
	this.dgz = dgz;
}


/* Start and end times*/
TransitionInfo.prototype.setStartTime = function(startTime) {
	this.startTime = startTime;
}

TransitionInfo.prototype.setEndTime = function(endTime) {
	this.endTime = endTime;
}



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

Segment.prototype.setStartTime = function(t) {
	this.start = t;
	this.stop = t + this.duration;
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

Storyboard.prototype.getSegment = function(id) {
	var results = this.segments.filter(function (item, index){
		return item.id === id;
	})
	return results[0];
};

Storyboard.prototype.removeSegment = function(segment) {
	// First, update FROM & TO Events
	var from = segment.from;
	var to = segment.to;

	from.removeOutgoingSegment(segment);
	to.removeIngoingSegment(segment);

	// Finally remove Segment
	var index = this.segments.indexOf(segment);
	this.segments.splice(index,1);
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
	var source = this.source;
	var sink = this.sink;
	var isReachableFrom = function (start, target) { // @
	if (start === target)
		return true;
	var found = start.outgoingSegments.some(function (item, index){
		return (item.to === target || isReachableFrom(item.to, target));
	});
	return found;
	};

	var isReachableFromSource = function (event) { // @
	return isReachableFrom(source,event);
	};

	var isCycling = function (event) {
		return event.outgoingSegments.some(function (item, index){
		return (item.to === event || isReachableFrom(item.to, event));
	});
	}


	if(this.source.hasZeroInDegree() && this.sink.hasZeroOutDegree()){ // source has zero in-degree and sink has zero out-degree
		var nodesCheck = this.events.some(function (item, index) {
			if(item === sink || item === source)
				return false;
			return item.hasZeroDegree(); // all other nodes have non-zero degree
		});
		if(nodesCheck === false) { // all other nodes have non-zero degree
			return this.events.every(function (item, index) {
				return isReachableFromSource(item) && (!isCycling(item)); //there are no oriented cycles and every event is reachable from the source
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

Storyboard.prototype.setStartTimeForEvents = function() {
	this.events.forEach(function (event) {
		event.setStartTime( (event.tMax + event.tMin) / 2 );
	});
};


Storyboard.prototype.computeActor2SegmentsFunction = function() {
	var timeline = [];
	this.segments.forEach(function (item, index) {
		var start = item.from.startTime;
		var end = item.to.startTime;
		var transitionInfo = item.desc; // vengono compilati i campi temporali del transitionInfo
		transitionInfo.setStartTime(start);
		transitionInfo.setEndTime(end);
		timeline.push(transitionInfo);
	})
	timeline.sort(function (transition1, transition2) {
		return transition1.startTime - transition2.startTime;
	});
	return timeline;
};

Storyboard.prototype.reset = function() {
	this.events.forEach(
		function (event) {
			event.setTMin(Number.NEGATIVE_INFINITY);
			event.setTMax(Number.POSITIVE_INFINITY);
			event.setStartTime(undefined);
		};
	);
};