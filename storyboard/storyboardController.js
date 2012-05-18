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
	this.storyboard.source = source;
	this.storyboard.sink = sink;

	// Actors list, empty
	this.actors = [];
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
};

/* UC3. */

StoryboardController.prototype.startAddSegment = function(description) {
	// body...
};

StoryboardController.prototype.setActorForNewSegment = function(actorId) {
	// body...
};

StoryboardController.prototype.setFromEventForNewSegment = function(eventId) {
	// body...
};

StoryboardController.prototype.setToEventForNewSegment = function(eventId) {
	// body...
};

StoryboardController.prototype.setDurationForNewSegment = function(duration) {
	// body...
};

StoryboardController.prototype.addSegment = function() {
	// body...
};

/* UC4. */

StoryboardController.prototype.processStoryboard = function() {
	// body...
};