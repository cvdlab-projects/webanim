# storyboard.js

### Javascript representation of a storyboard graph

- - -

## `Event()`
Representation of a node of the storyboard graph.

### `addIncomingSegment(segment)`
Adds a segment to the incoming segments of the event

#### I/O

> #### in
> `Segment` `segment`: the segment to add.
>

- - -

### `addOutgoingSegment(segment)`
Adds a segment to the outgoing segments of the event

#### I/O

> #### in
> `Segment` `segment`: the segment to add.
>

- - -

### `inDegree()`
Returns the indegree value of the event.

#### I/O

> #### out
> `Number`: The indegree value.
> 

- - -

### `outDegree()`
Returns the outdegree value of the event.

#### I/O

> #### out
> `Number`: The outdegree value.
> 

- - -

### `removeIncomingSegment(segment)`
Removes a segment from the incoming segments of the event.

#### I/O

> #### in
> `Segment` `segment`: The segment to remove.
>

- - -

### `removeOutgoingSegment(segment)`
Removes a segment from the outgoing segments of the event.

#### I/O

> #### in
> `Segment` `segment`: The segment to remove.
>

- - -

## `Segment()`
Representation of an edge of the storyboard graph.

- - -

## `Actor()`
Representation of an actor.

- - -

## `Storyboard()`
Representation of the storyboard graph.

### `actor2Segments(actor)`
Returns the segments of the storyboard associated to the specified actor.

#### I/O

> #### in
> `Actor` `actor`: The actor whose associated segments must be returned.
> 
> #### out
> `Segment[]`: Segments associated to the actor.
> 

- - -

### `actors2SegmentsData(actors)`
Returns the structured data the timeline might need to show the segments of the actors.

#### I/O

> #### in
> `Actor` `actor`: The actor whose associated segment data must be returned.
> 
> #### out
> `Object[]`: Structured data of the segments associated to the actor.
> 

- - -

### `addEvent(event)`
Adds an event to the storyboard graph.

#### I/O

> #### in
> `Event` `event`: The event to add to the storyboard graph.
> 

- - -

### `addSegment(segment)`
Adds a segment to the storyboard graph.

#### I/O

> #### in
> `Segment` `segment`: The segment to add to the storyboard graph.
> 

- - -

### `executeCPM()`
Executes the Critical Path Method.

- - -

### `getEventById(id)`
Returns an event of the storyboard graph with the specified id.

#### I/O

> #### in
> `Number` `id`: The id of the event to return.
> 
> #### out
> `Event`: The event of the storyboard with the specified id.
> 

- - -

### `getSegmentById(id)`
Returns a segment of the storyboard graph with the specified id.

#### I/O

> #### in
> `Number` `id`: The id of the segment to return.
> 
> #### out
> `Segment`: The segment of the storyboard with the specified id.
> 

- - -

### `hasAllEventsReachable()`
All events must be reachable from source event. This can be checked by using any non-cycling algorithm for graph visit and marking visited events: the storyboard is valid if and only if every event is marked.

#### I/O

> #### out
> `Boolean`: Checks if all the events of the storyboard are reachable from the source.
> 

- - -

### `hasCorrectDegrees()`
Returns true if and only if the events in the Storyboard have correct degrees (indegree = 0 for source, outdegree = 0 for sink, indegree != 0 and outdegree != 0 for remaining events). It also fills in the 'validityReport' property when it encounters an event which doesn't follow the rule mentioned before. Its properties are: - incoming: true if and only if the value of the indegree of an event other than the source is 0. - outgoing: true if and only if the value of the outdegree of an event other than the sink is 0. - source: true iff the indegree of the source event is different from 0. - sink: true iff the outdregree of the sink event is different from 0. - event: the event with wrong degree value.

#### I/O

> #### out
> `Boolean`: Checks if all the events of the storyobard have correct degrees.
> 

- - -

### `hasCycles()`
Kahn's algorithm for topological sorting. It is also suitable for detecting cycles.

#### I/O

> #### out
> `Boolean`: Checks if the storyboard graph contains cycles.
> 

- - -

### `isValid()`
Performs a full validation of the Storyboard.

#### I/O

> #### out
> `Boolean`: Checks if the storyboard graph is valid.
> 

- - -

### `removeEvent(event)`
Removes an event from the storyboard graph, causing all the related segments to be removed too.

#### I/O

> #### in
> `Event` `event`: The event to remove from the storyboard graph.
> 

- - -

### `removeSegment(segment)`
Removes a segment from the storyboard graph, updating all the related events.

#### I/O

> #### in
> `Segment` `segment`: The segment to remove from the storyboard graph.
> 

- - -

### `resetMarks()`
For simplicity and/or performances, some graph algorithms mark nodes instead of copying and deleting them. This function removes these marks, thus it is called by each function that needs to use them.

- - -

### `resetTimes()`
Cleans data before storyboard processing.

- - -

### `resetTopologicalOrder()`
Resets the topological order of the events of the storyboard.

- - -

### `resetValidityReport()`
Resets the 'validityReport' property of the storyboard.

- - -

### `setSink(event)`
Sets an event as the sink of the storyboard graph.

#### I/O

> #### in
> `Event` `event`: The event to set as sink.
> 

- - -

### `setSource(event)`
Sets an event as the source of the storyboard graph.

#### I/O

> #### in
> `Event` `event`: The event to set as source.
> 

- - -

### `setStartTimeForSegments()`
Sets start times for the segments of the storyboard. It's meant to be called right after the Critical Path Method execution.

- - -

### `topologicalSort()`
Detects cycles and provides topological sorting. It's necessary to the Critical Path Method.

#### I/O

> #### out
> `Boolean`: Checks if the topologically sorted storyboard graph contains cycles.
> 

- - -

## `StoryboardController(listener)`
Representation of a controller to handle storyboard associated operations.

#### I/O

> #### in
> `Listener` `listener`: An object entitled to communicate with the UI.
> 
> #### out
> `StoryboardController`: A StoryboardController.
> 

- - -

### `addActor(description, model, startingConfiguration)`
Adds an actor with the specified model, description and startingConfiguration properties to the controller.

#### I/O

> #### in
> `String` `description`: The description of the new actor to add.
> `model`: The representation to associate to the new actor.
> `startingConfiguration`: The initial configuration of the new actor.
>  

- - -

### `addEvent(description)`
Adds a new event to the controller storyboard object.

#### I/O

> #### in
> `String` `description`: The description of the event to add.
>  

- - -

### `addSegment()`
Adds the new segment to the storyboard object of the controller.

- - -

### `getActorById(id)`
Returns the actor with the specified id.

#### I/O

> #### in
> `Number` `id`: The id of the actor to return.
> 
> #### out
> `Actor`: The actor with the specified id.
> 

- - -

### `getActorId()`
Returns the id of the next actor to be generated.

#### I/O

> #### out
> `Number`: The id of the next actor to be generated.
> 

- - -

### `getEventId()`
Returns the id of the next event to be generated.

#### I/O

> #### out
> `Number`: The id of the next event to be generated.
> 

- - -

### `getSegmentId()`
Returns the id of the next segment to be generated.

#### I/O

> #### out
> `Number`: The id of the next segment to be generated.
> 

- - -

### `populateTimeline()`
Returns the structured data the timeline might need to show the segments of the actors.

#### I/O

> #### out
> `Object[]`: Structured data of the segments associated to each actor.
> 

- - -

### `processStoryboard()`
Processes the controller storyboard object.

- - -

### `removeEvent(id)`
Removes the event with the specified id from the controller storyboard.

#### I/O

> #### in
> `Number` `id`: The id of the event to remove.
>  

- - -

### `removeSegment(id)`
Removes the segment with the specified id from the controller storyboard.

#### I/O

> #### in
> `Number` `id`: The id of the segment to remove.
>  

- - -

### `setActorForNewSegment(actorId)`
Sets the actor property of the new segment.

#### I/O

> #### in
> `Number` `actorId`: The id of the actor to associate the new segment to.
>  

- - -

### `setBehaviourForNewSegment(behaviour)'
Sets the behaviour property of the new segment.

#### I/O

> #### in
> 'Object' `behaviour`: The behaviour to associate to the new segment.
>  

- - -

### `setDescriptionForNewSegment(description)'
Sets the description property of the new segment.

#### I/O

> #### in
> 'String' `description`: The description of the new segment.
>  

- - -

### `setDescriptionForSegment(id, description)'
Sets the description property of the specified segment.

#### I/O

> #### in
> 'Number' `id`: The id of the segment whose decription has to be set.
> 'String' `description`: The description of the segment.
>  

- - -

### `setDurationForNewSegment(duration)'
Sets the duration property of the new segment.

#### I/O

> #### in
> 'Number' `duration`: The duration to associate to the new segment.
>  

- - -

### `startAddSegment(fromId, toId)'
Creates a new segment for the controller storyboard object.

#### I/O

> #### in
> 'Number' `fromId`: The id of the event the new segment departs from.
> 'Number' `toId`: The id of the event the new segment arrives to.
>  

- - -