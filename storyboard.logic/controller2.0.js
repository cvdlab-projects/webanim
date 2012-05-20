StoryboardController = function() {
	//IDs management stuff
	this.nextEventId = 1;
	this.nextSegmentId = 1;
	this.getEventId = function() {
		return this.nextEventId++;
	};
	this.getSegmentId = function() {
		return this.nextSegmentId++;
	};

	// Initialize a new Storyboard
	this.storyboard = new Storyboard();

	var sourceId = this.getEventId();
	var sinkId = this.getEventId();

	var source = this.storyboard.newEvent(sourceId)("Beginning of the animation.");
	var sink = this.storyboard.newEvent(sinkId)("End of the animation.");

	this.storyboard.addEvent(source);
	this.storyboard.addEvent(sink);

	this.storyboard.setSource(source);
	this.storyboard.setSink(sink);
};

/* UC1: Add a new Event. */

StoryboardController.prototype.addEvent = function(desc) {
	var id = this.getEventId();
	var newEvent = this.storyboard.newEvent(id)(desc);
	this.storyboard.addEvent(newEvent);
};

/* UC2: Add a new Segment. */

StoryboardController.prototype.startAddNewSegment = function(desc) {
	var id = this.getSegmentId();
	this.newSegment = this.storyboard.newSegment(id)(desc);
};

StoryboardController.prototype.setFromEventForNewSegment = function(id) {
	var from = this.storyboard.getEvent(id);
	this.newSegment.setFrom(from);
};

StoryboardController.prototype.setToEventForNewSegment = function(id) {
	var to = this.storyboard.getEvent(id);
	this.newSegment.setTo(to);
};


StoryboardController.prototype.setDurationForNewSegment = function(duration) {
	this.newSegment.setDuration(duration);
};

/* parameters passati dall'interfaccia quando viene settato il comportamento
[idObject, type, dxf, dyf, dzf, x, y, z, dgx, dgy, dgz]*/
StoryboardController.prototype.setBehaviourForNewSegment = function(parameters) {
	var behaviour = new Behaviour();
	behaviour.setIdObject(parameters[0]);
	behaviour.setId(this.newSegment.id);
	behaviour.setType(parameters[1]);
	behaviour.setDxf(parameters[2]);
	behaviour.setDyf(parameters[3]);
	behaviour.setDzf(parameters[4]);
	behaviour.setX(parameters[5]);
	behaviour.setY(parameters[6]);
	behaviour.setZ(parameters[7]);
	behaviour.setDgx(parameters[8]);
	behaviour.setDgy(parameters[9]);
	behaviour.setDgz(parameters[10]);
	this.newSegment.setBehaviour(behaviour);
};

StoryboardController.prototype.addNewSegment = function() {
	this.storyboard.addSegment(this.newSegment);
};

/* UC3: Edit an existing Event. */

StoryboardController.prototype.startEditingEvent = function(id) {
	this.eventToEdit = this.storyboard.getEvent(id);
};

StoryboardController.prototype.changeDescriptionForEvent = function(desc) {
	this.eventToEdit.setDescription(desc);
};

/* UC4: Edit an existing Segment. */

StoryboardController.prototype.startEditingSegment = function(id) {
	this.segmentToEdit = this.storyboard.getSegment(id);
};

StoryboardController.prototype.changeDescriptionForSegment = function(desc) {
	this.segmentToEdit.setDescription(desc);
};

StoryboardController.prototype.changeFromEventForSegment = function(id) {
	var newFrom = this.storyboard.getEvent(id);
	this.storyboard.changeFrom(this.segmentToEdit)(newFrom);
};

StoryboardController.prototype.changeToEventForSegment = function(id) {
	var newTo = this.storyboard.getEvent(id);
	this.storyboard.changeTo(this.segmentToEdit)(newTo);
};

StoryboardController.prototype.changeDurationForSegment = function(duration) {
	this.segmentToEdit.setDuration(duration);
};

StoryboardController.prototype.changeBehaviourForNewSegment = function(parameters) {
	var behaviour = new Behaviour();
	behaviour.setIdObject(parameters[0]);
	behaviour.setId(this.segmentToEdit.id);
	behaviour.setType(parameters[1]);
	behaviour.setDxf(parameters[2]);
	behaviour.setDyf(parameters[3]);
	behaviour.setDzf(parameters[4]);
	behaviour.setX(parameters[5]);
	behaviour.setY(parameters[6]);
	behaviour.setZ(parameters[7]);
	behaviour.setDgx(parameters[8]);
	behaviour.setDgy(parameters[9]);
	behaviour.setDgz(parameters[10]);
	this.segmentToEdit.setBehaviour(behaviour);
};

/* UC5: Remove an Event. */

StoryboardController.prototype.startRemoveEvent = function(id) {
	var event = this.storyboard.getEvent(id);
	this.eventToRemove = event;
};

/*
 * It's not possible to remove:
 *  - the source event
 *  - the sink event
 *  - any event with non-zero degree
 */
StoryboardController.prototype.isEventRemovable = function() {
	var zeroDegree = this.eventToRemove.zeroDegree();
	var isSource = this.storyboard.source === this.eventToRemove;
	var isSink = this.storyboard.sink === this.eventToRemove;

	return zeroDegree && !isSource && !isSink;
};

StoryboardController.prototype.removeEvent = function() {
	this.storyboard.removeEvent(this.eventToRemove);
};

/* UC6: Remove a Segment. */

StoryboardController.prototype.removeSegment = function(id) {
	var segment = this.storyboard.getSegment(id);
	this.storyboard.removeSegment(segment);
};

/* UC7: Process the Storyboard. */

StoryboardController.prototype.resetStoryboard = function() { // @
	this.storyboard.resetTimes();
}

StoryboardController.prototype.isStoryboardValid = function() {
	return this.storyboard.isValid();
};

StoryboardController.prototype.processStoryboard = function() {
	this.storyboard.executeCPM();
	this.storyboard.setStartTimeForEvents();
	return this.storyboard.computeTimeline();
};