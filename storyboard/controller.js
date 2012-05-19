StoryboardController = function(listener) {
	this.listener = listener;

	//IDs management stuff
	this.nextEventId = 1;
	this.nextSegmentId = 1;
	this.nextActorId = 1;
	this.getEventId = function() {
		return this.nextEventId++;
	};
	this.getSegmentId = function() {
		return this.nextSegmentId++;
	};
	this.getActorId = function() {
		return this.nextActorId++;
	};

	// Creation of a new Storyboard
	this.storyboard = new Storyboard();
	var source = new Event();
	source.id = this.getEventId();
	source.description = "Beginning of the animation.";
	var sink = new Event();
	sink.id = this.getEventId();
	sink.description = "End of the animation.";
	this.storyboard.addEvent(source);
	this.storyboard.addEvent(sink);
	this.storyboard.setSource(source);
	this.storyboard.setSink(sink);

	// Actors stuff
	this.actors = [];
	this.getActorById = function(id) {
		var actor;
		var found = false;

		for (var i = 0; i < this.actors.length && !found; i++) {
			if (this.actors[i].id === id) {
				found = true;
				actor = this.actors[i];
			};
		};

		return actor;
	};
};

/* UC1. */

StoryboardController.prototype.addActor = function(description) {
	var newActor = new Actor();
	newActor.id = this.getActorId();
	newActor.description = description;
	this.actors.push(newActor);
};

/* UC2. */

StoryboardController.prototype.addEvent = function(description) {
	var newEvent = new Event();
	newEvent.id = this.getEventId();
	newEvent.description = description;
	this.storyboard.addEvent(newEvent);

	this.listener.newEvent(newEvent);
};

/* UC3. */

StoryboardController.prototype.startAddSegment = function(description) {
	var newSegment = new Segment();
	newSegment.id = this.getSegmentId();
	newSegment.description = description;
	this.newSegment = newSegment;
};

StoryboardController.prototype.setActorForNewSegment = function(actorId) {
	var actor = this.getActorById(actorId);
	this.newSegment.actor = actor;
};

StoryboardController.prototype.setFromEventForNewSegment = function(eventId) {
	var from = this.storyboard.getEventById(eventId);
	this.newSegment.from = from;
};

StoryboardController.prototype.setToEventForNewSegment = function(eventId) {
	var to = this.storyboard.getEventById(eventId);
	this.newSegment.to = to;
};

StoryboardController.prototype.setDurationForNewSegment = function(duration) {
	this.newSegment.duration = duration;
};

StoryboardController.prototype.addSegment = function() {
	this.storyboard.addSegment(this.newSegment);

	this.listener.newSegment(this.newSegment);
};

/* UC4. */

StoryboardController.prototype.processStoryboard = function() {
	var checkResult = this.storyboard.checkDegrees();
	if (checkResult.error) {
		var message;
		if (checkResult.source) {
			message = "The source Event must have zero ingoing Segments!";
		} else if (checkResult.sink) {
			message = "The sink Event must have zero outgoing Segments!";
		} else {
			if (checkResult.ingoing) {
				message = "Event "+ checkResult.event.id +" has zero ingoing Segments!";
			} else if (checkResult.outgoing) {
				message = "Event "+ checkResult.event.id +" has zero outgoing Segments!";
			};
		};
		this.listener.storyboardNotValid(message);
	};
};