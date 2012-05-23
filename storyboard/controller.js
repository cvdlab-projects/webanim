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

/* UC1: Add Actor. */

StoryboardController.prototype.addActor = function(model, description) {
	var newActor = new Actor();
	newActor.id = this.getActorId();
	newActor.model = model;
	newActor.description = description;
	this.actors.push(newActor);
};

/* UC2: Add Event. */

StoryboardController.prototype.addEvent = function(description) {
	var newEvent = new Event();
	newEvent.id = this.getEventId();
	newEvent.description = description;
	this.storyboard.addEvent(newEvent);
};

/* UC3: Add Segment. */

StoryboardController.prototype.startAddSegment = function(fromId, toId) {
	var newSegment = new Segment();
	newSegment.id = this.getSegmentId();
	newSegment.from = this.storyboard.getEventById(fromId);
	newSegment.to = this.storyboard.getEventById(toId);
	this.newSegment = newSegment;
};

StoryboardController.prototype.setDescriptionForNewSegment = function(description) {
	this.newSegment.description = description;
};

StoryboardController.prototype.setActorForNewSegment = function(actorId) {
	var actor = this.getActorById(actorId);
	this.newSegment.actor = actor;
};

StoryboardController.prototype.setBehaviourForNewSegment = function(behaviour) {
	this.newSegment.behaviour = behaviour;
};

StoryboardController.prototype.setDurationForNewSegment = function(duration) {
	this.newSegment.duration = duration;
};

StoryboardController.prototype.addSegment = function() {
	this.storyboard.addSegment(this.newSegment);
	this.newSegment = undefined;
};

/* UC4: Process Storyboard. */

StoryboardController.prototype.processStoryboard = function() {
	// Validity check
	if (!this.storyboard.isValid()) {
		this.listener.storyboardNotValid(this.storyboard.validityReport);
	} else {
		// Storyboard processing
		this.storyboard.executeCPM();
		this.storyboard.setStartTimeForSegments();
		this.listener.storyboardProcessingCompleted(this.storyboard);
	};
};

/* UC5: Remove Event. */

StoryboardController.prototype.removeEvent = function(eventId) {
	var event = this.storyboard.getEventById(eventId);
	this.storyboard.removeEvent(event);
};

/* UC6: Remove Segment. */

StoryboardController.prototype.removeSegment = function(segmentId) {
	var segment = this.storyboard.getSegmentById(segmentId);
	this.storyboard.removeSegment(segment);
};