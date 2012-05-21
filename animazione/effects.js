
var ct13 = {id:19,t:"rotate",t0:0, t1:6000, dgx:360,dgy:360,dgz:360,rx:0,ry:0,rz:0,rrx:0,rry:0,rrz:0};
var ct14 = {id:21,t:"rotate",t0:3000, t1:9000, dgx:-360,dgy:-360,dgz:-360,rx:0,ry:0,rz:0,rrx:0,rry:0,rrz:0};

var ct9 = {id:15,t:"scale",t0: 1000,t1: 2000,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
var ct10= {id:16,t:"scale",t0: 1500,t1: 3500,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};


var square_t1 = {id:4,t:"translate",t0: 0,t1: 5000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};
var tri_t1 = {id:1,t:"translate",t0: 2500,t1: 7500,dxf:0,dyf:0,dzf:5,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};
var tri_t2 = {id:6,t:"translate",t0: 1000,t1: 7500,dxf:0,dyf:0,dzf:3,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};

var struct1 = {id:1,obj:0,n:5,transitions: [ct9,ct10],x0:-1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
var animations = [struct1];


var indexOfTransition = function(array,obj){

	for(var i in array){
		var a = array[i];
		if(obj["id"] === a["id"])
			return i;

	}

	return -1;

}

var arrayClone = function(arr){
	var ret=[];
	for(var i in arr){
		ret.push(arr[i]);
	}
	return ret;
}

function exists(array, n){
	var l = array.filter(function(item){
		return (item["id"] === n);
	});
	if(l.length >=1)
		return true;
	return false;
}

var existsID = function(arrays,n){
	for(var i in arrays){
		var array = arrays[i];
		if(exists(array,n)){
			return true;
		}
	
	}
	return false;
	
}

var generateID = function(arrays){
	var randomnumber=Math.floor(Math.random()*100000);
	while(existsID(arrays,randomnumber)){
		randomnumber=Math.floor(Math.random()*100000);
	}
	return randomnumber;
}


var eliminaTransizioniConStessoInizio = function(array,t0){

	
	var ret = array.filter(function(item){
		return (item.t0 !== t0);
	}); 

	return ret;
			

	}



var sovrapponiEffetti = function(animations){

	for(var i in animations){

		var obj = animations[i];
		var model = obj.obj;
		var transitions = obj.transitions;

		var nTranslate = [];
		var nScale = [];
		var nRotate = [];

		var mergeTranslate = [];
		var mergeScale = [];
		var mergeRotate = [];

		//array filter
		var translate = transitions.filter(function(item,index,array){
			return (item.t === "translate");

		});
		var rotate = transitions.filter(function(item,index,array){
			return (item.t === "rotate");

		});
		var scale = transitions.filter(function(item,index,array){
			return (item.t === "scale");

		});

		//sort arrays by t0
		var compare = function(v1,v2){

			if(v1.t0 === v2.t0)
				return  (v2.t1 -v2.t0)-(v1.t1 - v1.t0);
			return (v1.t0 - v2.t0);

		}


		var setDeltas = function(transizioni){

			for(var i in transizioni){
				var transizione = transizioni[i];

				if(transizione.t === "translate"){

					var delta = (transizione.t1 - transizione.t0)/1000;

					var ddx = transizione.dxf / delta;
					var ddy = transizione.dyf / delta;
					var ddz = transizione.dzf / delta;

					transizione.ddx = ddx;
					transizione.ddy = ddy;
					transizione.ddz = ddz;




				}

				if(transizione.t === "rotate"){

					var delta = (transizione.t1 - transizione.t0)/1000;

					var rrx = transizione.dgx / delta;
					var rry = transizione.dgy / delta;
					var rrz = transizione.dgz / delta;

					transizione.rrx = rrx;
					transizione.rry = rry;
					transizione.rrz = rrz;




				}

				if(transizione.t === "scale"){

					var delta = (transizione.t1 - transizione.t0)/1000;

					var x = transizione.x;
					var y = transizione.y;
					var z = transizione.z;

					transizione.startingx = x;
					transizione.startingy = y;
					transizione.startingz = z;

					transizione.startingdelta = delta;




				}


			}
		}

		setDeltas(translate);
		setDeltas(rotate);
		setDeltas(scale);

		translate.sort(compare);
		scale.sort(compare);
		rotate.sort(compare);

		var nextStop = function(transizione,arr){
			var min = 100000;
			var id = transizione["id"];
			for(var i in arr){
				var tr = arr[i];
				if(tr["id"] !== id){
					if(tr.t0 < min && tr.t0 !== transizione.t0)
						min = tr.t0;
					if(tr.t1 < min)
						min = tr.t1;
				}

			}
			if(min > transizione.t1)
				min = transizione.t1;

			return min;
		}


		//TRANSLATE

		var i = 0;
		while(translate.length >= 1){
			var divide1 , divide2;
			

			translate.sort(compare);

			var tt = translate[0];

			var ultimo = false;
			var solo = false;


			var nxtStop = nextStop(tt,translate);

			var dividi = function(tt,nxtStop){
				if (nxtStop < tt.t1){

					var ndelta = nxtStop - tt.t0;
					var dxf = (ndelta/1000) * tt.ddx;
					var dyf = (ndelta/1000) * tt.ddy;
					var dzf = (ndelta/1000) * tt.ddz;
					var id1 = generateID([nTranslate]);

					divide1 = {id:id1,t:"translate",t0: tt["t0"],t1: nxtStop,dxf:dxf, dyf:dyf, dzf:dzf, dx:tt.dx,dy:tt.dy, dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};
					
					var ndelta = tt.t1 - nxtStop;
					var dxf = (ndelta/1000) * tt.ddx;
					var dyf = (ndelta/1000) * tt.ddy;
					var dzf = (ndelta/1000) * tt.ddz;
					var id2 = generateID([nTranslate]);

					divide2 = {id:id2,t:"translate",t0: nxtStop,t1: tt["t1"],dxf:dxf,dyf:dyf,dzf:dzf,dx:tt.dx,dy:tt.dy,dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};


				}
				if(nxtStop === tt.t1){
					var id1 = generateID([nTranslate]);
					divide1 = {id:id1,t:"translate",t0: tt["t0"],t1: tt["t1"],dxf:tt["dxf"],dyf:tt.dyf,dzf:tt.dzf,dx:tt.dx,dy:tt.dy,dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};
					solo = true;
					
						
				}

				if(solo){
				nTranslate.push(divide1);
				solo = false;
			}
			else{
				nTranslate.push(divide1);
				translate.push(divide2);
			}

			var index = indexOfTransition(translate,tt);
			tt = translate.splice(index,1);



			i+=1;



			}(tt,nxtStop);






			

			//se nell'array è rimasto solo l'ultimo

			

			

		}





		// ROTATE

		var i = 0;
		while(rotate.length >= 1){
			var divide1 , divide2;
			

			rotate.sort(compare);

			var tt = rotate[0];

			var ultimo = false;
			var solo = false;


			var nxtStop = nextStop(tt,rotate);

			var dividi = function(tt,nxtStop){
				if (nxtStop < tt.t1){

					var ndelta = nxtStop - tt.t0;
					var dgx = (ndelta/1000) * tt.rrx;
					var dgy = (ndelta/1000) * tt.rry;
					var dgz = (ndelta/1000) * tt.rrz;
					var id1 = generateID([nRotate,nTranslate]);

					divide1 = {id:id1,t:"rotate",t0: tt["t0"],t1: nxtStop,dgx:dgx, dgy:dgy, dgz:dgz, rx:tt.rx, ry:tt.ry, rz:tt.rz, rrx:tt["rrx"], rry:tt["rry"], rrz:tt["rrz"]};


					var ndelta = tt.t1 - nxtStop;
					var dgx = (ndelta/1000) * tt.rrx;
					var dgy = (ndelta/1000) * tt.rry;
					var dgz = (ndelta/1000) * tt.rrz;
					var id2 = generateID([nRotate,nTranslate]);

					divide2 = {id:id2,t:"rotate",t0: nxtStop,t1: tt["t1"], dgx:dgx, dgy:dgy, dgz:dgz, rx:tt.rx, ry:tt.ry, rz:tt.rz, rrx:tt["rrx"], rry:tt["rry"], rrz:tt["rrz"]};


				}
				if(nxtStop === tt.t1){
					var id1 = generateID([nRotate,nTranslate]);
					divide1 = {id:id1,t:"rotate",t0: tt["t0"],t1: tt["t1"],dgx:tt["dgx"], dgy:tt["dgy"], dgz:tt["dgz"], rx:tt.rx, ry:tt.ry, rz:tt.rz, rrx:tt["rrx"], rry:tt["rry"], rrz:tt["rrz"]};
					solo = true;
					
						
				}

				if(solo){
				nRotate.push(divide1);
				solo = false;
			}
			else{
				nRotate.push(divide1);
				rotate.push(divide2);
			}

			var index = indexOfTransition(rotate,tt);
			tt = rotate.splice(index,1);



			i+=1;



			}(tt,nxtStop);			

			//se nell'array è rimasto solo l'ultimo

			

			

		}

		//SCALE

			var i = 0;
		while(scale.length >= 1){
			var divide1 , divide2;
			

			scale.sort(compare);

			var tt = scale[0];

			var ultimo = false;
			var solo = false;


			var nxtStop = nextStop(tt,scale);

			var dividi = function(tt,nxtStop){
				if (nxtStop < tt.t1){

					var ndelta = nxtStop - tt.t0;/*
					var dgx = (ndelta/1000) * tt.rrx;
					var dgy = (ndelta/1000) * tt.rry;
					var dgz = (ndelta/1000) * tt.rrz;*/

					
					var id1 = generateID([nRotate,nTranslate,nScale]);

					divide1 = {id:id1,t:"scale",t0: tt["t0"],t1: nxtStop,x:1, y:1, z:1, sx:tt.sx, sy:tt.sy, sz:tt.sz, osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};

					var ndelta = tt.t1 - nxtStop;/*
					var dgx = (ndelta/1000) * tt.rrx;
					var dgy = (ndelta/1000) * tt.rry;
					var dgz = (ndelta/1000) * tt.rrz;*/
					var id2 = generateID([nRotate,nTranslate,nScale]);

					divide2 = {id:id2,t:"scale",t0: nxtStop,t1: tt["t1"], x:1, y:1, z:1, sx:tt.sx, sy:tt.sy, sz:tt.sz, osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};


				}
				if(nxtStop === tt.t1){
					var id1 = generateID([nRotate,nTranslate,nScale]);
					divide1 = {id:id1,t:"scale",t0: tt["t0"],t1: tt["t1"],x:1, y:1, z:1, sx:tt.sx, sy:tt.sy, sz:tt.sz, osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
					solo = true;
					
						
				}

				if(solo){
				nScale.push(divide1);
				solo = false;
			}
			else{
				nScale.push(divide1);
				scale.push(divide2);
			}

			var index = indexOfTransition(scale,tt);
			tt = scale.splice(index,1);



			i+=1;



			}(tt,nxtStop);



		}
		console.log(nScale);


		var merge = function(transizioni){

			var trs = arrayClone(transizioni);

			for(var i in transizioni){
				var transizione = transizioni[i];
				var t0 = transizione.t0;
				var t1 = transizione.t1;

				var stessoInizio = trs.filter(function(item){
					return item.t0 === t0;
				});

				if(transizione.t === "translate" && stessoInizio.length >=1){
					var sumx = 0;
					var sumy = 0;
					var sumz = 0;
					for(var j in stessoInizio){
						var tr = stessoInizio[j];
						sumx += tr.dxf;
						sumy += tr.dyf;
						sumz += tr.dzf;

					}

					
					var newObj = {id:(transizione["id"]),t:"translate",t0: t0,t1: t1,dxf:sumx,dyf:sumy,dzf:sumz,dx:0,dy:0,dz:0};
					mergeTranslate.push(newObj);
					trs = eliminaTransizioniConStessoInizio(trs,t0);	

				}

				if(transizione.t === "rotate" && stessoInizio.length >=1){
					var sumx = 0;
					var sumy = 0;
					var sumz = 0;
					for(var j in stessoInizio){
						var tr = stessoInizio[j];
						sumx += tr.dgx;
						sumy += tr.dgy;
						sumz += tr.dgz;

					}

					
					var newObj = {id:(transizione["id"]),t:"rotate",t0: t0,t1: t1,dgx:sumx,dgy:sumy,dgz:sumz,rx:0,ry:0,rz:0};
					mergeRotate.push(newObj);
					trs = eliminaTransizioniConStessoInizio(trs,t0);	

				}




			}
		}

		merge(nTranslate);
		merge(nRotate);


		obj.transitions = [];
		obj["transitions"] = obj["transitions"].concat(mergeTranslate);	
		obj["transitions"] = obj["transitions"].concat(mergeRotate);	

			
	}

};