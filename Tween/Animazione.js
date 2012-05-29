var Animazione = function (obj) {
	
	
	
	this.x0 = obj.x0;
	this.y0 = obj.y0;
	this.z0 = obj.z0
	
	this.dx = obj.dx || 0;
	this.dy = obj.dy || 0;
	this.dz = obj.dz || 0;
	
	this.sx = obj.sx || 1;
	this.sy = obj.sy || 1;
	this.sz = obj.sz || 1;
	
	this.rx = obj.rx || 0;
	this.ry = obj.ry || 0;
	this.rz = obj.rz || 0;
	
	this.mesh = obj.mesh;
	
	this.transizioni = obj.transizioni;
	
	
}

Animazione.prototype.createTweens = function () {
	
	transizioni.createTweens();
	
}