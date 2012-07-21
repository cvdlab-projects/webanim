	var camera, scene, renderer,
	    light,stats,container;

	var cameras = [];

	var animations = [];
	var animationsCopy = [];
	var tweens = [];
	var isanimating = false;
	var ispaused = false;
	var isstopped = false;
	var startTime = 0;
	var endTime = 10000; //modify it
	var isRunning = false;
	var loader;

	var lookAtScene = true;
	
	
	/*
	        t0 = {id:1,t:"translate",t0: 0,t1: 6000,dxf:0,dyf:0,dzf:-500};
			//var t = {id:1,t:"scale",t0: 0,t1: 2000,sxf:0.5,syf:1,szf:1};
			t1 = {id:2,t:"scale",t0: 0,t1: 3000,sxf:0.5,syf:2,szf:2};
			t2 = {id:3,t:"rotate",t0: 0,t1: 6000,dgx:-90,dgy:90,dgz:90};
	        }
			
	        //t1 = {id:2,t:"scale",t0: 0,t1: 1000,sxf:2,syf:2,szf:2};
			anim = {id:i*k+i,obj:mesh,transitions:[t0,t1,t2],x0:-500+(51*j),y0:-500+(51*i),z0:-500+(51*k),dx:0,dy:0,dz:						0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};*/
	
	function stringToInt() {
		
		for(var i in animations){
			var a = animations[i];
			a.id = parseInt(a.id);
			a.z0 = parseInt(a.z0);
			a.x0 = parseInt(a.x0);
			a.y0 = parseInt(a.y0);

			a.dx = parseInt(a.dx);
			a.dy = parseInt(a.dy);
			a.dz = parseInt(a.dz);
			
			a.sx = parseInt(a.sx);
			a.sy = parseInt(a.sy);
			a.sz = parseInt(a.sz);
			
			a.rx = parseInt(a.rx);
			a.ry = parseInt(a.ry);
			a.rz = parseInt(a.rz);
			
			
			for (var j in a.transitions) {
			  	    		var tr = a.transitions[j];
			  	    		
			  	    		
			  	    		tr.t0 = parseInt(tr.t0);
			  	    		tr.t1 = parseInt(tr.t1);
							tr.id = parseInt(tr.id);

			  	    		if(tr.t === "translate"){
			  	    			tr.dxf = parseInt(tr.dxf);
			  	    			tr.dyf = parseInt(tr.dyf);
			  	    			tr.dzf = parseInt(tr.dzf);
			  	    		}

			  	    		if(tr.t === "scale"){
			  	    			tr.sxf = parseInt(tr.sxf);
			  	    			tr.syf = parseInt(tr.syf);
			  	    			tr.szf = parseInt(tr.szf);
			  	    		}

			  	    		if(tr.t === "rotate"){
			  	    			tr.dgx = parseInt(tr.dgx);
			  	    			tr.dgy = parseInt(tr.dgy);
			  	    			tr.dgz = parseInt(tr.dgz);
			  	    		}
			  	    		
			  	    		
			  	    	}



			
		
		}
		
	}
	

	function backwardCalculationRotation(ts,t0){

		var obj = {x:0,y:0,z:0};
		for(var i in ts){
			var t = ts[i];
			if(t.t === "rotate"){
				if(t.t1 <= t0){
				obj.x += ((t.dgx)/180)*Math.PI;
				obj.y += ((t.dgy)/180)*Math.PI;
				obj.z += ((t.dgz)/180)*Math.PI;
				}

			}

		}
		return obj;

	}



		function backwardCalculationScale(ts,t0){

			var obj = {x:1,y:1,z:1};
			for(var i in ts){
				var t = ts[i];
				if(t.t === "scale"){
					if(t.t1 <= t0){
					obj.x *= t.sxf;
					obj.y *= t.syf;
					obj.z *= t.szf;
					}
					
				}
				

			}
			return obj;

		}

		function backwardCalculationTranslation(ts,t0){

			var obj = {x:0,y:0,z:0};
			for(var i in ts){
				var t = ts[i];
				if(t.t === "translate"){
					if(t.t1 <= t0){
					obj.x += t.dxf;
					obj.y += t.dyf;
					obj.z += t.dzf;
					}

				}

			}
			return obj;

		}


		function playFrom(){
			if (!isanimating) {
				if(!ispaused){
					if(startTime === 0){
						meshesStartingState();
						//tweens = [];
						createTweensFromTransitions();
					}
					else{
						startFromSecond(animations,startTime);
						meshesIntermediateState();
						//tweens = [];
						createTweensFromTransitions();
					}

				}
				
			}
		}

		function setupScene(width, height, storyboard){

//			createMeshes();
			//sovrapponiEffetti(animations);
			
			animations = [];
			tweens = [];
			cameras = [];
			animationsCopy = [];
			
		  	init(width, height, storyboard);

		  saveOriginalState();
		  
			isanimating = false;
			ispaused = false;
			TWEEN.removeAll();
		
				if (!isRunning) {
					renderingAnimate();
					
					isRunning = true;
				}
				
			meshesStartingState();
		    

		}

	//	setupScene();

		function pause(){
		  console.log ("PAUSE");
			for (var i in tweens){
				tweens[i].stop();
				ispaused = true;
				isanimating = false;
			}
		}

		function play(){
		  console.log ("PLAY");
			playFrom();
			
			if(!isanimating || ispaused){
				for(var i in tweens){

					tweens[i].start();	
						
				}
				isanimating = true;
			}		
		}

		function rwAnimation(){
		  console.log ("RW");
			stop();
		}

		function ffAnimation(){
		  console.log ("FF");
			startFromSecond(animations,endTime);
			meshesIntermediateState();
			tweens = [];
			startTime = 0;
			isanimating = false;
			ispaused = false;
			TWEEN.removeAll();
			restoreTransitions();
		}

    function gotoFrame (n)
    {
			startFromSecond(animations, n);
			meshesIntermediateState();
			tweens = [];
			startTime = 0;
			isanimating = false;
			ispaused = false;
			TWEEN.removeAll();
			restoreTransitions();
    }

		function stop(){
		  console.log ("STOP");
			for(var i in tweens){

					tweens[i].stop();		
			}	
			isanimating = false;
			ispaused = false;
			TWEEN.removeAll();
			restoreTransitions();
			meshesStartingState();		
			tweens = [];
			startTime = 0;
		}

		function restoreTransitions(){
			for (var i in animations) {
				
				animations[i].x0 = animationsCopy[i].x0;
				animations[i].y0 = animationsCopy[i].y0;
				animations[i].z0 = animationsCopy[i].z0;

				animations[i].id = animationsCopy[i].id;
				
				animations[i].dx = 0;
				animations[i].dy = 0;
				animations[i].dz = 0;

				animations[i].sx = 1;
				animations[i].sy = 1;
				animations[i].sz = 1;

				animations[i].rx = 0;
				animations[i].ry = 0;
				animations[i].rz = 0;

				var transitions = [];

				for (var j in animationsCopy[i].transitions) {
					var tt = animationsCopy[i].transitions[j];
					var obj = {};
					obj.t0 = tt.t0;
					obj.t1 = tt.t1;
					obj.id = tt.id;
					obj.t = tt.t;


					if(tt.t === "translate"){
						obj.dxf = tt.dxf;
						obj.dyf = tt.dyf;
						obj.dzf = tt.dzf;
					}

					if(tt.t === "scale"){
						obj.sxf = tt.sxf;
						obj.syf = tt.syf;
						obj.szf = tt.szf;
					}

					if(tt.t === "rotate"){
						obj.dgx = tt.dgx;
						obj.dgy = tt.dgy;
						obj.dgz = tt.dgz;
					}

					transitions.push(obj);
				}

				animations[i].transitions = transitions;
				
			}

		}

		

		function createTweensFromTransitions(){
			stringToInt();
			for(var i in animations){
				var anim = animations[i];
				for (var j in anim.transitions ){
					t = anim.transitions[j];
					var tween = setupTween(anim,t);
					tweens.push(tween);
				}
			}
		}

	  function __normal (a, b)
	  {
	    return new THREE.Vector3 (a.y * b.z - a.z * b.y,
	                              a.z * b.x - a.x * b.z,
	                              a.x * b.y - a.y * b.x);
	  }

	  // TODO: createMeshes a partire da vertici/indici



      function createMeshesFromStoryboard (storyboard, w, h)
      {
        var actors = [];
        var animation;

        // 1) Colleziono tutti gli attori
        for (var i in storyboard.segments) {

          var segment = storyboard.segments[i];

          var tmpActors = actors.filter (function (element) {
            return element.id === segment.actor.id;
          });
          if (tmpActors.length === 0) {
            actors.push (segment.actor);
          }
        }

        // 2) Per ogni attore processo tutti i suoi segmenti
        for (var i in actors) {

          var actor = actors[i];

          animation = {
            id : actor.id,
            obj : undefined,
            transitions : [],
            x0 : parseFloat(actor.startingConfiguration.tx),
            y0 : parseFloat(actor.startingConfiguration.ty),
            z0 : parseFloat(actor.startingConfiguration.tz),
            dx : 0, dy : 0, dz : 0,
            rx : 0, ry : 0, rz : 0,
            sx : 1, sy : 1, sz : 1
          };

          if (actor.model === "Camera") {
            var camera = new THREE.PerspectiveCamera (45, w / h, 0.1, 10000);
            camera.lookAt (scene.position);
            animation.obj = camera;
            cameras.push (camera);
          } else if (actor.model === "Cube")
            animation.obj = new THREE.Mesh (new THREE.CubeGeometry (50, 50, 50)); // , new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
          else if (actor.model === "Cylinder")
            animation.obj = new THREE.Mesh (new THREE.CylinderGeometry ());
          else if (actor.model === "Icosahedron")
            animation.obj = new THREE.Mesh (new THREE.IcosahedronGeometry ());
          else if (actor.model === "Octahedron")
            animation.obj = new THREE.Mesh (new THREE.OctahedronGeometry ());
          else if (actor.model === "Plane")
            animation.obj = new THREE.Mesh (new THREE.PlaneGeometry ());
          else if (actor.model === "Sphere")
            animation.obj = new THREE.Mesh (new THREE.SphereGeometry ());
          else if (actor.model === "Tetrahedron")
            animation.obj = new THREE.Mesh (new THREE.TetrahedronGeometry ());
          else if (actor.model === "Torus")
            animation.obj = new THREE.Mesh (new THREE.TorusGeometry ());
				else if (actor.model === "Head"){
				loader = new THREE.JSONLoader();
				loader.createModel ( head, function ( geometry ){
					animation.obj = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( { overdraw: true } ) );
				});
				}else
            animation.obj = actor.model; // per input da Web3D

          animation.obj.position.set (actor.startingConfiguration.tx,
                                      actor.startingConfiguration.ty,
                                      actor.startingConfiguration.tz);
          animation.obj.rotation.set (actor.startingConfiguration.rx,
                                      actor.startingConfiguration.ry,
                                      actor.startingConfiguration.rz);
          animation.obj.scale.set (actor.startingConfiguration.sx,
                                   actor.startingConfiguration.sy,
                                   actor.startingConfiguration.sz);

          if (actor.model !== "Camera")
            scene.add (animation.obj);

          for (var j in storyboard.segments) {

            var segment = storyboard.segments[j];

            if (segment.actor.id === actor.id) {

              if (segment.behaviour.position !== undefined) {
                animation.transitions.push ({
                  id : segment.id * 10 + 1,
                  t : "translate",
                  t0 : segment.tStart,
                  t1 : segment.duration,
                  dxf : segment.behaviour.position.x,
                  dyf : segment.behaviour.position.y,
                  dzf : segment.behaviour.position.z
                });
              }

              if (segment.behaviour.rotation !== undefined) {
                animation.transitions.push ({
                  id : segment.id * 10 + 2,
                  t : "rotate",
                  t0 : segment.tStart,
                  t1 : segment.duration,
                  dgx : segment.behaviour.rotation.x,
                  dgy : segment.behaviour.rotation.y,
                  dgz : segment.behaviour.rotation.z
                });
              }

              if (segment.behaviour.scale !== undefined) {
                animation.transitions.push ({
                  id : segment.id * 10 + 3,
                  t : "scale",
                  t0 : segment.tStart,
                  t1 : segment.duration,
                  sxf : segment.behaviour.scale.x,
                  syf : segment.behaviour.scale.y,
                  szf : segment.behaviour.scale.z
                });
              }

              if (segment.behaviour.easing !== undefined) {
                animation["easing"] = eval("TWEEN.Easing."+segment.behaviour.easing);
              }

            }

          }

          animations.push (animation);

        }
      }



	    function createMeshes(){
		
		
		
		for(var k = 0; k<1;k+=1){
				    for (var i = 0;i<10 ;i+=1) {
				    	for(var j =0; j<10;j+=1){
				    		var geometry = new THREE.CubeGeometry( 150, 150, 150 );
					        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
					        var mesh = new THREE.Mesh( geometry, material );

					        var t0,t1,t2;
					        if(j%2 === 0){
					        t0 = {id:1,t:"translate",t0: 0,t1: 12000,dxf:0,dyf:0,dzf:1000};
							//var t = {id:1,t:"scale",t0: 0,t1: 2000,sxf:0.5,syf:1,szf:1};
							t1 = {id:2,t:"scale",t0: 0,t1: 3000,sxf:2,syf:2,szf:2};
							t2 = {id:3,t:"rotate",t0: 0,t1: 6000,dgx:90,dgy:90,dgz:90};
					        }
					        else{
					        t0 = {id:1,t:"translate",t0: 0,t1: 6000,dxf:0,dyf:0,dzf:-500};
							//var t = {id:1,t:"scale",t0: 0,t1: 2000,sxf:0.5,syf:1,szf:1};
							t1 = {id:2,t:"scale",t0: 0,t1: 3000,sxf:0.5,syf:2,szf:2};
							t2 = {id:3,t:"rotate",t0: 0,t1: 6000,dgx:-90,dgy:90,dgz:90};
					        }
							
					        //t1 = {id:2,t:"scale",t0: 0,t1: 1000,sxf:2,syf:2,szf:2};
							anim = {id:i*k+i,obj:mesh,transitions:[t0,t1,t2],x0:-500+(51*j),y0:-500+(51*i),z0:-500+(51*k),dx:0,dy:0,dz:						0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
							animations.push(anim);
				    	}				
					}
				}
		
		
		/*
	    	for(var k = 0; k<1;k+=1){
			    for (var i = 0;i<1 ;i+=1) {
	//				var geometry = new THREE.CubeGeometry( 150, 150, 150 );
	//		        var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
	//		        var mesh = new THREE.Mesh( geometry, material );

	        var geom = new THREE.Geometry ();
	        geom.vertices = [new THREE.Vector3 (0, 0, 0),
	                         new THREE.Vector3 (150, 0, 0),
	                         new THREE.Vector3 (0, 150, 0),
	                         new THREE.Vector3 (0, 0, -150)];
	        // TODO: le normali vanno calcolate sulle differenze, solo in questo caso funziona!!!
	        geom.faces = [new THREE.Face3 (0, 1, 2, __normal (geom.vertices[1], geom.vertices[2])),
	                      new THREE.Face3 (0, 2, 3, __normal (geom.vertices[2], geom.vertices[3])),
	                      new THREE.Face3 (2, 1, 3, __normal (geom.vertices[1], geom.vertices[3])),
	                      new THREE.Face3 (0, 3, 1, __normal (geom.vertices[3], geom.vertices[1]))];
	        var mesh = new THREE.Mesh (geom, new THREE.MeshPhongMaterial( ));

					var t = {id:1,t:"translate",t0: 0,t1: 2000,dxf:0,dyf:0,dzf:500};

					//var t = {id:1,t:"scale",t0: 0,t1: 2000,sxf:0.5,syf:1,szf:1};
					var t1 = {id:2,t:"scale",t0: 0,t1: 1000,sxf:2,syf:1,szf:1,ini:false};
					anim = {id:i*k+i,obj:mesh,transitions: [t],x0:-500+(151*i),y0:151*k,z0:0,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

					animations.push(anim);
				}
			}*/
			
			
	    }


		   function setupTween(obj,transition){

			var easing = obj.easing;
				var updateTranslation	= function(){
					obj.obj.position.x = currentT.x;
					obj.obj.position.y = currentT.y;
					obj.obj.position.z = currentT.z;
				}

				var updateRotation	= function(){
					obj.obj.rotation.x = currentR.x;
					obj.obj.rotation.y = currentR.y;
					obj.obj.rotation.z = currentR.z;
				}

				var updateScale	= function(){
					if(!transition.ini){
						transition.startx = obj.obj.scale.x;
						transition.starty = obj.obj.scale.y;
						transition.startz = obj.obj.scale.z;
						transition.ini = true;
					}
					obj.obj.scale.x = currentS.x;
					obj.obj.scale.y = currentS.y;
					obj.obj.scale.z = currentS.z;
				}

				var type = transition.t;

				var tween = new TWEEN.Tween();

				var currentT = { x: 0,y:0,z:0 };
				var currentR = { x: 0,y:0,z:0 };
				var currentS = { x: 1,y:1,z:1 };
				


				if(type === "translate"){

					var tox = transition["dxf"];
					var toy = transition["dyf"];
					var toz = transition["dzf"];
					var t1 = transition.t1;
					var t0 = transition.t0;
					currentT = backwardCalculationTranslation(obj.transitions,t0);
					currentT.x += obj.x0 + obj.dx;
					currentT.y += obj.y0 + obj.dy;
					currentT.z += obj.z0 + obj.dz;
					var tos = {x:tox+currentT.x,y:toy+currentT.y,z:toz+currentT.z};
					tween	= new TWEEN.Tween(currentT)
						.to(tos, (t1 - t0))
						.delay(t0)
						.easing(easing)
						.onUpdate(updateTranslation);
				}
				



				if(type === "rotate"){
					var tox = (transition.dgx/180)*Math.PI;
					var toy = (transition.dgy/180)*Math.PI;
					var toz = (transition.dgz/180)*Math.PI;
					var t1 = transition.t1;
					var t0 = transition.t0;

					currentR = backwardCalculationRotation(obj.transitions,t0);
					currentR.x += (((obj.rx)/180)*Math.PI);
					currentR.y += (((obj.ry)/180)*Math.PI);
					currentR.z += (((obj.rz)/180)*Math.PI);
					var tos = {x:tox+currentR.x,y:toy+currentR.y,z:toz+currentR.z};

					
					

					tween	= new TWEEN.Tween(currentR)
						.to(tos, (t1 - t0))
						.delay(t0)
						.easing(easing)
						.onUpdate(updateRotation);
				}


				if(type === "scale"){

					var tox = (transition.sxf);
					var toy = (transition.syf);
					var toz = (transition.szf);

					var t1 = transition.t1;
					var t0 = transition.t0;

					currentS = backwardCalculationScale(obj.transitions,t0);
					currentS.x *= obj.sx;
					currentS.y *= obj.sy;
					currentS.z *= obj.sz;

					var tos = {x:tox*currentS.x, y:toy*currentS.y, z:toz*currentS.z};		
					tween	= new TWEEN.Tween(currentS)
						.to(tos, (t1 - t0))
						.delay(t0)
						.easing(easing)
						.onUpdate(updateScale);
				}

				return tween;
				
			}
			
			
	    function meshesStartingState(){

	    	for (var i in animations){
				var obj = animations[i];
				var mesh = obj.obj;

				var x0 = obj["x0"];
				var y0 = obj.y0;
				var z0 = obj.z0;

				var sx0 = obj.sx;
				var sy0 = obj.sy;
				var sz0 = obj.sz;

				var rx0 = obj.rx;
				var ry0 = obj.ry;
				var rz0 = obj.rz;

				obj.dx = 0;
				obj.dy = 0;
				obj.dz = 0;



				mesh.position.x = x0;
				mesh.position.y = y0;
				mesh.position.z = z0;
				
				mesh.scale.x = 1;
				mesh.scale.y = 1;
				mesh.scale.z = 1;

				mesh.rotation.x = 0;
				mesh.rotation.y = 0;
				mesh.rotation.z = 0;
		    }
		}


		function meshesIntermediateState(){

	    	for (var i in animations){
				var obj = animations[i];
				var mesh = obj.obj;

				var x0 = obj["x0"];
				var y0 = obj.y0;
				var z0 = obj.z0;

				var sx0 = obj.sx;
				var sy0 = obj.sy;
				var sz0 = obj.sz;

				var rx0 = obj.rx;
				var ry0 = obj.ry;
				var rz0 = obj.rz;


				




				mesh.position.x = x0+(obj.dx );
				mesh.position.y = y0+(obj.dy);
				mesh.position.z = z0+(obj.dz);

				mesh.scale.x = sx0;
				mesh.scale.y = sy0;
				mesh.scale.z = sz0;

				mesh.rotation.x = (rx0/180)*Math.PI;
				mesh.rotation.y = (ry0/180)*Math.PI;
				mesh.rotation.z = (rz0/180)*Math.PI;
		    }
		}

	    function init(width, height, storyboard) {


	//    	geometry = new THREE.CubeGeometry( 200, 200, 200 );
	//        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

	//        var mesh = new THREE.Mesh( geometry, material );

	  	    //anim  = {id:1,obj:mesh,n:5,transitions: [cube_t1,cube_t4],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

	  	    


//	    	var meshes;

	    


	        scene = new THREE.Scene();

	//        container = document.getElementById( 'container' );
	        //container = $('#container');
	//		document.body.appendChild( container );
	//        var divStats = document.getElementById ('stats');
	        //var divStats = $('#stats');

	        var canvas = document.getElementById("canvas");
	




	//        camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
	//        camera.position.z = 1500;
	//        camera.position.y = 100;
	//        camera.lookAt( scene.position );
	//        scene.add( camera );

        createMeshesFromStoryboard (storyboard, width, height);

//	      if (_meshes === undefined) {

//	        meshes = animations;

//	        cameras[0] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[0].position = {x : 0, y : 0, z : 1500};
//	        cameras[1] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[1].position = {x : 1500, y : 0, z : 0};
//	        cameras[2] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[2].position = {x : 0, y : 0, z : -1500};
//	        cameras[3] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[3].position = {x : -1500, y : 0, z : 0};
//	        cameras[4] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[4].position = {x : 0, y : 1500, z : 0};
//	        cameras[5] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
//	        cameras[5].position = {x : 0, y : -1500, z : 0};

//	        for (var i in cameras)
//	          cameras[i].lookAt ({x : 0, y : 0, z : 0});
//	      } else {

//	        meshes = _meshes;

//	        for (var i in _meshes) {
//	          if (_meshes[i].obj instanceof THREE.PerspectiveCamera) {
//	            _meshes[i].obj.position = {x : 0, y : 0, z : 100}; // TODO: dove si prendono le coordinate iniziali?
//	            cameras.push (_meshes[i].obj);
//	          }
//	        }

//	      }

	        camera = cameras[0];
	        if (camera === undefined)
	          // alert ("Si deve aggiungere almeno una camera!");
	          error("At least one camera must be present in the scene!");
	        scene.add (camera);
	
	        


	        var camera_buttons = $('#camera_buttons');
				camera_buttons.empty();
	        for (var i in cameras) {
	          var i1 = parseInt (i) + 1;
	          camera_buttons.append ('<button onClick="changeCamera (cameras[' + i + '])">Camera ' + i1 + '</button>');
	        }

	//        camera0 = {x:0,y:100,z:1500};

	//        camera90dx = {x:1500,y:100,z:0};


	//        camera90sx = {x:-1500,y:100,z:0};
	//        

	//        camera180 = {x:0,y:100,z:-1500};




//	        for (var i in meshes) {
//	        	var m = meshes[i].obj;
//	        	scene.add( m );

//	        }

	        light = new THREE.DirectionalLight( 0xffffff, 1.5 );
					light.position.set( 0, 1, 1 ).normalize();

			scene.add(light);
			
			//stats = new Stats();
	//		stats.domElement.style.position = 'absolute';
	//		stats.domElement.style.top = '20px';
			//divStats.append ( $(stats.domElement) );

	        
	        

	  renderer = new THREE.WebGLRenderer ({
	    antialias : true,
	    clearAlpha : 1.0,
	    precision : "highp",
	    canvas : canvas
	  });
	  renderer.setSize( width, height );
    //renderer.render (scene, camera);

//	        container.append ( $(renderer.domElement) );

	        //document.addEventListener( 'keypress', onKeyPressEventHandler, false );

	    }

//		document.onkeypress=function(e){


//	    	var e= window.event || e;
//			var keyunicode = e.charCode;

//			var currentPosition = {z:(camera.position.z)};
//			var currentz = camera.position.z;

//			
//			var i = 0;
//			var changeDistance = function(){
//				camera.position.z = currentPosition.z;

//			}



//			if(keyunicode === 43){
//				var tos = {z: (currentz - 500)};
//				var tween = new TWEEN.Tween(currentPosition)
//						.to(tos, 2000)
//						.delay(0)
//						.easing(TWEEN.Easing.Linear.None)
//						.onUpdate(changeDistance);
//				tween.start();
//				}

//			
//			if(keyunicode === 45){
//				var tos = {z: (currentz + 500)};
//				var tween = new TWEEN.Tween(currentPosition)
//						.to(tos, 2000)
//						.delay(0)
//						.easing(TWEEN.Easing.Linear.None)
//						.onUpdate(changeDistance);
//				tween.start();
//				}

//	    }

	    var self = {
	    	f: undefined
	    };


	    function renderingAnimate() {

          
	        requestAnimationFrame( renderingAnimate );
	        render();
	        //stats.update();
	        TWEEN.update();
				if(lookAtScene){
						camera.lookAt(scene.position);
				}
			if(self.f !== null && self.f !== undefined) {
//				console.log(renderer);
				self.f(renderer.context.canvas);
			}
	    }

	    function render() {

	        renderer.render( scene, camera );

	    }

	    function saveOriginalState(){
	    	for(var i in animations){
	  	    	var anim = animations[i];
	  	    	var obj = {};
	  	    	obj.obj = anim.obj;
	  	    	obj.id = anim.id;
	  	    	obj.x0 = anim.x0;
	  	    	obj.y0 = anim.y0;
	  	    	obj.z0 = anim.z0;
	  	    	obj.dx = 0;
	  	    	obj.dy = 0;
	  	    	obj.dz = 0;
	  	    	obj.rx = 0;
	  	    	obj.ry = 0;
	  	    	obj.rz = 0;
	  	    	obj.sx = 1;
	  	    	obj.sy = 1;
	  	    	obj.sz = 1;
	  	    	var trans = [];
	  	    	for (var j in anim.transitions) {
	  	    		var tt = anim.transitions[j];
	  	    		var tr = {};
	  	    		tr.t = tt.t;
	  	    		tr.t0 = tt.t0;
	  	    		tr.t1 = tt.t1;
					tr.id = tt.id;

	  	    		if(tt.t === "translate"){
	  	    			tr.dxf = tt.dxf;
	  	    			tr.dyf = tt.dyf;
	  	    			tr.dzf = tt.dzf;
	  	    		}

	  	    		if(tt.t === "scale"){
	  	    			tr.sxf = tt.sxf;
	  	    			tr.syf = tt.syf;
	  	    			tr.szf = tt.szf;
	  	    		}

	  	    		if(tt.t === "rotate"){
	  	    			tr.dgx = tt.dgx;
	  	    			tr.dgy = tt.dgy;
	  	    			tr.dgz = tt.dgz;
	  	    		}
	  	    		trans.push(tr);
	  	    		
	  	    	}
	  	    	obj.transitions = trans;
	  	    	animationsCopy.push(obj);

	  	    }
	    }


	    function changeCamera(cam){
	//    	 camera.position.x = cam.x;
	//    	 camera.position.y = cam.y;
	//    	 camera.position.z = cam.z;
	//    	 camera.lookAt(scene.position);
	      scene.remove (camera);
	      camera = cam;
	      scene.add (camera);
	    }

		function animateCamera(points){
			var first;
			var prec;
			var succ;
			
			var x0 = 0;
			var y0 = 0;
			var z0 = 3000;
			
			
			spostaPunti(points, {x:x0, y:y0, z:z0});
			
			var oldx,oldy,oldz;
			
			var updatePosition = function () {
				camera.position.x = currentPosition.x;
				camera.position.y = currentPosition.y;
				camera.position.z = currentPosition.z;
				if(lookAtScene){
					camera.lookAt(scene.position);
				}
			}
			
			var tos;
			
			
			var currentPosition = {x:x0, y:y0, z:z0};
			
			if (points.length > 0) {
			
			tos = {x:points[0].x, y:points[0].y, z:points[0].z};			
			}
			else {
				tos = {x:x0, y:y0, z:z0};
				
			}

			
			first = createTween(currentPosition,tos,2500);
										
			
			for(var i = 0; i < points.length ; i+=1){
				
				
				
				
				
				var punto = points[i];
				
				
				
				
				currentPosition = {x:punto.x, y:punto.y, z:punto.z};
				
				if ((i +1) < points.length) {
									
					tos = {x:points[(i+1)].x, y:points[i+1].y, z:points[i+1].z};			
				}
				else {
					tos = {x:punto.x, y:punto.y, z:punto.z};
				}
				
				succ = createTween(currentPosition,tos,1000);
				
				if (i === 0) {
					first.chain(succ);
					
				}
				
				if (i>0) {
					prec.chain(succ);
					
				}
				
				prec = succ;
				
				
				
			}
			
			tweens.push(first);
								
								
								
		}
		
		
		function spostaPunti(points,startPoint) {
				var x = startPoint.x;
				var y = startPoint.y;
				var z = startPoint.z;
				
				for (var i in points) {
					points[i].x = x - points[i].x;
					points[i].y = y - points[i].y;
					points[i].z = z - points[i].z;
				}
				
			
		}
		
		function createTween(point,nextpoint,time){
			
			var updatePosition = function () {
									camera.position.x = current.x;
									camera.position.y = current.y;
									camera.position.z = current.z;
									if(lookAtScene){
										camera.lookAt(scene.position);
									}
								}
			var current = point;
			var to = nextpoint;
			
			var tween = new TWEEN.Tween(current)
													.to(to, time)
													.delay(0)
													.easing(TWEEN.Easing.Linear.None)
													.onUpdate(updatePosition);
													
			return tween;

		
			
		}


function lookAtCenter() {
	if (lookAtScene) {
		lookAtScene = false;
		
	}
	else {
		lookAtScene = true;
	}
	
}


function createTransitionsFromSpline(obj) {
	
	var points = obj.points;
	var startingPosition = obj.start;
	
}



function createCamera(obj) {
	
	var cm = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
	cm.position.x = obj.x0 || 0;
	cm.position.y = obj.y0 || 0;
	cm.position.z = obj.z0 || 1500;
	
	return cm;
	
}

var head = 
{



"metadata": { "formatVersion" : 3, "generatedBy": "Blender 2.58 Exporter" },



"scale" : 100.000000,



"materials": [],



"vertices": [-1306,2788,-842,340,-4515,-1884,1880,1458,-1603,-1576,-3514,21,-1252,-3430,576,1140,-3215,-1095,-2090,-14,-60,536,2907,1208,616,-3931,1094,-1173,57,2084,953,-2417,1942,1591,-3631,-523,464,107,2053,512,2509,-1828,-2124,478,-703,-69,533,-2496,-550,3107,405,-267,-448,-2319,718,-1566,2134,1161,-208,2183,902,7,2230,-371,3110,578,-341,-93,2345,-1623,-648,-1434,-349,1811,-2302,773,-4046,962,-917,1511,-2319,-1860,-509,-1255,-1760,2400,-433,-1843,952,810,-30,-2561,2523,1751,1048,891,-622,-3150,-1419,-1846,-1255,205,539,1483,-2386,-310,-302,2608,-1479,2017,1245,-1117,750,-2369,1182,-1500,2035,296,3081,743,1905,-344,504,864,1950,-2131,-225,2815,-1533,-2141,1024,-1226,-1985,-905,-656,1213,585,-2321,-742,-2050,-1418,-425,-947,2698,62,137,2641,2027,1987,-966,-596,3060,-954,-1972,-226,41,-1317,-145,2084,660,-1856,-1502,1630,-69,-1702,-18,2938,-1349,94,2423,2188,-1264,-3101,-1020,-1165,1586,-2258,548,-1281,-1779,1760,-604,-1220,1876,226,676,-302,-4294,-1849,205,3196,-858,-357,2585,1978,1809,-704,111,90,661,-2519,2047,-127,79,357,3010,922,-112,2322,-2066,1908,49,517,-1936,-1347,166,-427,-3774,1178,-1543,490,-2119,353,87,2077,-697,2735,1462,-5,-1570,2371,-1900,-316,129,-2020,404,393,-2003,-366,-480,-2049,1251,-1167,-1818,-738,32,2195,1744,-143,1131,722,2367,-228,36,2429,448,1806,-2318,-2127,243,-815,74,-2245,-1584,-132,3054,-1189,-1948,803,-1590,-180,300,2541,-2148,607,-542,-97,-4024,1319,-393,473,2452,-1741,1935,608,840,-2226,-1281,-1417,2353,1187,-1500,-267,1966,-995,2432,1628,-1658,2304,511,1383,-1759,-996,375,-2463,-1408,614,3154,-363,-982,768,-2394,-291,-3229,-1519,934,861,2409,311,2121,2230,-81,-302,-2381,-1536,2285,838,268,2894,-1427,-1033,465,2296,2049,-248,-793,741,-1527,2174,-572,170,2089,775,-1392,-1642,-1788,-1322,-822,-1418,-880,-1515,-2002,-158,-68,-186,1760,-2335,-1909,1767,227,1273,158,2086,-1429,-3844,-1269,-115,121,2637,544,42,-2395,-2411,-150,-523,-1519,2032,-1753,-1197,-4432,940,83,3079,-1139,160,-949,2758,2249,1136,-217,-705,2272,2066,813,319,2273,-1666,1123,-2023,2205,127,-236,-1839,-938,-1031,-998,1971,-2142,924,-1950,-1353,-1444,-2376,473,541,-2651,2214,-1539,-668,-1526,2254,256,-854,-88,-1373,-1880,1823,-1268,-391,1145,-2719,1245,-1645,617,-1986,-90,2873,1618,-1178,1284,-2342,1854,-559,-104,1038,61,2042,1807,689,805,-486,-1817,2335,548,-466,2419,-1270,108,2098,-974,-4084,867,2631,-4380,-189,2047,-75,-1129,-2103,1471,-1211,999,2184,1785,1827,-539,504,1979,1049,-1444,280,-2338,-1521,905,-4544,1185,-107,1189,-2487,855,971,-2388,1773,-744,49,607,-2174,-1424,-1484,-2508,371,508,-2340,-1401,42,3210,359,-590,2629,-1710,-1898,-416,328,1227,2926,-575,-976,292,2268,841,-1962,2109,1692,-612,-1382,156,2457,-1947,873,-1389,2183,-1100,-1775,2046,-2267,154,-266,911,-1377,-1613,-1057,2829,534,-2047,1195,60,-1776,1624,773,-4,1110,-2522,1225,-1264,-1515,-1050,-167,2243,1968,49,-16,671,2691,1521,-1161,-301,-2120,609,-1575,2057,1471,-307,1917,-1802,727,973,-1901,447,-1715,1105,-889,-1716,862,2654,1402,2118,1811,-332,-560,3210,-526,1675,-875,-1210,-1047,-2065,-1226,-864,-3084,1125,-24,-1534,2604,-953,-1530,-1494,-1886,2201,-76,1677,1349,-1965,-1014,-2403,1950,-306,-978,-2052,-1564,-1382,-1046,463,-679,2506,-754,-1399,-1639,-1907,-1234,241,766,-173,-2282,-176,2203,-2147,654,38,2120,-1302,-2399,1522,-89,769,2658,1,305,-2452,-46,-3106,1956,-1963,-323,-360,2216,-4548,272,-1091,101,2030,1001,284,2283,62,-3992,1303,-1060,-1316,-1482,-1650,-1865,25,-1891,1552,-1662,-957,-3499,1023,573,2457,1891,903,-321,-2129,-65,-626,-2269,1632,-3636,-30,-607,326,2226,-796,2815,1233,-1702,776,-1886,1062,2599,1356,-1059,-235,2240,-916,-1412,2178,1775,-1225,-69,1151,2364,1418,-624,3147,-97,-685,577,-2471,-629,-2068,-1455,-921,1678,-2275,-177,-1704,-1739,-191,-517,2942,1550,137,1781,1187,1874,-2096,206,-794,3058,2183,1516,-567,-390,126,2097,-2065,1661,-629,1775,-1345,-592,-904,-824,2435,299,-251,2484,1235,2592,1022,-491,-935,-1973,-1148,2865,51,-438,-1025,2485,1872,532,704,214,-232,-2380,528,3000,719,371,-2121,-1567,1828,76,762,-346,3272,-329,134,1738,2508,1518,1860,-1839,2258,925,-510,758,-1154,2324,-533,1603,-2357,-1327,-1418,1987,21,3145,917,-1884,-1107,-851,298,-2493,-1456,-109,2328,2241,43,2392,-2018,-671,3197,-544,1808,-599,596,-1564,1129,-2154,1458,-2047,-863,295,-1034,2548,2219,1364,-18,556,3164,-741,1524,-1868,-808,-59,1751,-2334,-2319,333,-121,1775,2236,-1044,-2112,348,-1333,-213,1565,-2379,363,427,2420,1019,129,2038,1971,2282,-341,378,2910,-1302,-1408,-2422,948,-1230,-2113,-1112,629,-171,2211,-1372,-2551,887,298,177,-2479,1907,740,531,1614,-1896,-534,-763,-1559,2122,-1952,-84,-184,-1949,1810,-1209,2105,1478,-926,-2064,491,118,225,-474,-2275,328,1265,-2442,2011,381,114,1771,-760,757,-1391,-1067,-1355,443,152,2133,722,-294,2283,1779,-439,650,-734,-1540,2038,-1956,2079,-1046,-1568,-1186,1537,-678,-1398,2313,132,-201,2806,2279,674,-622,1712,-303,981,-503,-856,2455,-130,-1346,-1845,-1343,-1853,-1117,221,587,-2519,-980,2944,244,506,3126,-212,1508,-598,-1454,413,2640,-1668,1948,551,-1497,-1317,-663,-1703,-1937,1190,476,258,1546,2519,-1501,176,1947,1711,-1075,275,-656,212,2121,1334,-1844,1613,-1804,2277,219,126,-1087,2984,1956,626,445,-1968,1370,-1497,-2014,41,225,-2404,213,-385,354,3084,516,-88,-1259,2633,2325,340,-330,-1467,-3352,-697,1371,-25,1954,1969,-567,-604,-1866,640,777,-2117,601,-265,-828,-1173,2306,9,-1771,2384,17,-2015,-1627,1903,-1039,-398,-119,1910,-2295,-583,228,2211,-1289,2231,1540,1172,2874,123,-763,-2697,1981,-108,3206,558,-440,-781,-2082,-2032,-240,-638,-1503,390,2043,10,38,-2452,1984,1544,-1233,1826,-790,79,-2364,288,-187,211,-2200,-1562,-828,-1965,-1390,-1025,-1367,2124,1652,2477,-469,-1662,-1729,-735,1865,-678,-73,-1761,-520,-1430,114,-1440,2617,1682,1203,1113,-467,2767,1690,-1667,-1728,169,-304,-1565,2286,-1461,-3043,144,219,-1521,2552,-1983,2049,-933,-172,1945,2387,-280,3122,416,-373,-326,-2373,-1087,63,2043,-958,930,2407,-1758,-1573,-430,-1903,-417,-93,-1194,-608,-1877,465,2273,2118,497,744,2541,212,1771,-2334,-2195,-926,-399,762,-2872,1606,-1299,2616,-1292,1318,-3675,441,642,-1583,2253,1291,90,-2134,784,-1078,2388,-1755,1305,946,1518,-68,1810,-571,-1439,2397,757,2619,-1651,-2106,912,-356,2064,-582,-296,-111,3097,968,-1712,205,-1820,624,1866,2301,-538,1874,-2295,2130,-662,-339,-1137,2583,1333,-1364,903,2140,1021,-140,2226,2229,-69,-349,1147,-1095,2228,-2233,-518,-497,315,762,2568,1932,-526,49,1493,1596,-2077,33,-1532,-1774,598,-1511,2337,1243,-1386,-1329,0,-2271,-1610,-620,28,2207,-1473,-1253,-1237,1289,2669,655,1257,-1713,-1190,-787,-711,-2000,-636,-4341,-1818,-1127,2919,-1030,1068,2799,785,318,2474,2063,778,2746,1350,878,-3170,1015,1359,1198,1995,1709,-110,-1594,-153,2487,2095,1213,-106,2082,-1313,-22,1959,-2039,-1134,-264,811,-2767,1823,-391,-2789,2282,2189,892,-977,1862,-4387,552,-1804,-951,758,1150,2803,-1121,-39,1218,2615,-337,-2079,-1565,-620,-599,-2189,-1356,1971,-1995,-1952,-423,46,-620,873,-2455,1097,2616,1238,508,3048,167,1566,1001,-2077,-1663,-1888,-537,-1268,2887,-579,285,-725,2649,1583,1525,1163,-1894,270,-1675,1865,-4333,-1400,-1568,-3794,-1008,2020,-1125,-305,-1627,-1853,-669,235,-1022,2820,1035,-3452,894,2051,1802,83,156,1017,-2481,-481,3200,-163,318,-2556,2431,1663,-1067,-1056,98,-1410,-1830,-2123,-822,-546,-264,-1506,-1776,1911,927,508,-993,1834,2156,-1612,-1971,-407,1874,1617,-1684,-1766,-1169,-949,-2717,-4377,-469,-649,-1328,-1733,2377,204,-495,1524,-2121,29,-1229,1172,2220,2005,782,-1347,570,203,2115,1924,-372,-134,-1370,-1422,-1227,1388,-3670,-1099,-1858,-711,84,40,1447,-2416,1804,217,-1745,-1888,-1247,-577,-2023,-778,-382,1524,-3358,-51,1098,2987,-472,1614,-1764,179,-25,-1809,2326,-1496,2772,-780,-1349,1278,2052,-1973,1410,319,-2356,-150,-637,42,-102,2819,-1455,-2050,-898,2182,-681,-491,-2196,-244,-550,-1504,1672,1334,1939,-107,-178,-1386,2311,-1691,1762,980,919,-292,2938,-1324,1698,-1219,1079,912,1598,-2291,1925,1007,-1631,-657,-1525,-1625,2742,-4547,-592,-1060,16,2190,-742,2563,1655,1921,-1067,-454,-1535,-2077,461,1321,-332,2117,-386,2935,-1328,887,-3021,1071,-368,768,2568,-598,-2470,2268,-1362,2531,1005,-1838,-653,385,-666,2987,597,-2043,1532,-257,1297,2050,-1908,-788,-1548,2165,-817,2231,1988,1173,0,2078,427,-997,2459,-195,2929,-1329,302,3221,-681,-559,-2341,-1433,64,2652,2008,-1957,-172,-299,-2434,276,-467,-2429,-133,-581,753,-2332,-1268,1288,2643,-1213,-1880,-902,-902,-249,-1321,-1854,-50,-986,-2076,1904,-1016,-543,-488,-4112,1259,-656,2835,-1356,-1095,217,2223,-478,2107,-2168,-301,131,2172,1397,1805,1388,-290,-1530,2534,-1900,-222,478,-216,-2697,-1491,1326,-927,2105,80,-3799,1351,-2033,-25,-1275,-649,450,2350,-2102,1620,-934,-525,-24,2128,-665,2330,2006,-1681,-1806,-483,131,312,2540,990,2957,-1007,-558,-3858,1149,1661,-1556,-717,-324,2726,-1648,-1433,-648,-1654,1806,914,794,1925,-855,40,1801,-240,-1415,-4,-1628,2558,-1982,14,33,55,2926,1525,389,2868,1436,373,-178,-2387,-1920,1748,-1496,-1964,-97,-190,-38,-3525,-1576,675,-454,-2132,-260,-2275,-1570,-1002,-2164,2051,418,115,2097,-1635,2032,853,-1063,743,2429,-940,-323,-2132,-977,-4546,1171,-1576,2654,-513,-2043,117,-382,1023,1717,-2201,-1855,-639,157,124,2696,1849,1031,-25,2179,1772,861,951,-301,-2469,-1481,-770,2950,788,-2119,242,27,-1475,1304,-2231,2043,-214,-670,1573,-1874,-741,2238,1187,-651,-120,-1806,-1692,99,1931,-2286,2077,1108,214,-613,1333,-2405,-1793,-4056,252,-988,216,2246,2041,2079,54,-622,-7,-2386,-939,-3142,1010,-1050,2789,971,-630,-1543,2046,-278,2633,1912,-1779,2003,258,187,-2784,-1487,-788,-142,2252,-916,31,2099,562,-3474,1148,988,-1138,-1710,-1233,1025,-2342,2144,1163,-877,1329,2481,-1469,1407,-492,-1720,1115,2481,-1632,1146,-3537,648,1112,-2051,-1197,2329,-230,-533,1628,-1859,-626,319,180,2132,-1965,-773,-400,1072,469,-2374,1907,-307,14,-2045,-1246,171,1545,-378,-1691,-1159,-2312,-1079,-1848,-240,-1398,850,392,-2379,990,-3606,-1365,-2169,-101,-125,1247,-2385,1536,1312,-2097,-1040,-1632,1014,1385,1404,1841,-1962,1480,2348,941,585,235,2230,-1674,-268,1612,2013,-216,-155,59,3308,-526,-536,1051,2542,-375,-710,2591,2107,1524,-749,89,-1097,2750,846,-2499,2069,1286,-1422,1964,-1204,2841,-142,-1753,-1556,770,-475,2806,1527,2212,498,-1002,-1968,-87,172,692,2355,1949,-1767,950,1075,1127,2596,-1403,-2066,-1284,47,-978,1857,-2194,-2174,-847,-364,987,1631,2236,723,-1566,2141,1925,-148,-244,-2022,-310,-1011,-1040,575,-2334,869,2327,1900,-1922,-32,520,2139,210,46,1940,-187,-28,-702,2943,-1180,1467,416,2045,-1726,-1520,-839,379,-948,2697,973,-2145,2046,-1942,-975,57,-477,2946,-1276,-188,-1212,-1941,-1844,-624,678,199,2540,2010,44,3187,655,2098,582,188,-1341,-4549,864,-55,-1826,2484,-1046,-666,-1903,1319,2803,-166,1829,-254,651,-371,52,2116,-186,-748,-2203,-555,-1651,2081,-1309,-1649,-1196,67,-776,3160,1689,1267,1033,-1896,273,793,-177,747,-2468,-455,-1075,-1904,1629,-1777,19,-866,-212,-2159,-1619,2577,-249,1966,1831,-1291,1489,2019,-1759,-1010,-4001,-1564,874,1809,-2230,-950,2396,-1877,1610,1962,-1590,-1525,-1827,-878,1903,338,-1644,1262,2764,333,-193,1753,2498,718,3092,-214,1326,2163,1419,1434,-2191,-791,1372,2744,-12,-191,-986,3131,2057,417,-1360,1502,749,-2160,-1090,-923,2353,-1564,-2002,-711,-1218,-1327,-1382,-694,-2299,-1372,521,2632,1731,278,-1785,2216,174,3118,576,-1559,-2162,50,2081,50,-21,-920,905,-2420,-2291,219,-13,1737,1616,-1788,-53,3304,-364,1962,75,210,-1548,1812,1198,110,3271,-59,-1491,2199,-1574,1270,2840,-297,1232,2736,500,-793,214,2124,-1396,-39,1956,-1890,-247,640,1737,-1534,-406,698,3027,-1024,-1955,-220,343,-248,-1756,2338,1663,-1766,-472,610,24,2219,-786,295,-2440,-453,1866,-2301,-154,933,-2476,377,-1419,2501,-1433,-121,1971,-540,757,2536,-1862,-3962,-760,1431,2724,-725,-1430,-1697,-1064,461,-3206,-1469,555,-3218,1365,-2081,-4547,463,1764,1802,-1634,828,2899,719,-556,-3539,1166,1784,1170,858,1996,274,274,-707,-188,2221,759,767,2451,-991,-2659,1836,-517,107,2054,-305,-3123,1814,1771,-187,808,-1385,-3230,-855,-1023,2339,1713,1762,1337,-1837,1498,2540,-1026,250,1105,-2446,-1055,-1726,-1339,-1812,-223,-1607,-2018,255,272,-1164,2425,1446,-387,273,-2466,215,-4295,-1846,1156,-2584,1485,1931,-393,-378,-1007,2656,-1547,-1693,1339,1089,-760,-127,-2360,1845,-662,-1091,574,-1635,2218,1864,836,635,-779,1183,-2433,-1929,-1071,-356,-216,2452,-1957,199,-4546,1473,1481,-3042,-115,-1710,2409,85,2001,-861,-117,-927,3099,-504,-1686,955,-2031,62,2698,-1717,-416,3247,-480,568,2202,2102,-1401,580,-2221,1927,-79,252,718,2777,-1463,-883,-2156,-1271,1476,2358,733,303,-2863,2104,-1326,1843,-2085,1246,-3005,712,-1568,-2159,-611,-476,731,-2457,-1016,-2977,-1184,-1218,-1906,-1165,1376,1259,-2275,-441,1228,2560,1037,-3961,-1522,732,-616,-2067,-721,-2381,2207,403,2714,1702,254,1017,2606,-1174,1525,2155,-1724,-4546,-1638,2261,160,-374,1176,-2796,728,-1960,-450,-1117,-1719,1751,-1821,-1762,-273,944,1969,521,316,-2123,90,-1015,-838,2646,1460,1567,2387,378,536,2668,-1666,1674,543,-1950,1017,2163,-2010,353,1946,-2251,1310,-148,2052,-857,2505,-1756,499,-60,2135,278,2982,1248,1082,-1803,2029,-2117,381,-1139,-2033,1927,-422,689,2835,1236,376,3181,-560,2242,248,-6,-716,3082,219,79,-1136,2652,-406,-4504,-1884,2167,-582,-329,1500,2699,-199,1900,2209,-61,-1911,-644,-111,396,-1413,-1722,-838,2966,254,-25,2333,-2069,-933,-1905,-1345,-2000,-500,-879,-142,-3404,1537,-1958,-119,-177,983,192,2230,-332,-2201,2398,-95,1469,-2397,1106,2986,-677,-118,-2443,-1559,-1185,-2008,1930,125,3070,1101,1922,-336,-364,-944,2994,-174,-1327,-266,-1951,565,3169,-575,106,-2055,-1650,-393,-1336,2506,877,-2973,-1225,1912,-265,-1255,1018,-603,-1952,528,-573,-2196,1815,649,-1764,-853,-325,2297,737,1781,-2248,271,2229,-2123,-1130,-2166,-1208,482,-2956,1859,-1898,-4360,-1442,-663,-1571,2116,-1401,-1971,-976,-1768,2240,-1095,1236,2912,-433,-945,2831,905,1802,522,926,-1709,-1550,-747,1337,582,2205,1588,46,-1824,1167,-296,2238,-1030,-2250,-1193,2771,-4552,-226,1479,-2595,-633,860,212,2111,-59,-1200,-1916,1057,-347,-2093,1795,-644,336,-2152,121,-32,-12,351,2616,748,-149,2264,-1214,-1587,-1266,-174,3009,1314,-282,-1016,2819,-1529,-841,1883,476,-1971,-1535,233,-3369,1493,-418,-256,2414,2157,-419,-499,-1196,-2737,1190,-545,-1588,2377,502,-205,2281,-135,-805,3159,2258,-4344,72,438,-809,2469,-649,-268,2289,261,-574,2679,590,648,-2497,77,-698,-2248,479,-1672,2102,1715,910,1088,1570,-1768,1188,-157,-1057,-2016,9,-3453,1526,1195,-253,-2035,1,-954,-2144,1573,2522,-657,-1802,-1493,-519,605,879,-2472,-1394,-3531,369,377,1515,-2394,-1553,-1163,-1173,1838,-66,614,-304,-1861,-1647,-789,-2297,-1258,208,2186,2231,398,1689,-2354,2008,1926,291,1098,2302,1626,-1962,-133,-190,2363,246,-360,1070,2824,533,-12,-4464,-1874,-1993,1360,-135,-789,2043,-2190,1288,-4548,865,2050,908,263,1574,-1945,-606,-1090,2951,-182,-1494,-2076,-803,542,322,2233,-1532,-3079,-338,1766,-1459,-505,-1953,-542,54,1705,2407,-1007,-359,-1422,-1785,1555,1706,1175,482,-1620,2227,-20,3232,78,-18,-1915,2524,-162,-2006,-1631,-553,3000,923,-133,-1144,2652,329,-983,2676,318,-738,-2150,-2604,-4540,-890,2102,253,13,-2202,-315,-422,-2166,870,-830,-1884,-618,602,474,2782,-1536,-1203,-2612,1428,-1623,-1748,-810,515,-1394,2404,-671,2563,-1777,870,-1102,-1812,412,3100,190,-911,-1285,-1637,1821,2350,54,1842,2359,-724,-599,2633,1726,402,2573,1899,243,-937,2672,1381,-88,1955,1511,-1189,-1103,-22,-1585,-1774,1004,-431,2300,453,2984,1073,1041,512,2287,-3,-938,3205,-1915,133,733,-1869,-1099,70,1488,2658,175,1302,2454,1173,989,-1560,-1460,-2066,-534,-288,710,2159,-2050,2376,-4552,-1090,-1362,966,-2314,836,-846,-1904,-1660,-1302,-976,-1786,1191,-1836,-268,-2875,2140,-425,1719,-2341,-2078,803,-647,299,3177,14,1869,-324,133,-1583,2533,262,-1846,-469,63,-2148,1183,-869,1218,-1912,-1131,880,3083,-549,-1923,1327,-1696,304,-1881,2436,1536,-3985,-1291,-467,343,2279,-1656,-929,-1275,288,-2768,2367,-1845,595,922,1226,1693,1931,221,2334,-2054,1529,-750,1789,2083,-782,-399,-2082,-4002,-211,-1811,-1363,297,1036,858,-2381,536,-4349,-1832,1311,2724,-1038,-1648,-1847,-576,2224,1412,-250,-2081,-706,-120,-146,134,-2511,-656,-2427,-1314,1841,-942,81,-1911,531,656,1478,2526,620,-1509,-1978,-850,-1682,2504,-793,794,-62,2248,2038,-1006,-75,-1794,-1451,-634,-726,-459,-2197,-863,-2308,-1212,1746,-1480,-640,24,-2448,-1541,-1326,-58,1981,679,-996,-1853,2680,-4368,-396,1481,-3263,-428,-499,-1859,-1603,196,3269,-288,-574,237,-2457,-865,2980,-1053,-970,-883,-1811,587,-2362,-1357,-1164,-1421,-1314,1170,1169,-2325,294,2650,-1758,-412,-1761,-1661,151,-962,2670,1856,1972,-1396,1815,395,810,211,-1184,2560,-861,1577,2354,-333,3172,-877,-2117,-785,-394,-1742,-1622,-548,-2040,852,9,1327,-2536,856,-1864,1434,493,1778,2219,-1158,162,2965,1390,-2794,-4544,-165,1179,-2187,-1099,-168,3271,-88,-1971,2039,-703,-24,-1142,2996,1515,-1037,-1271,-1584,1699,1178,-874,-3832,939,-250,3054,1122,1471,-1857,-923,-230,3177,361,-1554,-1663,-916,2032,1074,-1246,704,1350,2466,-1748,-543,1298,2145,644,-1173,-915,2568,1579,-229,1386,-2434,2195,105,-1049,1462,283,1994,-504,3192,-717,353,-1842,-1623,-902,-1986,2107,199,-1961,-1621,1368,-244,-1952,1354,-3254,-842,1037,-1847,-1314,1963,1418,-1501,2320,214,-530,-2080,-99,80,388,-1013,-1938,550,2802,1474,-1419,331,-2114,-133,-3835,1340,-396,3146,128,-1305,-2122,-1025,1564,-1420,-949,490,-880,-2042,526,1102,-2495,-441,-2068,-1579,435,2447,-1924,-1695,1289,1138,-359,589,-2535,-302,-1144,-1932,-1619,1866,-1870,175,1246,-2480,-1956,-125,-189,2014,-212,-542,485,-1586,2388,-1172,402,-2345,-2013,1053,146,-1166,2721,915,-144,-1640,2434,1335,-1037,-1489,972,2824,-1274,-879,2311,1887,-374,-988,2694,168,-1622,2380,-1750,-1308,1038,365,-4219,1345,-1545,-1996,-765,38,2174,-2169,1280,-89,1996,-362,-2632,2434,-2026,1620,55,219,77,2248,-396,2091,2249,257,-1620,-1723,-463,2939,1294,-1993,-739,-758,-569,-621,2482,-1153,2295,1594,2067,-210,-897,-325,2386,-2015,89,-936,-2118,966,-2309,-1147,1659,1713,1063,1808,-1266,-496,-1298,-1203,-1340,-1174,2153,1714,-972,1375,-2351,-2286,229,-274,-1260,2853,-320,1681,-302,1446,2085,-766,-560,180,-891,-2103,2137,57,-779,-59,-2102,-1592,867,2467,1703,1995,-771,-394,2121,1893,-731,-1827,-351,713,1257,-24,1951,895,2575,1514,-247,259,-2529,-739,2329,-1950,793,1505,-2361,-1206,-307,2244,1903,-92,431,-601,1715,-2328,589,1680,-2326,-641,-4359,1229,-98,2564,2074,2235,398,-517,-638,-2990,1686,868,-1874,-1448,-2344,10,-516,1719,-1429,-277,1101,-744,2305,446,3180,-661,-767,669,2407,-361,2339,2157,-871,-1701,-1491,1969,2156,-646,-963,334,2304,-430,-1234,-1821,2108,767,103,-1852,-466,591,830,2097,2020,1147,-4442,949,177,-3183,1785,-195,-963,2703,-698,2192,2070,-1211,1893,1813,1817,-456,69,-2168,1234,-682,-581,1145,-2435,506,-1503,-1683,871,-3481,1053,-1537,-251,-1879,616,462,-2459,52,-2213,2449,-871,2770,-1455,2037,-724,-100,131,248,-2487,-1980,908,313,2003,-3981,-149,-467,115,2097,968,2884,429,-102,-253,2908,1030,1496,-2287,1266,780,2219,959,3007,-718,-1976,-117,257,892,-2590,1928,2152,-915,-423,-1759,92,1199,-1254,-3098,777,588,-4332,1220,1128,72,2125,-280,-1464,2572,-1203,-12,2094,418,2813,-1433,-474,3057,-1029,1552,2475,-159,-1424,2059,1353,-1247,-1048,-1516,802,1271,-2366,-1062,-1484,-1380,2040,1281,310,937,-251,2253,1673,-1698,-585,-321,-1789,2219,18,1667,-2345,2490,-4410,-784,-1419,2812,-261,1438,-2472,358,-1140,2351,-1788,-2468,-4547,90,-971,-86,2237,1103,-1879,-1278,-1570,667,1841,1648,1389,1116,1143,2668,1055,862,31,2100,1935,-172,-209,1400,-2351,813,691,2353,-1927,1093,-2107,1931,-105,3244,-652,-15,-1070,3127,343,2116,-2171,-1987,-889,24,-1933,52,-1555,-2654,-4347,-222,-536,-1315,2414,-1306,2806,85,-1894,1678,509,-1892,756,-1799,-764,1685,-2327,1310,2793,-849,938,2969,-67,1688,1964,1004,2112,-136,-91,596,2122,-2109,-931,483,-2396,-1525,-914,-1344,1921,-820,-364,-1977,2165,-610,-38,731,-2519,-1821,1085,934,2236,491,-762,1360,-1206,-1316,-199,2768,1799,1161,2727,677,-1278,731,2282,303,-1342,-1787,-239,-928,2775,2295,31,-500,963,-1351,2134,1111,1645,-2233,-1510,836,-2182,-1873,1057,680,224,-3305,-1539,1836,-99,742,-1596,0,-1916,6,-1166,-1967,1065,1893,-2110,1629,-293,-1486,1807,2129,451,36,-358,-2388,-597,-1659,-1596,-504,-2443,-1401,-1190,2995,-685,-1911,-20,680,-2073,799,-1138,-1350,1560,1875,-825,3121,-701,2075,-332,-480,-345,-1018,2570,-1853,-704,-1104,1937,1399,491,-2077,993,-1445,2100,-35,-108,768,-1889,-1504,504,-1766,-1611,6,-503,-2322,-296,-935,2680,-1225,-1489,2037,1897,225,536,-526,-796,2471,-2104,702,111,1012,247,2236,960,2816,954,-82,-4285,1432,-1794,1462,-1831,543,3079,-989,-1627,-3550,-383,631,3087,55,1184,2218,-1869,-236,-79,-2434,708,2956,519,998,2732,1172,-2010,485,-1408,1680,1467,1023,-20,-2830,2364,-991,2093,-2070,1315,-18,1975,-2093,32,-830,-2091,1849,-965,672,-1869,2148,2146,2049,-436,2233,-105,-254,1568,1631,-1919,-778,9,2233,1940,-43,-86,1304,-1632,-1131,-2291,331,-329,-153,-447,-2322,480,-368,-2272,-1983,-1058,-539,1763,-3831,-482,-1922,237,593,200,-735,-2169,-1901,402,822,-610,-1513,2358,1921,-757,-683,838,156,-2307,371,-739,2538,364,-3779,1179,1136,1960,1769,-2225,-448,-329,2383,-150,-566,-1180,72,2126,-233,-1067,2881,671,-1657,-1598,1760,-1418,-359,224,-1753,2322,-532,-346,-2275,-576,2473,1893,-1073,57,-2229,869,2409,-1803,1885,-659,-897,-2349,266,-476,1870,-824,-921,-1447,2606,553,-1470,2573,-1205,1458,2454,-1306,-1876,1070,-1587,506,2213,-2082,-1141,2628,-1450,954,739,2433,1932,-594,-813,1767,-1079,-954,-769,-1568,2136,1838,260,826,2007,-4550,-1446,-1662,2209,-1327,1343,-3290,281,-1046,-1104,-1634,2223,-286,-632,1814,-1238,241,804,-1500,2171,-1654,1521,-2042,166,-1537,-1779,1991,-155,67,175,-1123,-1966,47,2062,2307,1646,-1829,-546,-357,2778,1656,1906,-446,31,157,2640,-1769,1451,-1211,-1306,-884,-4544,-1788,-24,-2899,2187,-697,-1824,2157,-2070,1280,-455,-2015,-432,-711,-1156,-1022,-1576,-1195,-3474,-1196,1956,-1279,153,-1400,-2053,1487,-436,-474,-2296,-16,-2730,2488,-1867,-782,75,1740,-1038,202,591,3001,442,1591,-1711,-775,748,1185,2461,2204,971,-142,158,1,-2406,-95,1999,2391,1731,-1555,-541,2022,-345,-245,1682,-1607,-357,1600,2188,659,1004,-1477,2091,1825,563,842,513,-1272,2394,-428,-3285,1455,-2077,-4550,-1444,-992,2848,-1190,-1606,-1744,1234,-1916,-4356,523,-1384,1636,-2140,-1930,723,652,170,-1817,2449,-1459,-1456,-1126,-277,1059,-2454,-590,-857,-2004,2007,-303,-1087,-289,-4546,1457,-2171,-610,-318,137,-572,2968,2002,252,67,-278,-750,-2209,-388,193,2135,-273,-878,3078,-34,2592,-1835,1239,-532,-1799,1290,476,-2227,-1401,-2169,-902,2050,1422,-1194,921,3044,-306,-1002,2551,1483,1975,1656,458,-337,-731,2658,254,-1565,2280,1743,-1415,567,-1687,-1719,-601,-100,2149,2344,345,-2176,-1591,-170,3250,-709,-2270,15,-287,1852,-1327,143,-689,2916,1165,722,-1406,2233,557,449,2354,665,2561,1727,1763,-1275,193,-81,-1396,2647,66,-1280,2624,-963,197,2091,-553,1832,2366,1117,61,2096,2189,1139,-459,1337,1599,-2158,1165,-1604,-1341,-1771,-1384,-248,-230,-949,2658,-1931,1991,-1305,-2018,-135,66,124,-1806,-1689,-500,-1572,-1745,-1556,-1898,-785,2227,225,-204,-1770,2020,-1485,800,2973,287,1225,-2330,-1000,2173,636,-99,-965,207,-2369,-2137,-175,-146,-429,-1630,2285,-360,-772,-2164,-363,1504,-2393,-1172,-2823,797,-2025,741,400,-1428,2226,1268,1627,-1559,-802,-784,1404,-2364,1647,-1757,-671,1165,1208,2224,-645,-1202,2356,178,2842,1608,-2040,-282,-230,-2122,488,-942,1740,-3954,191,1524,2681,-558,2047,108,-1276,-820,-1040,-1780,-528,-2117,-1487,-1683,-1048,-1096,1493,2576,421,1537,-2207,-394,1701,-4548,-1630,-228,-2079,-1653,1542,2523,-826,747,2866,1050,-708,38,2120,2242,194,-35,1870,179,-1512,-1288,2101,-1956,815,3090,-751,198,3165,310,-378,-2421,-1461,-1869,-654,521,-1371,585,2225,811,2896,-1209,-1827,1207,768,-1655,202,-1989,874,-4547,-1780,915,2290,-1935,1728,134,1167,1411,-1494,-1090,1466,-4096,501,-370,2206,2214,-1666,1485,1129,-404,1008,-2503,97,-202,-2383,-1046,2209,1825,-1887,-447,402,-916,-64,-2259,1456,2188,-1648,-965,1255,2382,-825,-2566,2114,1453,2090,1215,-315,2159,-2135,1520,-2049,910,844,-846,2433,-466,2256,-2072,961,2443,1562,900,2950,145,364,3208,-305,-754,-1386,2242,-1857,778,855,-1787,-1017,215,-1584,2373,-1352,1836,1713,641,-1905,-1062,-88,-405,1224,-2449,-933,2745,1192,-1495,-2289,1057,1588,-1642,-855,603,-1537,2041,2067,988,-1132,-34,-3277,1757,285,65,2140,71,2850,-1530,-2844,-4544,-487,2255,291,-403,1887,-326,384,1417,919,-2208,-1986,556,425,-370,3095,916,339,393,-2496,1286,2275,1360,-114,-1122,2753,631,2935,883,1719,-1666,-518,-1314,-942,2169,-313,-73,-2416,-2080,781,-133,-1236,2724,-1192,1218,8,2014,1480,-2464,44,-1624,5,1693,953,2572,-1608,-2055,322,30,235,2715,1798,-1020,2081,1902,-580,-4547,1303,1878,-1020,-750,191,-943,3097,-1825,-1263,30,1749,-1224,151,-1172,-2038,-1189,1169,2927,-241,1087,-2847,861,-2121,644,-81,-269,-1200,2552,758,2029,-2116,-1554,-2071,1024,-1116,-1891,-1248,-1765,1174,1010,-894,-1570,2154,-1051,3068,-610,1932,-111,169,127,2104,2268,-1294,713,-2332,1440,-1967,-929,1534,372,-2027,607,-2427,2234,-1634,-216,-1676,1850,-1056,-88,-29,3211,-847,-1297,1420,-2242,493,1926,-2272,-292,2107,2256,-1230,61,-2168,1440,-2266,1115,-136,2810,-1579,-170,1498,2551,1138,186,-2249,963,1020,2379,-218,2309,2266,689,-1534,2045,2108,398,-182,689,281,-2437,1389,-2390,490,1502,-2022,393,995,-2163,-1231,425,-2184,2335,1237,1349,-2262,160,-2309,-1582,-931,-1767,-1350,2231,851,-810,262,811,-2497,-818,3112,-162,350,3026,-1079,219,-918,2754,1589,971,1384,1582,2437,33,-682,-1092,-1888,-847,-1107,2369,-342,-1821,2426,622,1888,-2193],



"morphTargets": [],



"normals": [],



"colors": [],



"uvs": [[]],



"faces": [0,661,1599,29,0,1123,1162,1622,0,1425,1180,199,0,320,695,814,0,1037,570,363,0,968,1106,1161,0,586,426,188,0,103,37,620,0,1473,420,425,0,956,250,1153,0,1399,427,849,0,1524,1288,1276,0,1358,627,503,0,543,682,319,0,1328,1513,431,0,210,1618,227,0,1444,273,856,0,976,1004,1087,0,1498,1261,256,0,1123,1622,668,0,24,118,286,0,181,499,947,0,23,1020,371,0,1402,947,527,0,1315,765,61,0,568,116,139,0,925,510,333,0,181,328,499,0,166,137,728,0,1286,245,1472,0,530,1198,130,0,1048,554,865,0,1622,1179,316,0,546,1177,1437,0,1338,1269,850,0,71,438,33,0,483,159,1088,0,410,482,498,0,217,1122,537,0,216,1400,1006,0,1556,1092,831,0,705,1538,709,0,386,51,1477,0,908,1575,97,0,18,789,1336,0,777,905,1234,0,245,643,1472,0,97,52,753,0,1539,482,384,0,1308,1301,43,0,1039,1508,424,0,1150,929,228,0,199,610,763,0,338,745,553,0,256,1475,1305,0,827,1321,1482,0,1552,1372,737,0,1117,661,642,0,709,732,1339,0,1287,1002,1604,0,1188,46,366,0,445,821,1089,0,779,672,1348,0,1412,259,1327,0,1078,1458,262,0,991,68,840,0,1432,1017,789,0,182,1532,94,0,814,198,1591,0,23,139,1272,0,352,1137,282,0,249,527,843,0,285,842,1301,0,1634,1322,1228,0,549,750,407,0,1539,816,1067,0,100,1085,1605,0,846,67,1515,0,522,93,90,0,1459,178,1182,0,811,955,475,0,477,134,1507,0,96,780,524,0,1323,955,343,0,617,1340,1514,0,1585,1155,354,0,151,207,1544,0,14,972,1501,0,758,817,1030,0,423,935,1272,0,236,1609,1590,0,797,570,1043,0,1532,1082,94,0,1392,1106,1282,0,539,414,124,0,1394,628,1496,0,1241,1262,1158,0,1291,1205,1608,0,1247,505,642,0,1215,35,243,0,106,1603,1393,0,1553,941,1295,0,35,911,1146,0,292,895,1111,0,829,765,305,0,828,994,1167,0,538,539,124,0,733,1255,1458,0,1015,871,102,0,981,208,201,0,108,1011,99,0,678,335,463,0,1428,656,1597,0,314,873,1261,0,1570,921,1206,0,325,13,1116,0,1113,1050,59,0,658,140,1094,0,772,121,460,0,185,52,234,0,261,771,1290,0,606,126,153,0,909,53,165,0,1531,1142,1613,0,501,122,1215,0,962,736,733,0,93,550,90,0,1012,386,81,0,922,1150,228,0,1096,274,196,0,1594,1317,1577,0,987,190,399,0,1011,796,99,0,817,1510,1526,0,1104,1386,1304,0,1623,1353,123,0,1467,1066,848,0,944,1515,1481,0,491,1044,931,0,265,316,1631,0,975,768,213,0,1424,278,1066,0,794,161,1224,0,967,678,463,0,367,1639,721,0,783,1615,640,0,433,676,1636,0,143,521,1593,0,310,40,1174,0,1189,983,289,0,1351,552,1226,0,345,545,1352,0,764,31,604,0,9,1359,437,0,1218,1518,1015,0,551,715,1356,0,1092,516,831,0,1269,1338,133,0,1411,1387,1406,0,1152,1553,1295,0,1478,350,418,0,1339,732,203,0,415,105,821,0,246,678,456,0,734,70,1174,0,662,1582,1130,0,603,1137,881,0,283,597,1343,0,77,659,1012,0,402,347,1577,0,331,306,1454,0,770,1006,356,0,1453,1133,76,0,355,1592,1267,0,1585,1198,530,0,351,236,1183,0,1600,177,582,0,991,7,1573,0,1351,314,529,0,968,1161,1349,0,3,755,1027,0,1053,1062,1115,0,315,920,252,0,1381,261,61,0,488,525,591,0,1222,646,1581,0,573,537,299,0,674,632,485,0,461,1406,1460,0,1551,33,995,0,1478,1143,1099,0,1147,354,1535,0,287,629,1463,0,1424,1462,176,0,884,823,1426,0,46,724,806,0,391,438,663,0,512,159,326,0,1222,1090,646,0,386,1012,659,0,471,438,391,0,754,1186,93,0,441,1560,621,0,198,857,806,0,218,896,154,0,1196,216,1561,0,596,1461,965,0,516,1092,1365,0,1330,1248,697,0,1467,341,1466,0,293,904,839,0,858,826,542,0,1310,53,1361,0,420,1473,184,0,628,1413,1496,0,1569,381,21,0,1379,788,1370,0,1101,1052,11,0,953,811,722,0,317,275,771,0,843,1335,249,0,669,826,858,0,613,1395,374,0,1565,342,1104,0,252,920,915,0,135,1243,1332,0,1444,1563,800,0,1450,98,561,0,351,1183,142,0,233,1169,1546,0,1461,231,75,0,1211,1492,29,0,772,343,955,0,1100,1445,928,0,389,415,287,0,459,1001,1382,0,892,1095,676,0,1414,1497,1089,0,1249,1319,1328,0,302,78,1568,0,1259,458,778,0,1214,1483,1327,0,800,175,1444,0,1621,789,18,0,1038,1431,1492,0,201,1234,222,0,1436,1368,788,0,1595,873,1226,0,201,208,1188,0,766,879,560,0,888,171,494,0,1012,1410,488,0,813,57,635,0,943,578,573,0,851,717,996,0,793,42,69,0,718,1080,1256,0,1615,143,1252,0,796,334,99,0,427,32,104,0,520,509,567,0,1231,1493,36,0,29,1431,1550,0,412,133,1338,0,823,884,121,0,431,844,187,0,31,697,373,0,1009,736,1519,0,695,1433,486,0,316,1179,1277,0,1316,1498,318,0,405,1525,1291,0,1534,1416,258,0,522,214,649,0,14,1501,86,0,1498,1316,348,0,1143,260,1099,0,1072,1252,143,0,79,1346,792,0,1537,702,1366,0,338,1219,745,0,880,1641,1596,0,1132,47,256,0,256,1313,1132,0,594,924,890,0,992,83,1377,0,1155,1535,354,0,889,231,596,0,598,1430,1611,0,285,557,842,0,752,372,378,0,1129,420,184,0,1473,1246,1102,0,1291,1608,405,0,1366,1125,1486,0,1020,23,1272,0,632,1602,1010,0,737,1120,1482,0,1273,868,784,0,898,861,645,0,1311,1097,1143,0,993,696,916,0,1152,1295,1268,0,1432,963,1017,0,1149,793,211,0,851,996,1230,0,1525,144,73,0,560,1213,422,0,501,315,48,0,687,587,126,0,870,387,1205,0,1561,770,859,0,896,1051,154,0,1066,652,848,0,243,916,1215,0,1217,433,1497,0,522,90,903,0,474,1198,1585,0,470,1150,1392,0,1398,1342,1278,0,1007,750,24,0,614,94,334,0,350,872,87,0,680,1551,488,0,1490,286,1093,0,1391,1309,729,0,619,193,998,0,1196,1561,927,0,826,134,542,0,1619,1217,1497,0,526,1569,16,0,79,630,217,0,342,1565,970,0,1266,775,1031,0,1439,696,246,0,1432,349,688,0,616,560,422,0,594,508,924,0,1488,612,376,0,854,59,1203,0,361,1416,1534,0,590,1293,245,0,924,1528,890,0,469,788,1379,0,1026,850,408,0,1242,810,1384,0,504,1369,217,0,1423,149,594,0,1188,366,1630,0,328,1211,1288,0,1583,347,91,0,116,1404,1232,0,1316,1146,251,0,246,1588,678,0,1363,726,496,0,99,584,108,0,1619,1414,821,0,1400,808,1331,0,752,1467,372,0,1310,165,53,0,1129,184,193,0,938,806,724,0,759,618,521,0,267,1490,605,0,775,1538,1373,0,25,8,1135,0,1364,358,447,0,603,836,390,0,64,1187,1620,0,899,141,926,0,337,1308,80,0,159,483,326,0,505,1247,1302,0,296,336,950,0,422,1245,616,0,1370,1368,1587,0,1220,138,1021,0,1576,1055,781,0,1,1030,1526,0,271,758,615,0,289,1637,982,0,1488,1380,612,0,1388,176,1462,0,1092,1450,561,0,470,1392,1390,0,295,1206,123,0,78,1348,1038,0,515,383,9,0,304,34,1114,0,1136,462,1480,0,202,614,334,0,1498,235,1549,0,1080,652,335,0,1420,481,951,0,1292,470,418,0,1066,278,1063,0,597,283,731,0,614,119,1263,0,854,1311,1143,0,220,120,992,0,1364,1408,358,0,576,1345,968,0,818,877,580,0,1148,1436,155,0,1194,802,406,0,202,843,119,0,775,958,1538,0,133,729,1309,0,104,1289,579,0,821,903,415,0,762,1214,1327,0,1226,200,1466,0,1396,1200,1010,0,727,39,340,0,382,1576,17,0,1236,894,19,0,324,1129,634,0,1322,1634,1185,0,601,265,1631,0,1452,1146,650,0,0,428,1578,0,972,1201,1013,0,436,837,1138,0,412,824,133,0,402,1577,1126,0,510,306,1159,0,1197,1360,1283,0,283,1343,538,0,681,169,547,0,1115,937,446,0,838,708,785,0,335,652,463,0,1286,1216,511,0,1298,32,1036,0,1363,496,349,0,92,1320,221,0,447,1435,426,0,1473,1102,998,0,1125,1604,670,0,1172,1176,511,0,1090,828,683,0,1070,1455,562,0,169,1545,978,0,767,992,1377,0,1209,570,797,0,1385,981,222,0,195,247,1337,0,988,1085,100,0,655,1158,1262,0,485,632,147,0,1354,678,918,0,466,321,66,0,304,1114,776,0,574,1075,867,0,233,1546,942,0,624,622,1325,0,531,1579,593,0,402,1402,1201,0,828,698,994,0,675,1056,1303,0,1282,1143,1392,0,86,1334,589,0,925,333,1615,0,689,387,188,0,62,849,427,0,1153,1587,545,0,1274,1079,843,0,233,1328,194,0,1551,633,209,0,283,538,364,0,836,940,390,0,1397,1061,175,0,558,1186,110,0,111,1148,1162,0,90,122,903,0,468,138,1607,0,226,725,985,0,1193,1167,742,0,385,562,475,0,20,148,1250,0,551,1356,1023,0,127,648,63,0,431,1169,194,0,1379,1587,1047,0,127,1610,648,0,1043,1037,1411,0,1339,203,417,0,1264,1005,232,0,909,167,260,0,959,472,937,0,1194,157,671,0,1144,657,1395,0,1348,698,1038,0,1421,1268,1295,0,1006,770,216,0,100,1605,641,0,968,877,1113,0,1380,1488,529,0,1418,1047,956,0,615,758,1289,0,1415,279,604,0,1532,182,398,0,91,1008,14,0,86,589,1583,0,442,1195,949,0,389,1463,767,0,277,281,600,0,46,1297,240,0,601,621,651,0,613,64,435,0,57,1447,635,0,1631,658,441,0,1194,1356,157,0,452,1412,1324,0,438,471,492,0,311,612,298,0,1423,594,890,0,1324,1412,1483,0,1243,507,1578,0,480,944,1358,0,1275,66,215,0,1153,545,517,0,517,345,1123,0,466,1632,321,0,70,936,1174,0,150,298,1401,0,944,1284,627,0,30,862,1139,0,32,595,554,0,1137,69,856,0,912,1026,503,0,932,921,321,0,553,745,1536,0,436,19,837,0,1609,461,1465,0,296,473,790,0,80,559,156,0,67,729,1515,0,1557,975,213,0,734,804,186,0,764,604,1235,0,483,1088,1560,0,1051,1212,154,0,567,169,681,0,609,787,1486,0,691,1174,936,0,9,383,219,0,730,146,791,0,141,989,602,0,1069,1258,1034,0,122,35,1215,0,152,741,437,0,933,606,153,0,283,364,731,0,1171,407,948,0,1061,1116,175,0,354,96,1493,0,1342,1529,100,0,1015,494,864,0,1144,1084,1569,0,223,475,728,0,188,1525,1614,0,220,1318,1579,0,451,237,997,0,1411,331,1590,0,116,1272,139,0,1353,637,631,0,518,728,137,0,1207,30,468,0,86,1583,14,0,825,1624,1593,0,550,1442,248,0,1060,163,1233,0,1141,629,563,0,642,661,1022,0,443,1521,525,0,1507,206,1004,0,966,1475,1595,0,874,758,101,0,598,1611,1002,0,1451,1307,279,0,899,693,544,0,1542,1545,1149,0,323,1324,714,0,414,391,665,0,1608,458,405,0,867,68,39,0,1127,1371,524,0,591,77,957,0,551,457,960,0,440,1409,1139,0,419,378,1124,0,1069,414,665,0,803,1287,1604,0,1638,254,700,0,1096,801,1229,0,853,81,386,0,838,978,1171,0,1143,1390,1392,0,1387,1465,1460,0,529,235,1600,0,330,360,1247,0,1576,1326,1344,0,325,974,833,0,1054,534,648,0,770,1561,216,0,1002,1611,620,0,1618,210,631,0,1025,510,1159,0,182,94,1263,0,1522,585,1281,0,370,164,363,0,983,368,289,0,639,117,1477,0,1548,1009,323,0,871,323,102,0,205,1441,926,0,1226,1466,1595,0,29,1276,1288,0,69,211,793,0,1584,684,430,0,359,858,1403,0,467,1096,196,0,1449,102,714,0,563,48,1141,0,424,1508,739,0,1402,181,947,0,636,371,27,0,1626,626,1151,0,1131,98,773,0,600,951,277,0,476,761,1064,0,539,471,414,0,331,65,901,0,1312,922,228,0,1078,733,1458,0,911,22,919,0,1016,224,1321,0,1571,1541,997,0,150,862,1640,0,553,1536,1193,0,1634,1228,290,0,956,1047,250,0,933,3,606,0,55,1616,88,0,645,308,484,0,70,261,936,0,163,921,932,0,632,1391,67,0,1326,781,1170,0,3,955,1323,0,1407,204,866,0,909,260,1097,0,509,1068,533,0,175,1116,1024,0,794,1224,1135,0,313,908,1090,0,555,1184,413,0,1317,1594,302,0,1138,1168,531,0,824,944,1481,0,827,1120,1389,0,486,905,695,0,471,391,414,0,1133,1453,1559,0,1617,1067,816,0,1470,1579,1225,0,1075,840,867,0,465,279,1033,0,116,307,1272,0,296,790,257,0,1483,1214,1547,0,867,269,404,0,863,282,1239,0,1286,590,245,0,762,429,945,0,1028,518,656,0,952,655,255,0,1012,81,1410,0,1312,1296,922,0,403,370,1209,0,1531,1613,1620,0,106,1417,406,0,1242,825,810,0,752,419,977,0,723,222,1059,0,1135,1320,794,0,947,1140,527,0,448,809,125,0,1505,208,981,0,467,16,1110,0,1554,492,630,0,1610,1255,648,0,1048,615,554,0,1450,1556,611,0,135,664,241,0,1170,699,1035,0,455,497,1241,0,435,272,1178,0,372,1466,200,0,963,862,1207,0,688,963,1432,0,868,1123,668,0,636,826,557,0,1070,891,1455,0,882,198,895,0,891,1044,115,0,763,225,565,0,1080,1360,1572,0,1034,1258,1410,0,782,1,946,0,858,542,1145,0,467,801,1096,0,1266,756,775,0,703,28,796,0,1266,444,864,0,28,1041,312,0,1587,250,1047,0,1030,1,782,0,1223,610,1491,0,264,1339,417,0,270,477,115,0,839,904,748,0,785,1427,1208,0,574,906,145,0,1234,201,777,0,629,74,308,0,1055,1271,239,0,1179,1622,1162,0,1568,78,1038,0,13,833,401,0,1456,1620,1613,0,133,1481,729,0,533,88,1616,0,151,920,207,0,1262,1127,255,0,1308,458,1329,0,313,1134,1428,0,79,217,537,0,705,643,528,0,613,374,64,0,328,1073,499,0,149,257,790,0,1140,947,499,0,1023,433,551,0,942,1546,157,0,1007,267,1175,0,845,871,1185,0,759,1196,910,0,1389,1321,827,0,361,1035,215,0,402,181,1402,0,1037,363,65,0,969,1564,478,0,1494,1413,1558,0,441,658,1091,0,204,582,866,0,71,663,438,0,1620,435,64,0,1489,358,1408,0,1433,1087,206,0,361,1296,1312,0,1529,1342,1398,0,223,728,518,0,1337,289,852,0,744,1523,805,0,548,1359,607,0,791,146,1156,0,1316,318,1146,0,123,1345,576,0,479,1479,513,0,1498,348,235,0,1409,440,1331,0,980,1009,1519,0,652,1063,128,0,1548,871,845,0,1130,444,662,0,667,173,1388,0,1285,176,679,0,1327,259,1573,0,1607,679,173,0,338,672,779,0,591,170,77,0,1174,1566,734,0,1125,670,1486,0,190,1159,399,0,893,1100,1606,0,1532,1117,505,0,1379,1047,566,0,1641,1612,1270,0,1527,1253,1367,0,222,1234,1059,0,197,174,60,0,1184,555,519,0,1007,1175,407,0,411,436,531,0,419,395,112,0,459,1240,1001,0,558,1019,93,0,1232,1154,307,0,35,22,911,0,1108,1525,73,0,730,791,450,0,242,937,472,0,1196,808,1400,0,534,1185,1634,0,1153,517,142,0,974,1228,1322,0,517,868,1273,0,1608,778,458,0,1570,1210,321,0,1602,632,67,0,103,670,37,0,650,47,1452,0,1090,683,443,0,204,213,768,0,879,234,1173,0,711,490,878,0,886,1040,710,0,625,1384,810,0,851,930,1503,0,893,623,1100,0,1116,881,1024,0,1151,874,101,0,1486,670,1271,0,978,1545,1171,0,778,23,371,0,60,875,788,0,114,1203,59,0,1254,640,333,0,219,1468,607,0,1355,618,221,0,1503,756,888,0,1066,977,1424,0,486,423,1154,0,1340,617,383,0,1115,1506,1053,0,1020,1272,935,0,1101,11,487,0,838,1171,708,0,1437,1177,1586,0,1020,935,1507,0,1551,995,1028,0,1140,119,843,0,1313,1305,1475,0,1111,635,1447,0,1139,523,440,0,742,1167,1300,0,1262,1371,1127,0,419,1124,395,0,351,142,517,0,352,282,118,0,788,1368,1370,0,506,970,1565,0,500,1369,504,0,900,876,227,0,421,865,1163,0,1414,1619,1497,0,1178,56,536,0,335,678,1588,0,816,649,214,0,1573,259,991,0,786,1532,398,0,18,961,1559,0,439,1220,808,0,170,525,1536,0,114,1361,1203,0,1109,556,927,0,1362,743,956,0,500,504,471,0,1590,1454,495,0,1547,714,1483,0,799,144,232,0,712,1214,945,0,1413,628,600,0,365,1629,1099,0,759,392,883,0,211,1137,352,0,1221,1043,1406,0,1144,1461,657,0,1305,1313,256,0,821,214,903,0,1606,834,878,0,718,1256,993,0,986,278,967,0,109,1397,1563,0,377,3,933,0,1068,801,262,0,1038,698,1350,0,1637,996,832,0,740,607,1468,0,710,1087,757,0,849,62,946,0,1391,674,1269,0,16,21,1110,0,448,507,1517,0,171,1266,864,0,1120,809,1430,0,77,170,1219,0,678,1354,456,0,569,31,508,0,789,1363,1432,0,226,985,388,0,538,500,539,0,1527,1596,1000,0,485,1419,647,0,308,645,954,0,624,1582,662,0,469,1112,988,0,58,146,1611,0,1120,125,809,0,1170,781,1118,0,1075,574,1499,0,659,1105,51,0,546,565,1083,0,541,1031,775,0,669,359,1334,0,1347,229,1212,0,1530,25,1195,0,48,563,903,0,135,241,809,0,724,1036,938,0,1513,762,1573,0,1419,850,1269,0,368,930,851,0,1422,841,38,0,1005,1321,276,0,418,350,989,0,158,275,901,0,908,646,1090,0,705,264,643,0,489,162,863,0,325,833,13,0,779,1583,338,0,1038,1350,346,0,1117,1532,786,0,108,96,524,0,972,1008,1201,0,881,1257,836,0,1435,254,1638,0,320,886,757,0,114,1050,979,0,681,1229,520,0,377,4,1223,0,1091,658,1504,0,471,539,500,0,779,1348,78,0,1281,410,1522,0,20,1470,148,0,160,1048,1629,0,225,763,610,0,1115,1520,535,0,322,596,855,0,1253,1116,13,0,1051,514,1240,0,707,511,880,0,492,504,630,0,301,1088,1448,0,402,1008,91,0,368,851,1230,0,1509,1580,795,0,288,148,1470,0,1228,325,1061,0,1045,1364,447,0,146,730,620,0,475,562,454,0,1420,951,297,0,597,573,578,0,656,1428,1134,0,773,780,1147,0,822,498,482,0,795,1580,1384,0,179,619,998,0,88,1255,1610,0,9,219,1359,0,320,292,886,0,872,1099,1629,0,340,39,259,0,1498,256,318,0,959,543,472,0,98,409,780,0,1019,1442,550,0,1243,1517,507,0,919,692,879,0,1173,234,52,0,1096,50,274,0,240,1297,1053,0,1434,1118,1533,0,704,49,362,0,237,1571,997,0,1204,8,464,0,707,41,835,0,609,1055,382,0,1318,220,131,0,588,497,1372,0,988,1112,1085,0,525,1521,1193,0,480,1104,342,0,747,1237,1574,0,788,875,1436,0,1595,341,966,0,932,1114,1233,0,1104,1304,1565,0,109,1634,290,0,1419,403,850,0,224,1016,337,0,387,1057,1385,0,799,803,144,0,1343,597,578,0,1125,1614,803,0,1276,29,1599,0,1124,961,395,0,131,954,645,0,570,1209,363,0,402,91,347,0,525,488,1551,0,783,143,1615,0,314,400,1226,0,513,1479,1297,0,1381,890,1528,0,976,710,1480,0,1624,1252,1072,0,931,385,1346,0,401,1367,1253,0,973,1521,683,0,1570,321,921,0,1282,1106,854,0,834,1606,453,0,1584,1075,1499,0,593,1042,411,0,439,392,783,0,789,1017,1336,0,629,954,1463,0,324,1294,174,0,953,722,1136,0,65,331,1411,0,757,1087,1433,0,122,84,22,0,1582,1367,401,0,1203,1361,1311,0,955,811,772,0,1625,1252,1624,0,324,1081,1398,0,450,1202,1533,0,1330,457,1248,0,1520,1298,535,0,1441,205,1489,0,417,643,264,0,578,299,537,0,1262,1241,1371,0,728,475,377,0,573,597,659,0,1368,1378,1587,0,1498,1549,1261,0,141,602,319,0,68,991,259,0,266,1424,176,0,1046,1036,635,0,1249,429,1319,0,884,1426,969,0,1286,511,590,0,964,242,602,0,210,227,818,0,1109,763,72,0,495,236,1590,0,221,618,556,0,958,1512,930,0,277,1077,641,0,761,476,732,0,907,1283,1360,0,1185,280,1322,0,255,322,952,0,721,1314,367,0,638,874,5,0,864,494,171,0,1417,1393,1456,0,20,593,1470,0,676,1095,244,0,1567,720,1606,0,1245,185,616,0,638,5,487,0,270,491,44,0,1354,918,207,0,337,80,156,0,89,192,458,0,1404,327,387,0,1353,631,210,0,271,160,1457,0,601,651,247,0,937,1511,581,0,96,108,1493,0,61,261,1315,0,820,575,1584,0,1553,1451,941,0,289,982,852,0,1587,1352,545,0,608,1337,852,0,787,609,1364,0,1386,1358,503,0,906,1084,1144,0,806,1046,895,0,832,996,1508,0,674,1391,632,0,79,589,359,0,242,1511,937,0,1555,1202,605,0,958,284,1074,0,262,801,467,0,5,1151,1484,0,1352,599,345,0,1574,743,1420,0,1334,830,669,0,1427,428,1601,0,1249,424,429,0,900,396,928,0,534,845,1185,0,1274,843,202,0,1257,1375,1270,0,1279,906,1144,0,704,2,476,0,117,1487,1500,0,1434,1555,162,0,1509,951,481,0,1375,1116,1253,0,1601,952,869,0,223,375,475,0,1244,606,1260,0,286,1007,24,0,357,404,269,0,618,759,556,0,1415,1192,1485,0,317,1159,306,0,1568,1492,1317,0,2,704,1103,0,919,879,1146,0,838,1208,978,0,631,45,1618,0,479,513,208,0,1469,474,1067,0,666,1089,1497,0,1140,499,1073,0,101,167,1058,0,1169,1164,1546,0,684,1584,592,0,1142,1469,713,0,33,209,71,0,1120,737,125,0,1340,1245,422,0,508,373,924,0,510,925,1454,0,557,285,1259,0,787,1364,1045,0,523,1139,862,0,1437,1320,546,0,309,1236,293,0,665,391,1258,0,152,548,360,0,1381,1528,771,0,663,1258,391,0,276,598,1002,0,1638,479,208,0,564,864,444,0,1212,1051,1240,0,909,165,167,0,865,421,1048,0,1082,1532,505,0,323,980,452,0,494,1015,1449,0,571,875,60,0,1582,401,1523,0,859,927,1561,0,416,164,1396,0,150,523,862,0,1405,121,772,0,675,547,1208,0,361,1312,107,0,580,877,1345,0,249,1013,1201,0,367,348,1639,0,886,1111,502,0,535,724,1506,0,260,101,271,0,1621,18,1559,0,1273,1609,351,0,1086,381,357,0,34,304,934,0,564,1518,1218,0,680,663,633,0,1233,34,1172,0,218,442,949,0,1592,1449,1267,0,1180,768,975,0,1195,442,1530,0,1415,129,279,0,178,1157,1182,0,1123,868,517,0,1383,737,1482,0,822,474,1199,0,1171,948,708,0,800,1397,175,0,741,330,1581,0,885,298,1640,0,20,1250,748,0,172,1190,548,0,256,1595,1475,0,1412,452,980,0,660,226,802,0,779,78,302,0,222,723,1154,0,1225,861,1470,0,1615,1252,1543,0,772,460,343,0,748,1250,212,0,1312,228,107,0,294,913,291,0,1279,435,1178,0,426,689,188,0,1551,680,633,0,1465,461,1460,0,1535,530,1131,0,1068,520,1229,0,540,1310,1181,0,106,1393,1417,0,752,977,1066,0,711,434,490,0,920,456,207,0,259,39,68,0,307,1154,423,0,731,902,1477,0,32,1298,595,0,1427,1376,428,0,409,524,780,0,796,202,334,0,459,1382,1510,0,602,242,319,0,1617,329,263,0,1531,130,1142,0,247,195,1033,0,1572,1360,1197,0,686,305,1485,0,198,882,1591,0,547,675,50,0,658,1631,1277,0,1330,697,764,0,272,1456,56,0,261,1290,936,0,296,950,473,0,1127,1450,611,0,583,748,212,0,1530,917,1212,0,531,1168,1579,0,844,1107,187,0,1117,786,1599,0,1092,561,1365,0,1632,776,1114,0,893,878,490,0,115,1044,270,0,622,624,662,0,16,238,526,0,1110,381,1086,0,1545,549,1171,0,228,929,544,0,1265,664,135,0,682,926,319,0,1347,1212,1240,0,1285,266,176,0,122,22,35,0,18,667,395,0,924,1636,1528,0,1085,1112,281,0,1083,565,225,0,1090,443,1134,0,1118,699,1170,0,1132,1283,907,0,464,810,1204,0,209,633,71,0,703,588,1041,0,1179,140,1277,0,1505,426,1638,0,468,1021,138,0,201,1630,777,0,1013,43,1301,0,829,336,765,0,83,892,1217,0,266,1285,397,0,193,1445,623,0,505,1302,1199,0,249,1335,559,0,94,1082,584,0,1539,1067,822,0,556,759,910,0,638,487,1018,0,256,47,318,0,1616,69,42,0,1166,247,651,0,1553,1330,1451,0,1551,1028,443,0,739,945,429,0,1091,1560,441,0,547,50,681,0,1531,561,130,0,1214,355,1547,0,631,1060,815,0,241,1495,26,0,1117,642,505,0,502,1447,953,0,1454,306,510,0,111,1162,599,0,135,1517,1243,0,825,1593,432,0,914,552,1351,0,1543,925,1615,0,1023,1194,666,0,1548,534,1054,0,811,475,722,0,281,277,1605,0,463,1635,967,0,654,510,1025,0,1472,815,1628,0,703,1241,588,0,1236,990,894,0,220,992,1463,0,792,630,79,0,153,1083,933,0,512,1103,159,0,1038,1492,1568,0,1259,285,1329,0,465,1337,608,0,181,402,1126,0,1425,859,770,0,647,674,485,0,1210,1416,361,0,1317,1492,1071,0,1585,530,1535,0,372,200,378,0,1542,352,118,0,22,692,919,0,460,1323,343,0,362,49,1448,0,129,1471,1033,0,518,291,1557,0,746,1238,694,0,1405,32,706,0,1503,930,756,0,1494,566,1413,0,276,1321,1389,0,730,239,103,0,1222,1581,1247,0,847,1633,855,0,679,176,173,0,1021,1409,1331,0,152,437,548,0,1360,1080,718,0,228,544,693,0,662,444,541,0,792,1474,1589,0,258,576,303,0,263,380,713,0,1195,25,1224,0,1016,1374,1308,0,1277,1631,316,0,177,235,367,0,103,620,730,0,1274,202,28,0,1065,1423,890,0,1138,837,987,0,1015,864,1218,0,1270,1596,1641,0,109,1228,1061,0,1574,1418,743,0,995,33,438,0,1274,312,379,0,1394,747,297,0,788,469,60,0,992,120,1095,0,1045,426,586,0,819,1098,582,0,1304,1386,1160,0,431,187,1169,0,1408,609,382,0,147,632,1200,0,434,571,1294,0,686,1485,1192,0,509,533,42,0,766,560,616,0,1036,813,635,0,1411,1465,1387,0,379,1335,1079,0,706,1399,823,0,741,753,1049,0,511,707,590,0,1241,1158,455,0,608,852,1295,0,462,369,976,0,472,319,242,0,383,515,1340,0,104,579,62,0,1193,683,1167,0,49,704,1074,0,222,981,201,0,275,306,901,0,1530,1212,1502,0,1415,604,950,0,204,1540,582,0,267,605,1265,0,863,1239,489,0,189,789,1621,0,548,437,1359,0,315,501,696,0,401,833,805,0,1198,1142,130,0,837,19,519,0,1237,1418,1574,0,164,370,147,0,904,1236,411,0,211,1542,1149,0,18,1336,667,0,1459,1182,971,0,1537,787,1045,0,1307,1330,764,0,1427,1601,798,0,998,184,1473,0,655,1262,255,0,176,1388,173,0,136,540,1181,0,310,691,771,0,1146,879,251,0,962,1519,736,0,1007,1490,267,0,1469,1142,474,0,1172,934,1176,0,1558,281,1112,0,1068,1229,801,0,1530,1502,394,0,115,477,1004,0,867,404,574,0,412,912,1284,0,1366,1486,1537,0,188,1614,586,0,1003,1050,1113,0,1216,1286,1628,0,564,1523,1518,0,324,174,1081,0,444,1130,564,0,443,1028,1134,0,1358,1104,480,0,803,1614,1108,0,1189,1337,1166,0,772,57,1405,0,243,35,1452,0,197,469,988,0,915,293,1562,0,1633,869,855,0,1414,1089,821,0,1223,4,225,0,951,716,277,0,193,619,876,0,549,118,24,0,442,218,917,0,371,636,778,0,1343,578,1369,0,948,1175,1265,0,1310,540,165,0,1636,924,373,0,25,625,8,0,529,314,1549,0,584,735,108,0,206,423,1433,0,749,609,1486,0,1484,716,5,0,1538,528,622,0,234,616,185,0,1356,715,157,0,84,90,550,0,1269,1309,1391,0,313,1428,1407,0,628,297,951,0,726,1363,923,0,897,1052,1101,0,1189,1166,983,0,1233,163,932,0,98,130,561,0,1156,26,1495,0,1191,1638,700,0,132,799,1005,0,467,238,16,0,863,286,118,0,1420,747,1574,0,610,199,1491,0,821,105,1619,0,516,75,231,0,804,734,1566,0,847,526,238,0,263,329,1089,0,512,326,878,0,143,783,392,0,936,1290,691,0,355,690,1592,0,396,1606,1100,0,1471,601,1033,0,840,575,7,0,778,139,23,0,887,1476,312,0,715,551,1541,0,1141,1562,629,0,663,71,633,0,962,733,1078,0,751,162,1275,0,399,120,344,0,699,1118,1434,0,432,521,618,0,892,676,1217,0,1173,97,1575,0,1402,527,249,0,1259,636,557,0,1419,1269,647,0,583,12,308,0,512,2,1103,0,462,1455,369,0,1302,822,1199,0,907,47,1132,0,153,126,587,0,899,1292,989,0,400,314,1351,0,327,116,568,0,1582,1523,1130,0,892,992,1095,0,696,1439,315,0,1571,715,1541,0,158,1566,40,0,1000,1596,1270,0,536,684,592,0,1622,316,1485,0,1547,1267,714,0,1019,550,93,0,380,1142,713,0,1603,1456,1393,0,243,47,1443,0,1373,1538,622,0,1237,566,1047,0,327,1404,116,0,1107,725,187,0,1269,133,1309,0,136,1102,1626,0,1442,230,1213,0,1302,498,822,0,835,1596,1527,0,695,757,1433,0,74,839,583,0,1321,1005,1016,0,522,384,585,0,592,1584,574,0,1012,449,77,0,465,82,195,0,624,1527,1367,0,189,923,1363,0,1424,532,278,0,1181,1310,1361,0,266,918,532,0,972,1013,1301,0,457,551,1248,0,226,1464,725,0,1628,1060,1216,0,666,1194,406,0,576,295,123,0,1534,922,1296,0,756,930,1512,0,430,106,388,0,1237,1047,1418,0,761,709,1064,0,47,1360,1443,0,1078,1110,1086,0,430,388,985,0,155,875,1504,0,637,1060,631,0,179,979,619,0,711,326,1516,0,11,229,1347,0,6,902,178,0,1165,1160,461,0,1623,1206,637,0,1080,335,1256,0,1636,676,244,0,217,630,504,0,567,1149,169,0,972,1301,1501,0,1413,600,281,0,638,817,758,0,1230,996,1637,0,841,679,1254,0,1541,960,1268,0,235,348,367,0,314,1261,1549,0,1081,197,988,0,918,678,532,0,155,1504,1094,0,707,1293,590,0,1422,1285,679,0,375,1028,1589,0,233,237,451,0,346,1550,1431,0,706,32,427,0,493,795,1384,0,990,1544,1184,0,440,523,1540,0,108,735,1493,0,38,841,1254,0,1028,995,1589,0,490,54,893,0,749,1486,1271,0,1597,656,518,0,410,498,1247,0,152,330,741,0,1329,458,1259,0,962,1086,357,0,516,231,831,0,323,714,102,0,1067,474,822,0,866,268,1407,0,368,983,930,0,1534,1296,361,0,358,1489,205,0,183,489,1121,0,1203,1311,854,0,445,1617,816,0,427,1399,706,0,288,1470,861,0,581,1511,865,0,777,857,1598,0,1365,561,1187,0,310,158,40,0,160,271,1048,0,1126,1577,1071,0,192,89,1264,0,979,1003,619,0,543,319,472,0,1191,959,1479,0,853,1410,81,0,180,889,596,0,221,1109,92,0,1257,1270,836,0,1223,225,610,0,198,806,895,0,185,1227,52,0,1638,426,1435,0,1182,1157,339,0,63,648,534,0,1490,1093,1555,0,87,1629,1048,0,1012,957,449,0,1576,1344,17,0,905,486,1059,0,893,54,634,0,1273,1165,1609,0,1548,845,534,0,710,976,1087,0,1042,593,20,0,501,1215,696,0,56,939,684,0,623,634,1129,0,1538,1074,709,0,1266,1031,444,0,465,195,1337,0,702,1045,586,0,180,255,1127,0,983,49,284,0,1237,1394,1496,0,93,1186,558,0,1507,27,1020,0,1149,1545,169,0,1013,80,43,0,349,1432,1363,0,1379,1558,1112,0,1439,246,456,0,559,1335,300,0,1378,111,599,0,723,1059,486,0,470,1390,1478,0,820,985,725,0,992,767,1463,0,1153,250,1587,0,1598,905,777,0,1622,1440,186,0,380,1417,1613,0,1515,944,846,0,1581,753,741,0,784,1304,1165,0,1344,693,17,0,508,31,373,0,962,168,1519,0,821,445,214,0,514,1001,1240,0,1316,1639,348,0,690,1503,738,0,1504,875,571,0,1003,1113,818,0,1247,498,1302,0,964,1511,242,0,1145,270,44,0,1202,1555,1533,0,455,0,497,0,200,572,378,0,620,1611,146,0,1618,396,900,0,579,782,946,0,482,1539,822,0,806,938,1046,0,44,491,1346,0,781,1055,239,0,1010,416,1396,0,117,639,1487,0,135,1332,948,0,1029,921,163,0,55,1563,1444,0,362,159,1103,0,1407,213,204,0,1115,1062,937,0,0,1578,393,0,1037,65,1411,0,819,523,150,0,1031,541,444,0,1018,11,1347,0,602,989,1163,0,1126,1071,1211,0,1627,1017,963,0,340,1412,980,0,751,1434,162,0,855,526,847,0,1640,963,688,0,1617,263,713,0,205,926,682,0,1027,478,1260,0,958,983,284,0,1601,1299,952,0,912,503,627,0,1390,1143,1478,0,1246,425,1014,0,577,1476,1482,0,1389,1120,1430,0,1370,1587,1379,0,588,1372,1041,0,733,648,1255,0,744,1322,280,0,666,406,263,0,294,137,1491,0,386,659,51,0,238,1633,847,0,19,894,519,0,598,276,1389,0,373,697,1248,0,796,1011,703,0,172,607,230,0,1625,1543,1252,0,1033,601,247,0,419,1462,977,0,328,1288,1524,0,463,128,1635,0,1451,279,465,0,1439,920,315,0,16,1569,21,0,190,1025,1159,0,677,891,115,0,1451,465,941,0,1003,818,876,0,796,28,202,0,470,1292,1150,0,1043,1026,797,0,774,453,203,0,220,1333,120,0,384,410,1281,0,120,244,1095,0,826,1306,134,0,322,855,869,0,227,876,818,0,161,949,1195,0,1150,1292,929,0,12,484,308,0,625,810,464,0,1425,763,1109,0,1199,474,1585,0,4,377,933,0,473,31,569,0,813,1036,32,0,363,1209,370,0,783,640,1220,0,73,803,1108,0,1584,1499,574,0,70,1315,261,0,1316,251,1639,0,269,685,357,0,616,234,766,0,677,115,1004,0,1587,1378,1352,0,312,1041,887,0,244,1528,1636,0,1076,1244,1260,0,1366,702,586,0,1502,493,394,0,1019,1190,230,0,641,1077,1014,0,129,265,1471,0,1578,1376,1243,0,1223,166,377,0,1069,1034,1438,0,123,1206,1623,0,390,1121,489,0,814,1591,292,0,996,739,1508,0,461,1221,1406,0,775,756,1512,0,734,765,70,0,799,1287,803,0,266,532,1424,0,13,401,1253,0,237,233,942,0,368,1230,1637,0,813,32,1405,0,1398,1081,1529,0,302,1568,1317,0,1125,803,1604,0,189,1363,789,0,58,809,241,0,110,1186,585,0,1246,1473,425,0,324,1398,1278,0,742,1300,672,0,1484,1077,277,0,440,1400,1331,0,504,492,471,0,1246,1626,1102,0,774,878,834,0,251,879,1173,0,716,1484,277,0,1519,727,340,0,1525,405,144,0,185,1245,1227,0,1073,182,1263,0,1554,630,792,0,1065,1381,61,0,375,1589,1474,0,378,572,1124,0,1145,1403,858,0,328,1126,1211,0,769,1514,1213,0,1553,1152,1330,0,397,1285,413,0,156,559,300,0,1407,1597,213,0,727,269,39,0,268,313,1407,0,941,608,1295,0,1420,297,747,0,1627,963,1207,0,1388,1462,112,0,309,151,990,0,830,1501,842,0,286,1490,1007,0,657,1461,374,0,1626,95,136,0,321,1210,66,0,1064,704,476,0,998,1181,179,0,1598,857,198,0,550,22,84,0,596,526,855,0,1142,380,1613,0,601,1631,621,0,58,1611,1430,0,653,1220,10,0,347,302,1594,0,573,1122,860,0,1442,1019,230,0,93,522,754,0,438,1554,995,0,311,885,694,0,984,374,75,0,207,456,1354,0,1027,755,478,0,637,1029,1060,0,291,518,294,0,1268,1421,1541,0,1358,1386,1104,0,1209,408,403,0,401,805,1523,0,270,1044,491,0,260,167,101,0,453,1567,203,0,1074,1538,958,0,1299,0,455,0,520,1068,509,0,898,288,861,0,584,1082,735,0,619,1003,876,0,1046,938,1036,0,466,776,1632,0,1371,1241,1011,0,1558,1379,1494,0,264,709,1339,0,285,1301,1329,0,458,192,1264,0,407,750,1007,0,46,806,366,0,703,1041,28,0,629,287,563,0,230,1190,172,0,880,85,1641,0,196,274,238,0,1032,1455,462,0,765,1440,305,0,377,475,955,0,179,114,979,0,183,162,489,0,1157,902,364,0,974,1322,833,0,164,416,65,0,817,1526,1030,0,1368,1436,1148,0,731,364,902,0,732,476,774,0,443,525,1551,0,356,1540,204,0,502,1136,1040,0,1109,72,92,0,97,753,646,0,809,448,1517,0,1449,714,1267,0,1599,786,398,0,1236,904,293,0,1627,1207,468,0,364,538,339,0,1172,34,934,0,323,452,1324,0,136,95,540,0,965,1569,526,0,1324,1483,714,0,909,1311,53,0,897,795,1052,0,634,623,893,0,260,1457,1099,0,300,577,224,0,1607,173,1336,0,1157,364,339,0,1245,1340,515,0,305,1440,1622,0,575,1107,7,0,575,840,1075,0,305,1622,1485,0,1127,409,1450,0,984,64,374,0,323,1009,980,0,909,1097,1311,0,900,227,1618,0,899,544,1292,0,1241,703,1011,0,1279,1178,145,0,1161,922,1349,0,983,1166,49,0,569,149,790,0,390,489,1239,0,958,930,983,0,867,840,68,0,1580,481,1242,0,275,310,771,0,1445,1100,623,0,475,375,1474,0,1556,889,611,0,1182,339,124,0,1227,9,437,0,1094,1162,1148,0,802,1194,671,0,948,1332,708,0,1265,241,664,0,542,477,270,0,1091,483,1560,0,402,1201,1008,0,603,390,1239,0,384,1281,585,0,474,1142,1198,0,918,266,397,0,1205,327,568,0,3,1323,755,0,163,1060,1029,0,14,1008,972,0,888,1592,738,0,1246,1014,626,0,1275,215,15,0,542,134,477,0,224,1482,1321,0,440,1006,1400,0,1609,1465,1411,0,978,1208,547,0,1101,716,897,0,785,1376,1427,0,232,405,458,0,1347,1240,1018,0,588,1241,497,0,681,50,1229,0,1513,844,431,0,167,165,1058,0,1328,1319,1513,0,995,792,1589,0,1268,960,1152,0,1401,298,1380,0,1140,843,527,0,435,1620,272,0,403,485,147,0,1177,153,587,0,1381,771,261,0,583,839,748,0,328,181,1126,0,429,762,1319,0,386,117,1500,0,1196,883,808,0,1476,300,312,0,1094,1148,155,0,606,3,1027,0,1337,247,1166,0,792,385,1474,0,1079,1274,379,0,506,668,1251,0,1550,1022,191,0,1603,106,939,0,459,1018,1240,0,1496,1413,566,0,506,784,1341,0,124,414,1182,0,659,1219,573,0,1243,785,1332,0,1378,599,1352,0,914,1488,1128,0,1022,661,191,0,1375,1253,1270,0,85,836,1612,0,271,1457,260,0,394,493,1384,0,1128,1488,376,0,1223,1491,166,0,1137,211,69,0,971,1182,414,0,595,1520,581,0,677,976,891,0,971,414,1069,0,1450,1092,1556,0,487,5,1101,0,1415,950,1192,0,1562,293,74,0,1368,1148,1378,0,1108,1614,1525,0,1379,566,1494,0,571,174,1294,0,720,453,1606,0,1148,111,1378,0,1267,1547,355,0,248,692,550,0,218,154,917,0,410,1247,360,0,1507,134,1306,0,1638,208,1505,0,957,77,449,0,393,1578,507,0,1491,137,166,0,1548,1054,1009,0,1516,719,1504,0,704,362,1103,0,755,969,478,0,556,910,927,0,430,684,939,0,1562,1141,915,0,275,317,306,0,1076,1260,1564,0,776,466,1121,0,1236,309,990,0,618,1355,8,0,781,239,812,0,50,675,1303,0,1022,698,1222,0,943,217,578,0,599,1162,1123,0,572,1128,1133,0,215,66,1210,0,1307,1235,279,0,446,1520,1115,0,1567,815,417,0,1074,284,49,0,49,301,1448,0,1536,745,170,0,1602,186,804,0,572,552,914,0,640,1615,333,0,1505,1057,426,0,1137,1024,881,0,728,377,166,0,1435,447,358,0,1179,1162,140,0,913,199,1180,0,1584,575,1075,0,916,243,1443,0,201,1188,1630,0,1274,28,312,0,1049,437,741,0,350,87,421,0,496,746,349,0,1406,1043,1411,0,1080,1572,848,0,573,338,1583,0,38,413,1422,0,1618,45,1446,0,120,1333,344,0,1434,1533,1555,0,1221,1160,503,0,150,1640,298,0,502,953,1136,0,271,615,1048,0,1233,1114,34,0,1069,665,1258,0,624,1367,1582,0,1147,96,354,0,158,901,1566,0,1265,605,1495,0,1575,908,268,0,673,970,1602,0,1181,1361,179,0,681,520,567,0,1311,1361,53,0,117,386,1477,0,1362,1420,743,0,42,793,567,0,1213,1340,422,0,375,223,518,0,968,1113,1106,0,57,772,1447,0,773,1535,1131,0,1077,1151,626,0,559,1013,249,0,359,1403,1346,0,19,436,411,0,144,803,73,0,1173,52,97,0,15,215,1035,0,568,1608,1205,0,168,685,727,0,1552,1383,887,0,217,1369,578,0,56,1178,272,0,705,709,264,0,1640,746,885,0,1161,1392,1150,0,1501,1301,842,0,913,1557,291,0,543,1119,682,0,663,680,1258,0,1467,1466,372,0,1117,1599,661,0,1417,1456,1613,0,232,144,405,0,712,355,1214,0,1542,211,352,0,423,486,1433,0,700,254,358,0,1083,4,933,0,1493,735,36,0,750,549,24,0,1242,1384,1580,0,1381,1065,890,0,1330,1307,1451,0,151,1544,990,0,112,1462,419,0,1507,935,206,0,551,1636,373,0,1555,1093,162,0,577,300,1476,0,519,1025,190,0,554,595,865,0,460,121,884,0,1424,977,1462,0,354,1231,1585,0,680,1410,1258,0,222,1154,1232,0,25,1530,394,0,465,1033,82,0,1193,742,553,0,130,1131,530,0,1412,340,259,0,1293,1325,528,0,1169,187,1464,0,1264,232,458,0,1237,1496,566,0,1383,1482,887,0,281,1558,1413,0,778,1608,139,0,1464,660,1164,0,1452,35,1146,0,799,132,1287,0,45,1567,1446,0,1522,410,360,0,122,501,48,0,1469,1617,713,0,186,1440,734,0,404,357,381,0,551,960,1541,0,30,1021,468,0,86,1501,830,0,1419,485,403,0,347,1594,1577,0,798,1601,869,0,178,639,6,0,1359,219,607,0,578,1122,299,0,1531,1187,561,0,127,55,88,0,580,1345,210,0,1482,1476,887,0,658,1094,1504,0,235,177,1600,0,1379,1112,469,0,258,295,576,0,607,172,548,0,104,32,554,0,812,450,1533,0,719,1091,1504,0,797,408,1209,0,262,1110,1078,0,10,679,653,0,1334,359,589,0,563,287,415,0,737,507,448,0,521,143,759,0,399,1159,1528,0,1342,100,425,0,814,905,1598,0,25,1135,1224,0,433,1023,666,0,1573,7,1513,0,768,1180,770,0,1283,1132,1313,0,308,954,629,0,1116,1375,881,0,46,1188,513,0,707,835,1293,0,1073,398,182,0,1146,318,650,0,1559,961,1133,0,1300,994,1348,0,673,846,970,0,722,475,454,0,960,457,1330,0,840,7,991,0,143,1593,1072,0,1090,1222,828,0,1111,895,635,0,369,891,976,0,952,1158,655,0,932,321,1632,0,1406,1387,1460,0,1333,1168,987,0,1211,1071,1492,0,1245,515,1227,0,257,149,1423,0,168,962,357,0,59,1050,114,0,1420,1362,1183,0,901,804,1566,0,720,1567,453,0,322,180,596,0,1115,535,1506,0,1264,89,1374,0,870,1291,1525,0,75,516,984,0,846,944,342,0,243,1452,47,0,1083,225,4,0,552,200,1226,0,902,1157,178,0,235,529,1549,0,807,1541,1421,0,171,756,1266,0,1278,1342,425,0,398,1073,1524,0,1216,1233,1172,0,1118,812,1533,0,1202,791,605,0,536,145,1178,0,1192,336,829,0,349,746,688,0,375,518,1028,0,456,920,1439,0,473,569,790,0,1407,1428,1597,0,415,389,105,0,621,1631,441,0,637,1353,1623,0,1145,542,270,0,387,327,1205,0,1349,303,968,0,1227,437,1049,0,1467,966,341,0,552,572,200,0,65,363,164,0,643,417,1472,0,304,1121,934,0,978,547,169,0,641,1605,277,0,314,1226,873,0,446,581,1520,0,1602,67,846,0,1441,693,926,0,951,1509,716,0,725,1464,187,0,896,514,1051,0,480,342,944,0,948,1265,135,0,419,752,378,0,356,440,1540,0,969,755,460,0,1081,988,1529,0,420,1129,1278,0,1137,856,273,0,1056,798,1303,0,1152,960,1330,0,245,528,643,0,1441,1489,1408,0,423,206,935,0,319,926,141,0,116,1232,307,0,1626,1151,540,0,701,495,1625,0,644,997,1541,0,482,410,384,0,778,636,1259,0,150,1401,819,0,1640,862,963,0,483,719,326,0,98,1131,130,0,1507,1306,27,0,817,1018,1510,0,267,1265,1175,0,848,1572,966,0,901,306,331,0,557,826,669,0,914,529,1488,0,784,868,1341,0,1445,876,900,0,519,894,1184,0,418,470,1478,0,1063,278,986,0,913,294,1491,0,705,528,1538,0,1467,752,1066,0,350,1163,989,0,1158,1299,455,0,1616,55,1444,0,36,735,1082,0,1246,626,1626,0,1604,37,670,0,1308,89,458,0,680,488,1410,0,1632,1114,932,0,246,696,1588,0,336,296,257,0,210,818,580,0,27,371,1020,0,415,903,563,0,7,1107,844,0,709,761,732,0,1314,177,367,0,1005,276,132,0,1163,350,421,0,1459,971,1357,0,791,1156,1495,0,559,80,1013,0,989,141,899,0,1346,491,931,0,731,1477,1105,0,1635,986,967,0,634,434,324,0,1087,1004,206,0,408,797,1026,0,704,1064,1074,0,1138,531,436,0,1128,76,1133,0,494,1592,888,0,594,149,569,0,1355,221,1135,0,1120,827,1482,0,385,1070,562,0,1592,494,1449,0,165,540,1058,0,303,1349,922,0,1563,55,127,0,1570,1206,295,0,922,1161,1150,0,898,645,484,0,1606,396,1618,0,1260,478,1564,0,1575,721,1173,0,701,1625,481,0,310,1174,691,0,669,830,557,0,1517,135,809,0,724,240,1506,0,740,332,113,0,1544,207,918,0,554,615,104,0,1322,805,833,0,404,381,1569,0,979,1050,1003,0,318,47,650,0,970,506,1341,0,934,940,1176,0,863,118,282,0,959,937,1062,0,1485,265,1415,0,549,407,1171,0,1602,846,673,0,765,1315,70,0,718,993,916,0,222,1232,1404,0,493,1052,795,0,784,1565,1304,0,387,870,188,0,119,614,202,0,1307,764,1235,0,331,1454,1590,0,1102,136,998,0,589,573,1583,0,639,1459,1357,0,31,764,697,0,1570,295,1210,0,1376,785,1243,0,1318,131,861,0,1124,572,1133,0,660,802,671,0,699,751,1275,0,1206,1029,637,0,1492,1431,29,0,1325,622,528,0,1291,870,1205,0,106,406,802,0,388,802,226,0,91,14,1583,0,177,866,582,0,509,42,567,0,601,1471,265,0,1552,887,1041,0,344,987,399,0,814,1598,198,0,1421,1295,982,0,417,815,1472,0,1093,863,162,0,524,409,1127,0,257,1423,1065,0,85,1176,940,0,5,716,1101,0,1279,1395,613,0,137,294,518,0,1176,880,511,0,1536,525,1193,0,1421,832,807,0,1454,925,1543,0,1420,1183,701,0,454,562,1032,0,1077,1484,1151,0,885,746,694,0,256,1261,1595,0,1327,1573,762,0,578,537,1122,0,538,1369,500,0,959,1062,1479,0,351,517,1273,0,26,1156,58,0,1030,1289,758,0,1540,523,819,0,684,536,56,0,1344,107,228,0,382,1441,1408,0,1539,649,816,0,1137,273,1024,0,1135,221,1320,0,1005,799,232,0,119,1140,1263,0,744,280,1518,0,585,754,522,0,362,1448,159,0,1133,961,1124,0,814,292,320,0,780,773,98,0,1072,1593,1624,0,326,719,1516,0,1528,244,399,0,1306,826,27,0,337,1016,1308,0,1184,1544,413,0,1341,1251,668,0,1624,481,1625,0,755,1323,460,0,628,951,600,0,916,696,1215,0,1299,1601,428,0,479,1191,1479,0,1294,324,434,0,959,1119,543,0,1158,952,1299,0,108,524,1371,0,957,488,591,0,15,699,1275,0,1588,696,993,0,301,49,1166,0,807,1039,997,0,613,435,1279,0,1475,1572,1197,0,418,989,1292,0,1546,1164,671,0,1377,105,767,0,10,1254,679,0,641,1014,100,0,608,941,465,0,21,381,1110,0,695,905,814,0,739,712,945,0,393,507,1372,0,698,828,1222,0,124,339,538,0,1201,1402,249,0,970,846,342,0,777,1630,857,0,1430,809,58,0,195,82,1033,0,397,1544,918,0,293,839,74,0,1136,1480,1040,0,1579,1470,593,0,338,573,1219,0,1527,624,835,0,756,171,888,0,231,1461,596,0,1318,861,1225,0,749,1055,609,0,622,541,1373,0,0,1299,428,0,1351,1226,400,0,1537,1045,702,0,253,451,997,0,881,1375,1257,0,17,693,1441,0,593,411,531,0,251,1173,721,0,533,1616,42,0,744,1518,1523,0,354,1493,1231,0,952,322,869,0,987,1168,1138,0,1357,971,1069,0,255,180,322,0,1522,110,585,0,901,1010,804,0,768,770,356,0,451,1249,1328,0,780,96,1147,0,125,737,448,0,38,654,413,0,656,1134,1028,0,145,536,592,0,1326,1170,1035,0,712,717,355,0,1516,571,434,0,642,1022,1222,0,515,9,1227,0,309,915,151,0,1417,263,406,0,1457,160,365,0,374,1461,75,0,731,1105,659,0,147,1200,164,0,644,1541,807,0,808,883,439,0,1149,567,793,0,1280,424,739,0,639,1357,1438,0,1128,572,914,0,197,1081,174,0,1053,1297,1479,0,1196,927,910,0,407,1175,948,0,693,1344,228,0,640,10,1220,0,1110,262,467,0,1153,1362,956,0,1366,1614,1125,0,1144,1395,1279,0,686,829,305,0,268,721,1575,0,253,424,1249,0,854,1143,1282,0,1438,1357,1069,0,745,1219,170,0,79,359,1346,0,692,560,879,0,279,1235,604,0,438,492,1554,0,108,1371,1011,0,535,1298,1036,0,638,758,874,0,450,791,1202,0,239,1271,103,0,238,274,1633,0,1220,653,138,0,1043,503,1026,0,429,424,1280,0,1438,999,1487,0,522,903,214,0,389,767,105,0,50,1303,274,0,1480,462,976,0,710,757,886,0,1372,497,393,0,434,54,490,0,652,128,463,0,58,1156,146,0,970,1341,1602,0,1550,191,661,0,1335,843,1079,0,1106,1113,59,0,440,356,1006,0,842,557,830,0,708,1332,785,0,36,1082,505,0,66,1275,183,0,72,565,92,0,170,591,525,0,999,1500,1487,0,863,1093,286,0,506,1251,868,0,768,356,204,0,762,945,1214,0,131,220,954,0,943,1122,217,0,1025,519,555,0,574,145,592,0,1550,346,1022,0,268,908,313,0,603,282,1137,0,1055,749,1271,0,917,1530,442,0,1550,661,29,0,964,1163,865,0,44,1346,1403,0,1098,1380,1600,0,603,1239,282,0,320,757,695,0,1343,1369,538,0,369,1455,891,0,245,1293,528,0,700,1119,1191,0,589,537,573,0,1597,1557,213,0,104,615,1289,0,336,61,765,0,1244,1429,606,0,1596,835,41,0,230,353,1213,0,1405,823,121,0,180,1127,611,0,889,1556,231,0,451,1328,233,0,736,1054,648,0,819,582,1540,0,974,325,1228,0,912,627,1284,0,792,1346,385,0,1167,994,1300,0,964,865,1511,0,279,129,1033,0,1502,229,493,0,579,1289,782,0,653,1607,138,0,278,532,967,0,614,1263,94,0,212,12,583,0,582,1098,1600,0,1216,1172,511,0,58,241,26,0,11,493,229,0,1221,503,1043,0,1546,671,157,0,1212,917,154,0,895,292,882,0,1380,298,612,0,107,1035,361,0,60,469,197,0,1434,751,699,0,1609,1411,1590,0,84,122,90,0,1477,51,1105,0,723,486,1154,0,268,866,1314,0,666,263,1089,0,1539,384,649,0,706,823,1405,0,688,746,1640,0,982,1637,832,0,1527,1000,1253,0,736,648,733,0,1397,109,1061,0,106,430,939,0,732,774,203,0,679,1607,653,0,496,1238,746,0,872,350,1478,0,1231,36,505,0,1504,571,1516,0,1585,1535,1155,0,1622,186,668,0,1447,502,1111,0,107,1326,1035,0,886,292,1111,0,1459,639,178,0,698,1022,1350,0,1372,1552,1041,0,666,1497,433,0,678,967,532,0,311,298,885,0,690,355,717,0,1529,988,100,0,676,433,1217,0,132,1002,1287,0,1317,1071,1577,0,667,1336,173,0,63,534,1634,0,1435,358,254,0,1415,265,129,0,1528,317,771,0,980,1519,340,0,1364,609,1408,0,61,336,1065,0,1264,1374,1005,0,1140,1073,1263,0,784,1165,1273,0,1584,985,820,0,88,533,1068,0,446,937,581,0,495,701,236,0,1026,412,850,0,1610,127,88,0,1060,1233,1216,0,50,1096,1229,0,1537,1486,787,0,1412,1327,1483,0,573,299,1122,0,1383,1552,737,0,1144,965,1461,0,222,1404,1385,0,1337,1189,289,0,1042,748,904,0,811,1447,772,0,411,1236,19,0,257,1065,336,0,329,1617,445,0,382,17,1441,0,1481,1515,729,0,853,1438,1034,0,1084,404,1569,0,1121,304,776,0,439,783,1220,0,806,857,366,0,157,715,942,0,293,915,309,0,300,224,337,0,518,1557,1597,0,516,1365,984,0,107,1344,1326,0,1513,7,844,0,1518,280,871,0,113,769,1213,0,1401,1380,1098,0,1341,668,186,0,526,596,965,0,481,1580,1509,0,1002,37,1604,0,717,851,690,0,47,907,1360,0,999,386,1500,0,1292,544,929,0,1129,324,1278,0,1560,1088,301,0,1475,966,1572,0,853,999,1438,0,690,851,1503,0,737,1372,507,0,856,69,1616,0,589,79,537,0,912,412,1026,0,871,280,1185,0,426,1057,689,0,88,1458,1255,0,824,1481,133,0,881,836,603,0,387,689,1057,0,295,258,1416,0,1523,564,1130,0,1507,1004,477,0,1270,1612,836,0,190,987,837,0,721,1639,251,0,1184,894,990,0,466,183,1121,0,366,857,1630,0,1333,987,344,0,1141,48,252,0,390,934,1121,0,1211,29,1288,0,1385,1505,981,0,553,672,338,0,1508,1039,832,0,432,1204,810,0,145,906,1279,0,1009,1054,736,0,1322,744,805,0,1012,488,957,0,109,127,1634,0,869,1303,798,0,1397,800,1563,0,973,683,1193,0,341,1595,1466,0,904,411,1042,0,864,564,1218,0,739,996,712,0,880,1176,85,0,810,825,432,0,654,38,1254,0,553,742,672,0,268,1314,721,0,1410,853,1034,0,1551,209,33,0,897,1509,795,0,8,1355,1135,0,220,1579,1333,0,106,802,388,0,122,48,903,0,975,1557,913,0,1545,1542,549,0,1448,1088,159,0,1000,1270,1253,0,646,908,97,0,1490,1555,605,0,550,692,22,0,208,513,1188,0,700,205,1119,0,1502,1212,229,0,1249,451,253,0,1548,323,871,0,409,98,1450,0,396,1100,928,0,503,1160,1386,0,1177,587,1586,0,716,1509,897,0,640,1254,10,0,450,812,239,0,915,920,151,0,1328,431,194,0,1193,1521,973,0,346,1431,1038,0,110,548,1190,0,508,594,569,0,289,368,1637,0,1463,954,220,0,337,156,300,0,1341,186,1602,0,1046,635,895,0,1340,1213,1514,0,203,1567,417,0,734,1440,765,0,1477,902,6,0,1199,1585,1231,0,1256,1588,993,0,287,1463,389,0,1168,1333,1579,0,101,540,1151,0,1485,316,265,0,1147,1535,773,0,962,1078,1086,0,574,404,906,0,781,812,1118,0,205,682,1119,0,1284,824,412,0,1061,325,1116,0,1107,575,820,0,1365,64,984,0,1073,328,1524,0,1064,709,1074,0,727,685,269,0,1409,30,1139,0,878,326,711,0,581,865,595,0,126,606,1429,0,879,766,234,0,308,74,583,0,939,56,1603,0,481,1420,701,0,1271,670,103,0,1303,1633,274,0,497,0,393,0,1474,385,475,0,899,926,693,0,654,1254,333,0,604,31,473,0,549,1542,118,0,1014,1077,626,0,1477,6,639,0,1056,1427,798,0,1048,421,87,0,943,573,860,0,1416,1210,295,0,1404,387,1385,0,1014,425,100,0,595,1298,1520,0,330,1247,1581,0,739,429,1280,0,1217,1619,105,0,1612,1641,85,0,394,625,25,0,360,110,1522,0,1338,850,412,0,360,548,110,0,183,1275,162,0,180,611,889,0,784,506,1565,0,87,872,1629,0,1123,345,599,0,94,99,334,0,37,1002,620,0,317,1528,1159,0,15,1035,699,0,41,707,880,0,434,711,1516,0,505,1199,1231,0,1380,529,1600,0,5,874,1151,0,1160,1221,461,0,1458,88,1068,0,659,597,731,0,347,1583,302,0,631,815,45,0,1348,672,1300,0,1609,236,351,0,1425,770,1180,0,1192,829,686,0,1605,1085,281,0,875,155,1436,0,450,239,730,0,330,152,360,0,893,1606,878,0,760,687,126,0,48,315,252,0,1016,1005,1374,0,940,934,390,0,302,1583,779,0,540,95,1626,0,303,1534,258,0,1456,1603,56,0,394,1384,625,0,791,1495,605,0,147,370,403,0,1166,651,301,0,54,434,634,0,754,585,1186,0,1144,1569,965,0,815,1060,1628,0,1620,1456,272,0,1534,303,922,0,1592,690,738,0,871,1015,1518,0,1220,1021,808,0,506,868,668,0,397,413,1544,0,743,1418,956,0,27,826,636,0,872,1478,1099,0,1334,86,830,0,1606,1446,1567,0,820,725,1107,0,760,1429,1244,0,877,818,1113,0,606,1027,1260,0,40,1566,1174,0,66,183,466,0,248,1213,692,0,126,1429,760,0,120,399,244,0,1284,944,824,0,365,160,1629,0,856,1616,1444,0,1091,719,483,0,1427,1056,1208,0,1237,747,1394,0,1010,1200,632,0,1213,248,1442,0,1045,447,426,0,886,502,1040,0,310,275,158,0,607,740,353,0,853,386,999,0,153,546,1083,0,652,1066,1063,0,423,1272,307,0,1145,44,1403,0,854,1106,59,0,1089,329,445,0,1401,1098,819,0,1638,1191,479,0,510,654,333,0,869,1633,1303,0,131,645,861,0,76,1128,376,0,1204,618,8,0,1409,1021,30,0,919,1146,911,0,62,579,946,0,1080,848,652,0,1190,1019,558,0,1595,1261,873,0,221,556,1109,0,657,374,1395,0,1624,825,1242,0,715,1571,942,0,196,238,467,0,132,276,1002,0,835,1325,1293,0,1141,252,915,0,535,1036,724,0,522,649,384,0,560,692,1213,0,717,712,996,0,691,1290,771,0,297,628,1394,0,1165,461,1609,0,883,1196,759,0,700,358,205,0,1052,493,11,0,763,1425,199,0,1608,568,139,0,1422,413,1285,0,1164,660,671,0,877,968,1345,0,1308,43,80,0,460,884,969,0,240,724,46,0,807,832,1039,0,1480,710,1040,0,1438,1487,639,0,775,1512,958,0,1037,1043,570,0,1084,906,404,0,753,52,1049,0,184,998,193,0,576,968,303,0,1314,866,177,0,785,1208,838,0,513,1297,46,0,651,621,301,0,83,105,1377,0,1265,1495,241,0,841,1422,679,0,240,1053,1506,0,817,638,1018,0,1242,481,1624,0,618,1204,432,0,226,660,1464,0,373,1248,551,0,519,190,837,0,876,1445,193,0,1392,1161,1106,0,1576,382,1055,0,1447,811,953,0,1457,365,1099,0,950,604,473,0,1437,794,1320,0,878,774,2,0,1556,831,231,0,1593,521,432,0,454,1032,722,0,1588,1256,335,0,1190,558,110,0,870,1525,188,0,1360,718,1443,0,1286,1472,1628,0,562,1455,1032,0,1443,718,916,0,1389,1430,598,0,541,775,1373,0,607,353,230,0,392,759,143,0,1519,168,727,0,1196,1400,216,0,445,816,214,0,950,336,1192,0,300,1335,379,0,1581,646,753,0,964,602,1163,0,654,555,413,0,1049,52,1227,0,828,1167,683,0,1180,975,913,0,1591,882,292,0,253,1039,424,0,273,1444,175,0,878,2,512,0,1068,262,1458,0,1374,89,1308,0,8,625,464,0,565,1320,92,0,85,940,836,0,1044,891,1070,0,67,1391,729,0,1351,529,914,0,224,577,1482,0,644,807,997,0,763,565,72,0,1627,1336,1017,0,813,1405,57,0,1109,859,1425,0,179,1361,114,0,462,722,1032,0,357,685,168,0,140,1162,1094,0,1056,675,1208,0,1521,443,683,0,862,30,1207,0,1356,1194,1023,0,1366,586,1614,0,892,83,992,0,1421,982,832,0,41,880,1596,0,142,1362,1153,0,1276,1599,1524,0,905,1059,1234,0,584,99,94,0,1191,1119,959,0,1599,398,1524,0,624,1325,835,0,545,345,517,0,995,1554,792,0,1358,944,627,0,1627,1607,1336,0,1469,1067,1617,0,1278,425,420,0,1304,1160,1165,0,495,1454,1543,0,1187,1531,1620,0,1195,1224,161,0,1513,1319,762,0,1029,1206,921,0,1021,1331,808,0,815,1567,45,0,346,1350,1022,0,1634,127,63,0,112,395,667,0,748,1042,20,0,669,858,359,0,215,1210,361,0,1627,468,1607,0,487,11,1018,0,1225,1579,1318,0,301,621,1560,0,1571,237,942,0,677,1004,976,0,1396,164,1200,0,701,1183,236,0,647,1269,674,0,1247,642,1222,0,1326,1576,781,0,1187,64,1365,0,1070,385,931,0,101,758,271,0,1362,142,1183,0,1505,1385,1057,0,1015,102,1449,0,1213,353,113,0,193,623,1129,0,459,1510,1018,0,867,39,269,0,416,1010,65,0,1109,927,859,0,495,1543,1625,0,1606,1618,1446,0,555,654,1025,0,961,18,395,0,1578,428,1376,0,1467,848,966,0,377,955,3,0,698,1348,994,0,1134,313,1090,0,263,1417,380,0,629,1562,74,0,1177,546,153,0,1503,888,738,0,1097,260,1143,0,408,850,403,0,571,60,174,0,804,1010,1602,0,253,997,1039,0,1491,199,913,0,540,101,1058,0,462,1136,722,0,782,1289,1030,0,2,774,476,0,982,1295,852,0,1308,1329,1301,0,105,83,1217,0,136,1181,998,0,1169,233,194,0,453,774,834,0,65,1010,901,0,1044,1070,931,0,123,1353,210,0,1445,900,928,0,667,1388,112,0,427,104,62,0,210,1345,123,0,541,622,662,0,77,1219,659,0,1024,273,175,0,312,300,379,0,1584,430,985,0,1053,1479,1062,0,1320,565,546,0,140,658,1277,0,551,433,1636,0,127,109,1563,0,883,392,439,0,113,353,740,0,290,1228,109,0,1164,1169,1464],



"edges" : []





}




