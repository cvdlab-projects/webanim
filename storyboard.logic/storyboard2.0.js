/* Events. */

Event = function() {
	this.ingoingSegments = [];
	this.outgoingSegments = [];
	this.tMin = Number.NEGATIVE_INFINITY;
	this.tMax = Number.POSITIVE_INFINITY;
	this.startTime = Number.POSITIVE_INFINITY;
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
	this.startTime = t;
};

/* Behaviour, with information needed by the rendering part of the project */

Behaviour = function() {
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

/* Used to identify the actor referenced in the segment */
Behaviour.prototype.setIdActor = function(idActor) {
	this.idActor = idActor;
}

/* The same as segment.id */
Behaviour.prototype.setId = function(id) {
	this.id = id;
}

/* translate, rotate or scale */
Behaviour.prototype.setType = function(type) {
	this.type = type;
}


/* Info needed by the "translate" type of action */
Behaviour.prototype.setDxf = function(dxf) {
	this.dxf = dxf;
}

Behaviour.prototype.setDyf = function(dyf) {
	this.dyf = dyf;
}

Behaviour.prototype.setDzf = function(dzf) {
	this.dzf = dzf;
}


/* Info needed by the "scale" type of action */
Behaviour.prototype.setX = function(x) {
	this.x = x;
}

Behaviour.prototype.setY = function(y) {
	this.y = y;
}

Behaviour.prototype.setZ = function(z) {
	this.z = z;
}


/* Info needed by the "rotate" type of action */
Behaviour.prototype.setDgx = function(dgx) {
	this.dgx = dgx;
}

Behaviour.prototype.setDgy = function(dgy) {
	this.dgy = dgy;
}

Behaviour.prototype.setDgz = function(dgz) {
	this.dgz = dgz;
}


/* Start and end times*/
Behaviour.prototype.setStartTime = function(startTime) {
	this.startTime = startTime;
}

Behaviour.prototype.setEndTime = function(endTime) {
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

Segment.prototype.setBehaviour = function(behaviour) {
	this.behaviour = behaviour;
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
	this.validityIssues = [];
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

	var isSourceOK = source.hasZeroInDegree();
	var isSinkOk = sink.hasZeroOutDegree();
	if(isSourceOK && isSinkOk){ // source has zero in-degree and sink has zero out-degree
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
	else {
		if(!isSourceOK)
			this.validityIssues.push("Source Event has ingoing Segments.");
		if(!isSinkOk)
			this.validityIssues.push("Sink Event has outgoing Segments.");
		return false;
	}
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
		})
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
		})
	}
};

Storyboard.prototype.setStartTimeForEvents = function() {
	this.events.forEach(function (event) {
		event.setStartTime( (event.tMax + event.tMin) / 2 );
	});
};


Storyboard.prototype.computeTimeline = function() {
	var timeline = [];
	this.segments.forEach(function (item, index) {
		var start = item.from.startTime * 1000;
		var end = item.to.startTime * 1000;
		var behaviour = item.behaviour; // Behaviour's properties updated
		behaviour.setStartTime(start);
		behaviour.setEndTime(end);
		timeline.push(behaviour);
	})
	timeline.sort(function (behaviour1, behaviour2) {
		return behaviour1.startTime - behaviour2.startTime;
	});
	return timeline;
};

Storyboard.prototype.resetTimes = function() {
	this.events.forEach(
		function (event) {
			event.setTMin(Number.NEGATIVE_INFINITY);
			event.setTMax(Number.POSITIVE_INFINITY);
			event.setStartTime(undefined);
		}
	)
};