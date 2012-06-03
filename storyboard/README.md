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
Returns the structured data the timeline might needs to show the segments of the actors.

#### I/O

> #### in
> `Actor` `actor`: The actor whose associated segment data must be returned.
> 
> #### out
> `Object[]`: Structured data of the segments associated to the actor.
> 

- - -




