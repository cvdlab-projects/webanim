var a1 = {};

var s1, s2, s3, s4;
s1 = {};
s1.tStart = 0;
s1.duration = 2;
s1.behaviour = function(p) {
	return 0 + p * (2 * 100 / 13); 
}
s2 = {};
s2.tStart = 2;
s2.duration = 5;
s2.behaviour = function(p) {
	return (2 * 100 / 13) + p * (5 * 100 / 13); 
}
s3 = {};
s3 = {};
s3.tStart = 7;
s3.duration = 3;
s3.behaviour = function(p) {
	return (7 * 100 / 13) + p * (3 * 100 / 13); 
}
s4 = {};
s4 = {};
s4.tStart = 10;
s4.duration = 3;
s4.behaviour = function(p) {
	return (10 * 100 / 13) + p * (3 * 100 / 13); 
}

a1.segments = [];
a1.segments.push(s1);
a1.segments.push(s2);
a1.segments.push(s3);
a1.segments.push(s4);

var a2s = function(actor) {
	return a1.segments;
};

var sampler = new Sampler(a2s);