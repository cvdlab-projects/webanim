var Grafo = function(n)
{
	this.grafo = new Array(n);
	
	for (var k = 0; k < n; k++)
	this.grafo[k]= new Array(n);
	
	
	for (var l = 0; l< n; l++){
	for (var m= 0; m < n; m++)
	this.grafo[l][m]=0;
	}
	
	this.n=n;
	
	//this.grafo = [[]];
}

Grafo.prototype.addNode = function(n1,n2,value){
	this.grafo[n1][n2]= value;
}



Grafo.prototype.max_dist = function () {
		var dist = new Array(this.n);
		for (var k = 0; k < this.n; k++)
		dist[k]= new Array(this.n);
		
		for (var l = 0; l < this.n; l++)
			for (var m= 0;  m< this.n; m++)
			{
				dist[l][m]=this.grafo[l][m];
				
			}
				

	for ( var k = 0; k < this.n; ++k )
		   for ( var i = 0; i < this.n; ++i)
	      		for ( var j = 0; j < this.n; ++j ){
		            if ((dist[i][k] * dist[k][j] != 0) && (i != j))
		                if ((dist[i][k] + dist[k][j] > dist[i][j]) ||(dist[i][j] == 0))
		                    dist[i][j] = dist[i][k] + dist[k][j];
	}

	


	return dist;
}



Grafo.prototype.min_dist = function () {
		var dist = new Array(this.n);
		for (var k = 0; k < this.n; k++)
		dist[k]= new Array(this.n);
		
		for (var l = 0; l < this.n; l++)
			for (var m= 0;  m< this.n; m++)
			{
				dist[l][m]=this.grafo[l][m];
				
			}
	for ( var k = 0; k < this.n; ++k )
		   for ( var i = 0; i < this.n; ++i)
	      		for ( var j = 0; j < this.n; ++j ){
		            if ((dist[i][k] * dist[k][j] != 0) && (i != j))
		                if ((dist[i][k] + dist[k][j] < dist[i][j]) ||(dist[i][j] == 0))
		                    dist[i][j] = dist[i][k] + dist[k][j];
	}
	return dist;
}
