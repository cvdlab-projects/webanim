              square_t1 = {id:4,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              square_t2 = {id:6,t:"scale",t0: 0,t1: 3000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              square_t3 = {id:5,t:"rotate",t0: 0,t1: 1000,dgx:-180,dgy:0,dgz:0,rx:0,ry:0,rz:0};

              

              tri_t1 = {id:1,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              tri_t2 = {id:2,t:"scale",t0: 4000,t1: 7000,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              tri_t3 = {id:3,t:"rotate",t0:0, t1:1000, dgx:90,dgy:20,dgz:0,rx:0,ry:0,rz:0};



              ct1 = {id:7,t:"translate",t0: 0,t1: 1000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};

              ct2 = {id:8,t:"scale",t0: 0,t1: 1000,sxf:2,syf:1,szf:1};
              ct3 = {id:9,t:"scale",t0: 500,t1: 1500,sxf:0.5,syf:1,szf:1};
              ct4 = {id:10,t:"translate",t0: 3000,t1: 6000,dxf:0,dyf:0,dzf:5};
              ct5 = {id:11,t:"scale",t0: 700,t1: 1100,sxf:0.5,syf:1,szf:1};

              ct6 = {id:12,t:"scale",t0: 2501,t1: 3000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct7 = {id:13,t:"scale",t0: 3001,t1: 3500,x:0.5,y:0.5,z:0.5,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct8 = {id:14,t:"scale",t0: 3501,t1: 4000,x:2,y:2,z:2,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct9 = {id:15,t:"scale",t0: 4001,t1: 4500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct10= {id:16,t:"scale",t0: 4501,t1: 5000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct11= {id:17,t:"scale",t0: 5001,t1: 5500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct12= {id:18,t:"scale",t0: 5501,t1: 6000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct13= {id:19,t:"rotate",t0:0, t1:6010, dgx:360,dgy:360,dgz:360,rx:0,ry:0,rz:0};
              ct14= {id:20,t:"translate",t0: 500,t1: 1000,dxf:0,dyf:0,dzf:5,dx:0,dy:0,dz:0};
              ct15= {id:21,t:"translate",t0: 1000,t1: 1500,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};

              var struct3 = {id:3,obj:0,n:4,transitions: [ct2,ct3],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};


var anims = [struct3];


function indexOfTransition(array,obj){

	for(var i in array){
		var a = array[i];
		if(obj["id"] === a["id"])
			return i;

	}

	return -1;

}

 function  arrayClone(arr){
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

function existsID(arrays,n){
	for(var i in arrays){
		var array = arrays[i];
		if(exists(array,n)){
			return true;
		}
	
	}
	return false;
	
}

function generateID(arrays){
	var randomnumber=Math.floor(Math.random()*100000);
	while(existsID(arrays,randomnumber)){
		randomnumber=Math.floor(Math.random()*100000);
	}
	return randomnumber;
}


function eliminaTransizioniConStessoInizio(array,t0){

	
	var ret = array.filter(function(item){
		return (item.t0 !== t0);
	}); 

	return ret;
			

	}



function sovrapponiEffetti(animations){

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

					var delta = (transizione.t1 - transizione.t0);

					var sxf = transizione.sxf;
					var syf = transizione.syf;
					var szf = transizione.szf;

					transizione.startingx = sxf;
					transizione.startingy = syf;
					transizione.startingz = szf;

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

					var ndelta = nxtStop - tt.t0;

					var incrx = tt.startingx - 1;
					var incry = tt.startingy - 1;
					var incrz = tt.startingz - 1;

					var sxf,syf,szf;
					if(incrx !== 0){
						sxf = (incrx*(ndelta/1000))+1;
					}
					else{
						sxf = 1;
					}
					if(incry !== 0){
						sxf = (incry*(ndelta/1000))+1;
					}
					else{
						syf = 1;
					}
					if(incrz !== 0){
						szf = (incrz*(ndelta/1000))+1;
					}
					else{
						szf = 1;
					}

					var id1 = generateID([nRotate,nTranslate,nScale]);

					divide1 = {id:id1,t:"scale",t0: tt["t0"],t1: nxtStop,sxf:sxf,syf:syf,szf:szf,startingx:tt.startingx,startingy:tt.startingy,startingz:tt.startingz,startingdelta:tt.startingdelta};


					var ndelta = tt.t1 - nxtStop;

					var incrx = tt.startingx - 1;
					var incry = tt.startingy - 1;
					var incrz = tt.startingz - 1;

					var sxf,syf,szf;
					if(incrx !== 0){
						sxf = (incrx*(ndelta/1000))+1;
					}
					else{
						sxf = 1;
					}
					if(incry !== 0){
						sxf = (incry*(ndelta/1000))+1;
					}
					else{
						syf = 1;
					}
					if(incrz !== 0){
						szf = (incrz*(ndelta/1000))+1;
					}
					else{
						szf = 1;
					}

					var id2 = generateID([nRotate,nTranslate,nScale]);

					divide2 = {id:id2,t:"scale",t0: nxtStop,t1: tt["t1"],sxf:sxf,syf:syf,szf:szf,startingx:tt.startingx,startingy:tt.startingy,startingz:tt.startingz,startingdelta:tt.startingdelta};


				}
				if(nxtStop === tt.t1){
					var id1 = generateID([nRotate,nTranslate,nScale]);
					divide1 = {id:id1,t:"scale",t0: tt["t0"],t1: tt["t1"],sxf:tt["sxf"], syf:tt["syf"], szf:tt["szf"],startingx:tt.startingx,startingy:tt.startingy,startingz:tt.startingz,startingdelta:tt.startingdelta};
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

					
					var newObj = {id:(transizione["id"]),t:"translate",t0: t0,t1: t1,dxf:sumx,dyf:sumy,dzf:sumz};
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

					
					var newObj = {id:(transizione["id"]),t:"rotate",t0: t0,t1: t1,dgx:sumx,dgy:sumy,dgz:sumz};
					mergeRotate.push(newObj);
					trs = eliminaTransizioniConStessoInizio(trs,t0);	

				}


				if(transizione.t === "scale"){

					if(transizione.t === "scale" && stessoInizio.length >1){
					var sumx = 1;
					var sumy = 1;
					var sumz = 1;
					

					for(var j in stessoInizio){
						var tr = stessoInizio[j];

						

						var propx = tr.startingx/(tr.startingdelta/1000);
						var propy = tr.startingy/(tr.startingdelta/1000);
						var propz = tr.startingz/(tr.startingdelta/1000);

						if(tr.startingx === 1){
							propx = 1;	
						}
							
						if(tr.startingy === 1){
							propy = 1;	
						}
							
						if(tr.startingz === 1){
							propy = 1;	
						}
							
						
						sumx *= propx;
						sumy *= propy;
						sumz *= propz;

					}


					
					var newObj = {id:(transizione["id"]),t:"scale",t0: t0,t1: t1,sxf:sumx,syf:sumy,szf:sumz};
					mergeScale.push(newObj);
					trs = eliminaTransizioniConStessoInizio(trs,t0);	

				}
				else{

					if(stessoInizio.length === 1){
						var newObj = {id:(transizione["id"]),t:"scale",t0: t0,t1: t1,sxf:transizione.sxf,syf:transizione.syf,szf:transizione.szf};
						mergeScale.push(newObj);
						trs = eliminaTransizioniConStessoInizio(trs,t0);

					}

					
				}




			}

				}

				
		}

		merge(nTranslate);
		merge(nRotate);
		merge(nScale);


		obj.transitions = [];
		obj["transitions"] = obj["transitions"].concat(mergeTranslate);	
		obj["transitions"] = obj["transitions"].concat(mergeRotate);	
		obj["transitions"] = obj["transitions"].concat(mergeScale);	


			
	}

}