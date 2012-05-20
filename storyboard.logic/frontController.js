FrontController = function () {
	this.storyboardController = new StoryboardController();
}

/* UC1 Add event */
FrontController.prototype.addEvent = function(description) {
	this.storyboardController.addEvent(description);
};

/* UC2 Add segment */
/* [description, idFrom, idTo, duration, behaviourInfo] */
FrontController.prototype.addSegment= function(segmentData) {
	this.storyboardController.startAddNewSegment(segmentData[0]);
	this.storyboardController.setFromEventForNewSegment(segmentData[1]);
	this.storyboardController.setToEventForNewSegment(segmentData[2]);
	this.storyboardController.setDurationForNewSegment(segmentData[3]);
	this.storyboardController.setBehaviourForNewSegment(segmentData[4]);
	this.storyboardController.addNewSegment();
};

/* UC3: Edit an existing Event. */
FrontController.prototype.modifyEvent = function(id, description) {
	this.storyboardController.startEditingEvent(id);
	this.storyboardController.changeDescriptionForEvent(description);
};



/* UC4: Edit an existing Segment. */
FrontController.prototype.modifySegment = function(id, segmentData) {
	this.storyboardController.startEditingSegment(id);
	this.storyboardController.changeDescriptionForSegment(segmentData[0]);
	this.storyboardController.changeFromEventForSegment(segmentData[1]);
	this.storyboardController.changeToEventForSegment(segmentData[2]);
	this.storyboardController.changeDurationForSegment(segmentData[3]);
	this.storyboardController.changeBehaviourForNewSegment(segmentData[4]);
}


/* UC5: Remove an Event. */
FrontController.prototype.removeEvent = function(id) {
	this.storyboardController.startRemoveEvent(id);
	if(this.storyboardController.isEventRemovable())
		this.storyboardController.removeEvent();
};

/* UC6: Remove a Segment. */
FrontController.prototype.removeSegment = function(id) {
	this.storyboardController.removeSegment(id);
};

/* UC7: Check if the edited Storyboard is valid and process it*/
FrontController.prototype.isStoryboardValid = function() {
	return this.storyboardController.isStoryboardValid();
}

FrontController.prototype.processStoryboard = function() {
	this.storyboardController.resetStoryboard();
	return this.storyboardController.processStoryboard();
}

FrontController.prototype.getValidityIssues = function() {
	return this.storyboardController.storyboard.validityIssues();
}