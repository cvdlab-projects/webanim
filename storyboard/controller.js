/**
 * @class Represents a controller to handle storyboard associated operations
 * @param {Listener} listener An object entitled to communicate to the UI
 */
StoryboardController = function(listener) {
	this.listener = listener;

	//IDs management stuff
	this.nextEventId = 1;
	this.nextSegmentId = 1;
	this.nextActorId = 1;

	/**
	 * Returns the id of the next event to be generated
	 * @return {number} The id of the next event to be generated
	 */
	this.getEventId = function() {
		return this.nextEventId++;
	};

	/**
	 * Returns the id of the next segment to be generated
	 * @return {number} The id of the next segment to be generated
	 */
	this.getSegmentId = function() {
		return this.nextSegmentId++;
	};

	/**
	 * Returns the id of the next actor to be generated
	 * @return {number} The id of the next actor to be generated
	 */
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

	/**
	 * Returns the actor with the specified id
	 * @return {Actor} Actor with the specified id
	 * @param {number} id The id of the actor to return
	 */
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

/**
 * Adds an actor with the specified model and description properties to the controller
 * @param {String} description The description of the new actor to add
 * @param model The representation to associate to the new actor
 * @param startingConfiguration The initial configuration of the new actor
 */
StoryboardController.prototype.addActor = function(model, description, startingConfiguration) {
	var newActor = new Actor();
	newActor.id = this.getActorId();
	newActor.model = model;
	newActor.description = description;
	newActor.startingConfiguration = startingConfiguration;
	this.actors.push(newActor);
};

/* UC2: Add Event. */

/**
 * Adds a new event to the storyboard object of the controller
 * @param {String} description The description of the event to add
 */
StoryboardController.prototype.addEvent = function(description) {
	var newEvent = new Event();
	newEvent.id = this.getEventId();
	newEvent.description = description;
	this.storyboard.addEvent(newEvent);
};

/* UC3: Add Segment. */

/**
 * Creates a new segment
 * @param {number} fromId The id of the event the new segment departs from
 * @param {number} toId The id of the event the new segment arrives to
 */
StoryboardController.prototype.startAddSegment = function(fromId, toId) {
	var newSegment = new Segment();
	newSegment.id = this.getSegmentId();
	newSegment.from = this.storyboard.getEventById(fromId);
	newSegment.to = this.storyboard.getEventById(toId);
	this.newSegment = newSegment;
};

/**
 * Sets the description property of the new segment
 * @param {String} description The description of the new segment
 */
StoryboardController.prototype.setDescriptionForNewSegment = function(description) {
	this.newSegment.description = description;
};

/**
 * Sets the description property of the specified segment
 * @param {number} id The id of the segment whose description has to be set
 * @param {String} description The description of the new segment
 * @
 */

StoryboardController.prototype.setDescriptionForSegment = function(id, description) {
	var segment = this.storyboard.getSegmentById(id);
	segment.description = description;
};

/**
 * Sets the actor property of the new segment
 * @param {number} actorId The id of the actor to associate the new segment to
 */
StoryboardController.prototype.setActorForNewSegment = function(actorId) {
	var actor = this.getActorById(actorId);
	this.newSegment.actor = actor;
};

/**
 * Sets the behaviour property of the new segment
 * @param {Function[]} behaviour The behaviour to associate to the new egment
 */
StoryboardController.prototype.setBehaviourForNewSegment = function(behaviour) {
	this.newSegment.behaviour = behaviour;
};

/**
 * Sets the duration property of the new segment
 * @param {number} duration The duration to associate to the new segment
 */
StoryboardController.prototype.setDurationForNewSegment = function(duration) {
	this.newSegment.duration = duration;
};

/**
 * Adds the new segment to the storyboard object of the controller
 */
StoryboardController.prototype.addSegment = function() {
	this.storyboard.addSegment(this.newSegment);
	this.newSegment = undefined;
};

/* UC4: Process Storyboard. */

/**
 * Processes the storyboard object of the controller
 */
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

/**
 * Removes the event with the specified id from the controller storyboard
 * @param {number} eventId The id of the event to remove
 */
StoryboardController.prototype.removeEvent = function(eventId) {
	var event = this.storyboard.getEventById(eventId);
	this.storyboard.removeEvent(event);
};

/* UC6: Remove Segment. */

/**
 * Removes the segment with the specified id from the controller storyboard
 * @param {number} segmentId The id of the segment to remove
 */
StoryboardController.prototype.removeSegment = function(segmentId) {
	var segment = this.storyboard.getSegmentById(segmentId);
	this.storyboard.removeSegment(segment);
};

/**
 * Returns the structured data the timeline might needs to show the segments of the actors
 * @return {Object[]} Structured data of the segments associated to the actor
 */
StoryboardController.prototype.populateTimeline = function() {
	return this.storyboard.actors2SegmentsData(this.actors);
}

