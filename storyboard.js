function Node (number, t, T, tm) {
	this.number = number;
	this.t = t || 0;
	this.T = T || 0;
	this.tm = tm || 0;
}

Node.prototype.sett = function (t) {
	this.t = t;
}

Node.prototype.setT = function (T) {
	this.T = T;
}

Node.prototype.setTm = function (tm) {
	this.tm = tm;
}

function Edge (from, to, value, actor, event) {
	this.from = from;
	this.to = to;
	this.value = value;
	this.actor = actor; // oggetto che si sposta
	this.event = event; // azione che deve avvenire
}

function Graph (nodes, edges) {
	this.nodes = nodes;
	this.sortNodes();
	this.edges = edges;
}

Graph.prototype.addEdge = function (edge) {
	this.edges.push(edge);
	return this.edges;
}


Graph.prototype.sortNodes = function () {
	function compare (node1, node2) {
		return node1.number - node2.number;
	}
	this.nodes.sort(compare);
}


Graph.prototype.addNode = function (node) {
	this.nodes.push(node);
	this.sortNodes();
	return this.nodes;
}

function Segment (actor, event, start, end) {
	this.actor = actor; // per il momento è una stringa, ma sarà un oggetto 2D o 3D
	this.event = event; // per il momento è una stringa, ma sarà un'azione
	this.start = start;
	this.end = end;
}


var mintime = function (graph, node) {
	var predecessori = graph.edges.filter(function (item, index) {
		return (item.to === node);
	});
	if(predecessori.length === 0) {
		node.sett(0);
		return node.t; 
	}
	var pool = [];
	predecessori.forEach(function (item, index) {
		var pnode = item.from;
		var Tik = item.value;
		var t = mintime(graph, pnode);
		var tk = t + Tik;
		pool.push(tk);
	})
	var result = Math.max.apply(Math, pool);
	node.sett(result);
	return node.t;
}


var maxtime = function (graph, node) {
	var successori = graph.edges.filter(function (item, index) {
		return (item.from === node);
	});
	if(successori.length === 0) {
		node.setT(node.t);
		return node.T; 
	}
	var pool = [];
	successori.forEach(function (item, index) {
		var pnode = item.to;
		var Tki = item.value;
		var T = maxtime(graph, pnode);
		var Tk = T - Tki;
		pool.push(Tk);
	})
	var result = Math.min.apply(Math, pool);
	node.setT(result);
	return node.T;
}

/* Si assumono come nodo sorgente e nodo pozzo, rispettivamente,
i nodi con number più piccolo e più grande */
Graph.prototype.mintime = function () {
	var last = this.nodes.length - 1;
	return mintime(this,this.nodes[last]);
}

/* Nel caso si voglia specificare quale sia il nodo pozzo */
Graph.prototype.mintime = function (node) {
	return mintime(this,node);
}

Graph.prototype.maxtime = function () {
	return maxtime(this,this.nodes[0]);
}

/* Nel caso si voglia specificare quale sia il nodo sorgente */
Graph.prototype.maxtime = function (node) {
	return maxtime(this,node);
}

Graph.prototype.meantime = function () {
	this.nodes.forEach(function (item, index) {
		var tm = (item.t + item.T)/2;
		item.setTm(tm);
	}); 
}

Graph.prototype.computeCPM = function () {
	this.mintime();
	this.maxtime();
	this.meantime();
}

Graph.prototype.computeCPM = function (source, target) {
	this.mintime(target);
	this.maxtime(source);
	this.meantime();
	var timeline = [];
	this.edges.forEach(function (item, index) {
		var start = item.from.tm;
		var end = item.to.tm;
		var segment = new Segment(item.actor, item.event, start, end);
		timeline.push(segment);
	})
	timeline.sort(function (segment1, segment2) {
		return segment1.start - segment2.start;
	});
	return timeline;
}