function Node (number, t, T) {
	this.number = number;
	this.t = t || 0;
	this.T = T || 0;
}

Node.prototype.sett = function (t) {
	this.t = t;
}

Node.prototype.setT = function (T) {
	this.T = T;
}

function Edge (from, to, value) {
	this.from = from;
	this.to = to;
	this.value = value;
}

function Graph (nodes,edges) {
	this.nodes = nodes;
	this.edges = edges;
}

Graph.prototype.addEdge = function (edge) {
	this.edges.push(edge);
	return this.edges;
}

Graph.prototype.addNode = function (node) {
	this.nodes.push(node);
	return this.nodes;
}


var mintime = function (graph, node) {
	var predecessori = graph.edges.filter(function(item, index) {
		return (item.to == node);
	});
	if(predecessori.length == 0) {
		node.sett(0);
		return node.t; 
	}
	var pool = [];
	predecessori.forEach(function(item, index) {
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
	var successori = graph.edges.filter(function(item, index) {
		return (item.from == node);
	});
	if(successori.length == 0) {
		node.setT(node.t);
		return node.T; 
	}
	var pool = [];
	successori.forEach(function(item, index) {
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


Graph.prototype.mintime = function () {
	var last = this.nodes.length - 1;
	return mintime(this,this.nodes[last]);
}

Graph.prototype.maxtime = function () {
	return maxtime(this,this.nodes[0]);
}


