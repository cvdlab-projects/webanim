/*
 * A Sampler extracts sample of an
 * Actor's configurations during its
 * Segments.
 * The Sampler needs the a2s function
 * to get the Actors' Segments.
 */
Sampler = function(a2s) {
	this.a2s = a2s;
};

/*
 * Actor's configuration sample at a given time.
 */
Sampler.prototype.sample = function(actor, t) {
	//  Get Actor's Segments
	var segments = this.a2s(actor);

	// Search Segment containing t
	var segment;
	var found = false;
	for (var i = 0; i < segments.length && !found; i++) {
		if (segments[i].tStart <= t && segments[i].tStart + segments[i].duration >= t) {
			segment = segments[i];
			found = true;
		};
	};

	// Return configuration in t
	var p = (t - segment.tStart) / segment.duration;
	return segment.behaviour(p);
};

/*
 * Actor's configuration samples from tStart
 * to tStop, given a framereate (in frame per
 * second).
 */
Sampler.prototype.samples = function(actor, tStart, tStop, fps) {
	//  Get Actor's Segments
	var segments = this.a2s(actor);

	// Search Segments from tStart to tStop
	var segmentsToSample = [];
	for (var i = 0; i < segments.length && segments[i].tStart <= tStop; i++) {
		if (segments[i].tStart + segments[i].duration >= tStart) {
			segmentsToSample.push(segments[i]);
		};
	};

	// Get samples
	var samples = [];
	var delta = 1 / fps;
	for (var i = 0; i < segmentsToSample.length; i++) {
		var s = segmentsToSample[i];

		// Dealing with truncated Segments
		var t1 = s.tStart;
		var t2 = s.tStart + s.duration;
		if (s.tStart < tStart) {
			t1 = tStart;
		};
		if (s.tStart + s.duration > tStop) {
			t2 = tStop;
		};

		var t = t1;
		while (t < t2) {
			var p = (t - s.tStart) / s.duration;
			samples.push(s.behaviour(p));
			t += delta;
		};
	};

	// Return samples
	return samples;
};