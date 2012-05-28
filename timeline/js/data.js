/* example of timelineData to return*/

var timelineData = [
	{
		id: 1, name: "Actor", series: [
			{ name: "s1", start: 3, end: 10 },
			{ name: "s2", start: 23, end: 50 }
		]
	}, 
	{
		id: 2, name: "Actor", series: [
			{ name: "s1", start: 10, end: 11 },
			{ name: "s2", start: 20, end: 30 },
			{ name: "s3", start: 33, end: 90 }
		]

	}
];


/*
function Actor (Id, Series){
	this.name = "Actor "+ Id;
	this.id = Id;
	this.series = Series;
}

function Serie (Name, t_start, t_duration){
	this.name = Name;
	this.start = t_start;
	this.end = t_start + duration;
}
*/
/* @acts = actors array*/
/*
function createTimelineData(acts){
	var timelineData = [];
	for(var i=0; i<acts.length; i++){ //attori
		var segments = a2s(i);//a2s(id_attore) ...return array segments
		var series = [];
		for(var j=0; j<segments.length;j++){
			series[j] = new Serie("s"+j, segments[j].tStart, segments[j].duration);
		}
		//creo un Actor
		var act = new Actor(i, series);
		//aggiungo l' oggetto al TimelineData
		timelineData[i] = act;
	}
	return timelineData;
}
*/