function startAnimation(models){


  //la funzione necesita che i modelli vengano passati dall'esterno

  
  var triangle = new PhiloGL.O3D.Model({
    vertices: [ 0,  1, 0,
               -1, -1, 0,
                1, -1, 0],

    colors: [1, 0, 0, 1,
             0, 1, 0, 1,
             0, 0, 1, 1]
  });

  var square = new PhiloGL.O3D.Model({
    vertices: [ 1,  1, 0,
               -1,  1, 0,
                1, -1, 0,
               -1, -1, 0],

    colors: [0.5, 0.5, 1, 1,
             0.5, 0.5, 1, 1,
             0.5, 0.5, 1, 1,
             0.5, 0.5, 1, 1]
  });

   var square2 = new PhiloGL.O3D.Model({
    vertices: [ 2,  2, 0,
               -2,  2, 0,
                2, -2, 0,
               -2, -2, 0],

    colors: [0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7]
  });

              square_t1 = {t:"translate",t0: 0,t1: 3000,xf:0.5,yf:0.5,zf:-5,dx:0,dy:0,dz:0};
              square_t2 = {t:"rotate",t0: 3000,t1: 5000,degreesx:90,degreesy:90,degreesz:0,rx:0,ry:0,rz:0};


              square2_t1 = {t:"translate",t0: 0,t1: 3000,xf:-1.5,yf:0,zf:0,dx:0,dy:0,dz:0};
              

              tri_t1 = {t:"translate",t0: 0,t1: 3000,xf:1.5,yf:0,zf:0,dx:0,dy:0,dz:0};
              tri_t2 = {t:"scale",t0: 0,t1: 3000,x:2,y:0.7,z:2,sx:1,sy:1,sz:1};
              tri_t3 = {t:"rotate",t0:0, t1:3000, degreesx:90,degreesy:0,degreesz:0,rx:0,ry:0,rz:0};



              var struct1 = {obj:triangle,n:3,transitions: [tri_t3,tri_t1,tri_t2],x0:-1.5,y0:0,z0:-7};
              var struct2 = {obj:square,n:4,transitions: [square_t1,square_t2,tri_t2],x0:1.5,y0:0,z0:-7};
              var struct3 = {obj:square2,n:4,transitions: [square2_t1],x0:0,y0:0,z0:-7};




              var animations = [struct1,struct2];

              webGLStart(animations);
}

function webGLStart(anim) {

  var animations = anim;
  //Load models
  var anims =[];
  var objs =[];
  


 

  var x =0,obj;

  //Create App
  PhiloGL('lesson03-canvas', {
    program: {
      from: 'ids',
      vs: 'shader-vs',
      fs: 'shader-fs'
    },
    onError: function() {
      alert("An error ocurred while loading the application");
    },
    onLoad: function(app) {
      var gl = app.gl,
          canvas = app.canvas,
          program = app.program,
          camera = app.camera,
          view = new PhiloGL.Mat4,
          rTri = 0, rSquare = 0;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      
      camera.view.id();
      
      function setupElement(elem) {
        //update element matrix
        elem.update();
        //get new view matrix out of element and camera matrices
        view.mulMat42(camera.view, elem.matrix);
        //set buffers with element data
        program.setBuffers({
          'aVertexPosition': {
            value: elem.vertices,
            size: 3
          },

          'aVertexColor': {
            value: elem.colors,
            size: 4
          }
        });
        //set uniforms
        program.setUniform('uMVMatrix', view);
        program.setUniform('uPMatrix', camera.projection);
      }

      


            var nextStep = function(v,o,delta){

                

                if(v["t"]=== "translate"){

                  

                  var dt = v["t1"] - v["t0"];
                  var dsx = v["xf"];
                  var dsy = v["yf"];
                  var dsz = v["zf"];

                  dt = dt/1000;

                  var fs = 50 * dt;

                  var dx = v["dx"];
                  var dy = v["dy"];
                  var dz = v["dz"];

                  v["dx"] = dx+dsx/fs; 
                  v["dy"] = dy+dsy/fs; 
                  v["dz"] = dz+dsz/fs; 


                  


                }

                if(v["t"] === "scale"){

                var x = v["x"];
                var y = v["y"];
                var z = v["z"];

                v["sx"] = PhiloGL.Fx.compute(1,x,delta);
                v["sy"] = PhiloGL.Fx.compute(1,y,delta);
                v["sz"] = PhiloGL.Fx.compute(1,z,delta);
                

                }


                if(v["t"] === "rotate"){
                  var dt = v["t1"] - v["t0"];
                  var rsx = v.degreesx;
                  var rsy = v.degreesy;
                  var rsz = v.degreesz;

                  rsx = (rsx/90)*1.57;
                  rsy = (rsy/90)*1.57;
                  rsz = (rsz/90)*1.57;



                  v["rx"] = PhiloGL.Fx.compute(0,rsx,delta);
                  v["ry"] = PhiloGL.Fx.compute(0,rsy,delta);
                  v["rz"] = PhiloGL.Fx.compute(0,rsz,delta);






                }


              }



          
   var anim = function(obj,nn) {



              var obj = obj;
              var nn = nn;
              var ogg = obj["a"];
              var tt = obj["t"];


              



              var fx = new PhiloGL.Fx({
              duration: (tt["t1"]-tt["t0"]+nn*50),
              delay: (tt["t0"]+(nn*50)) ,
              transition: PhiloGL.Fx.Transition.linear,
              onCompute: function(delta) {
                
                var v = this.opt.v;
                var o = this.opt.o;
                var oj = o["obj"];



                var x0 = o["x0"];
                var y0 = o["y0"];
                var z0 = o["z0"];

               
                if(tt["t"] === "translate"){

                var dx = v["dx"];
                var dy = v["dy"];
                var dz = v["dz"];

                  oj.position.set(x0 + (dx*delta), y0  +(dy * delta), z0 +(dz *delta));
                
                }

                if(tt["t"] === "scale"){
                  var sx = v["sx"];
                  var sy = v["sy"];
                  var sz = v["sz"];
                  //oj.position.set(x0, y0 , z0);
                  oj.scale.set(sx,sy,sz);
                }

                if(tt["t"] === "rotate"){
                var rx = v["rx"];
                var ry = v["ry"];
                var rz = v["rz"];
                oj.rotation.set(rx,ry,rz);
                }


                nextStep(v,o,delta);
                drawObjects(objs);
              
              },
              onComplete: function() {
                console.log("");
              }
              });

              fx.start({v:tt,o:ogg});

              setInterval(function() {
               fx.step();
              }, 1000 / 50);
  

              
 
        
      }





            function calculateScene(){
  

              for (var a in animations) {
                var obj = animations[a].obj;
                var ts= animations[a].transitions;
                var ox0 = animations[a].x0;
                var oy0 = animations[a].y0;
                var oz0 = animations[a].z0;
                var n = animations[a].n;


                objs.push(animations[a]);

                

                for (var t in ts) {

                  var tt = ts[t];

                  anims.push({a:animations[a],t:tt});


                  

                }



              }
              
              
                

      }


      var drawObjects = function(models){
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(var m in models ){
          var og = models[m]["obj"];
          var n = models[m]["n"] ;

          if(n>3){
                setupElement(og);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
              }
                else{
                  setupElement(og);
                gl.drawArrays(gl.TRIANGLES, 0, n);
              }
          
        }

      }


            var drawInitialObjects = function(models){
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(var m in models ){
          var og = models[m]["obj"];
          var n = models[m]["n"] ;
          var x0 = models[m]["x0"];
          var y0 = models[m]["y0"];
          var z0 = models[m]["z0"];

          og.position.set(x0, y0 , z0);

          if(n>3){
                setupElement(og);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
              }
                else{
                  setupElement(og);
                gl.drawArrays(gl.TRIANGLES, 0, n);
              }
          
        }

      }

      var animateScene = function(){
        for (var i in anims) {
          anim(anims[i],i);
        }
      }

      calculateScene();
      drawInitialObjects(objs);
      animateScene();

      


      
      
    }
  });
  
}





