var Grafo = function(n){ //numero nodi

	//creo un grafo vuoto...altre soluzioni??
	this.grafo = new Array(n);
	for (var k = 0; k < n; k++){
		this.grafo[k]= new Array(n);
	}
	
	//lo riempio con tutti "0"
	
	for (var l = 0; l< n; l++){
		for (var m= 0; m < n; m++){
			this.grafo[l][m]=0;
		}
	}
	
	//imposto il numero di nodi
	this.n=n;

}

Grafo.prototype.addNode = function(n1,n2,value){
	this.grafo[n1][n2]= value;
}



Grafo.prototype.max_time = function () {
	var time = new Array(this.n);
	for (var k = 0; k < this.n; k++){
		time[k]= new Array(this.n);
	}
	
		
	//inizializzo l'array delle distanze con i pesi degli archi del grafo
	for (var l = 0; l < this.n; l++) {
		for (var m= 0;  m< this.n; m++) {
			time[l][m]=this.grafo[l][m];	
		}
	}

	//k valore intermedio
	//i e j indici
	for ( var k = 0; k < this.n; ++k ) {
		for ( var i = 0; i < this.n; ++i) {
	      	for ( var j = 0; j < this.n; ++j ) {
		        if ((time[i][k] * time[k][j] != 0) && (i != j)) {
		        	//trovo il massimo tra tutti gli archi entranti nel nodo j
		            if ((time[i][k] + time[k][j] > time[i][j]) ||(time[i][j] == 0)) {
		                time[i][j] = time[i][k] + time[k][j];
		            }
		        }
			}
		}
	}

	return time;
}



Grafo.prototype.min_time = function () {
	var time = new Array(this.n);
	for (var k = 0; k < this.n; k++){
		time[k]= new Array(this.n);
	}
		
	for (var l = 0; l < this.n; l++) {
		for (var m= 0;  m< this.n; m++) {
			time[l][m]=this.grafo[l][m];	
		}
	}
	for ( var k = 0; k < this.n; ++k ) {
		for ( var i = 0; i < this.n; ++i) {
	      	for ( var j = 0; j < this.n; ++j ) {
		        if ((time[i][k] * time[k][j] != 0) && (i != j)) {
		            if ((time[i][k] + time[k][j] < time[i][j]) ||(time[i][j] == 0)) {
		                time[i][j] = time[i][k] + time[k][j];
		            }
		        }
			}
		}
	}

	return time;
}





//oppure


//funzione di ordine superiore

var min_time = function (n) {
	return function(grafo){
		var time = new Array(n);
		for (var k = 0; k < n; k++){
			time[k]= new Array(n);
		}
			
		for (var l = 0; l < n; l++) {
			for (var m= 0;  m< n; m++) {
				time[l][m]=this.grafo[l][m];	
			}
		}
		for ( var k = 0; k < n; ++k ) {
			for ( var i = 0; i < n; ++i) {
		      	for ( var j = 0; j < n; ++j ) {
			        if ((time[i][k] * time[k][j] != 0) && (i != j)) {
			            if ((time[i][k] + time[k][j] < time[i][j]) ||(time[i][j] == 0)) {
			                time[i][j] = time[i][k] + time[k][j];
			            }
			        }
				}
			}
		}
		return time;
	}
	
}
