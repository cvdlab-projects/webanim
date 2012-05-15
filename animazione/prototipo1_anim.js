function startAnimation(models,frames){


  //la funzione necesita che i modelli vengano passati dall'esterno
var fps = 25;
var pentagon = new PhiloGL.O3D.Model({
    vertices: [1,-0.5,0, -1,-0.5,0, 1,0.5,0, -1,0.5,0, 0,1,0],

    colors: [1, 0, 0, 1,
             0, 1, 0, 1,
             0, 0, 1, 1,
             1, 0, 0, 1,
             0, 1, 0, 1,]
  });

  
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

   var square3 = new PhiloGL.O3D.Model({
    vertices: [ 1,  1, 0,
                1, -1, 0,
                -1, -1, 0,
               -1, 1, 0],

    colors: [0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7,
             0.5, 0.5, 1, 0.7]
  });

              square_t1 = {id:4,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              square_t2 = {id:6,t:"scale",t0: 0,t1: 3000,x:2,y:1,z:1,sx:1,sy:1,sz:1};
              square_t3 = {id:5,t:"rotate",t0: 0,t1: 3000,dgx:-180,dgy:0,dgz:0,rx:0,ry:0,rz:0};

              

              tri_t1 = {id:1,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              tri_t2 = {id:2,t:"scale",t0: 4000,t1: 6000,x:0.5,y:1,z:1,sx:1,sy:1,sz:1};
              tri_t3 = {id:3,t:"rotate",t0:4000, t1:5000, dgx:90,dgy:0,dgz:0,rx:0,ry:0,rz:0};



              var struct1 = {id:1,obj:pentagon,n:5,transitions: [square_t2,tri_t2],x0:-1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              var struct2 = {id:2,obj:triangle,n:3,transitions: [square_t1,square_t2],x0:1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              var struct3 = {id:3,obj:square,n:4,transitions: [square_t1],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};





              var animations = [struct1];

              webGLStart(animations,fps);
}

var Set = function() {
  this.elems = [];
}

Set.prototype.add = function(elem) {
  if(!this.elems.some(function(item){ return item === elem; })) {
    this.elems.push(elem);
  }
  // body...
};
function webGLStart(anim,fps) {

  var framesps = fps;

  var animations = anim;
  var objs =[];

  var models = new Set();

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

      




    function getAnimationObjectByID(id){
    for(var a in animations){
      var obj = animations[a];
      if(obj["id"]===id){
        return obj;
      }
    }
  }


  var getTransitionByID = function(idObj,idTrans){
      var obj = getAnimationObjectByID(idObj);
      for(var t in obj["transitions"]){
        var ts = obj["transitions"][t];
        if(ts["id"] === idTrans){
          return ts;
        }

      }
  }

  var changeRinObj = function(id,x,y,z){

    var o = getAnimationObjectByID(id);
    if(o !== null){
    o["rx"] = x;
    o["ry"] = y;
    o["rz"] = z;
    }

  }

  var changeDinObj = function(id,x,y,z){

    var o = getAnimationObjectByID(id);
    if(o !== null){
    o["dx"] = x;
    o["dy"] = y;
    o["dz"] = z;
    return 1;
    }
    return 0;

  }

  var changeSinObj = function(id,x,y,z){

    var o = getAnimationObjectByID(id);
    if(o !== null){
    o["sx"] = x;
    o["sy"] = y;
    o["sz"] = z;
    return 1;
    }
    return 0;

  }
  var getRxfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["rx"];
  }

  var getRyfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["ry"];
  }

  var getRzfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["rz"];
  }

  var getX0fromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["x0"];
  }

  var getY0fromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["y0"];
  }

  var getZ0fromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["z0"];
  }


  var getDxfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["dx"];
  }

  var getDyfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["dy"];
  }

  var getDzfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["dz"];
  }

    var getSxfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["sx"];
  }

  var getSyfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["sy"];
  }

  var getSzfromObj = function(id){
    var o = getAnimationObjectByID(id);
    return o["sz"];
  }

  var changeRinT = function(idO,idT,x,y,z){
    var t = getTransitionByID(idO,idT);
      t["rx"]=x;
      t["ry"]=y;
      t["rz"]=z;

  }

  var changeDinT = function(idO,idT,x,y,z){
    var t = getTransitionByID(idO,idT);
      t["dx"]=x;
      t["dy"]=y;
      t["dz"]=z;

  }

  var changeSinT = function(idO,idT,x,y,z){
    var t = getTransitionByID(idO,idT);
      t["sx"]=x;
      t["sy"]=y;
      t["sz"]=z;

  }

var vvvvv = function(idOb,idTr) {
    var idO = idOb;
    var idT = idTr;

    var tt = getTransitionByID(idO,idTr);
    var t0 = tt["t0"];
    var t1 = tt["t1"];
    var d  = 0;
 
    var fx = new PhiloGL.Fx({
      duration: (t1 - t0) + d,
      delay: t0,
      transition: PhiloGL.Fx.Transition.linear,
      onCompute: function(delta) {    
        var idT = this.opt.t;
        var idO = this.opt.o;
        var obj = getAnimationObjectByID(idO);
        var tt  = getTransitionByID(idO,idT);

        if(tt["t"] === "translate"){

          var x0 = getX0fromObj(idO);
          var y0 = getY0fromObj(idO);
          var z0 = getZ0fromObj(idO);


          var dx = getDxfromObj(idO);
          var dy = getDyfromObj(idO);
          var dz = getDzfromObj(idO);

          obj["obj"].position.set((x0 + dx), (y0  +dy), (z0 +dz));
        }

        if(tt["t"] === "scale"){
          var sx = getSxfromObj(idO);
          var sy = getSyfromObj(idO);
          var sz = getSzfromObj(idO);
          obj["obj"].scale.set(sx,sy,sz);
        }

        if(tt["t"] === "rotate"){
        var rx = getRxfromObj(idO);
        var ry = getRyfromObj(idO);
        var rz = getRzfromObj(idO);

        obj["obj"].rotation.set(rx,ry,rz);
        }


        nextStep(idO,idT,delta);
        drawObjects();
      
      },
      onComplete: function() {
        console.log("");
      }
      });

      fx.start({t:idT,o:idO});
      

      setInterval(function() {
       fx.step();
      }, 1000 / framesps);
    
  }


var nextStep = function(idOb,idTr,delta){

    var d = delta;
    var idO = idOb;
    var idT = idTr;
    var obj = getAnimationObjectByID(idO);
    var tr = getTransitionByID(idO,idT);

    if(tr["t"]=== "translate"){

      var dt = tr["t1"] - tr["t0"];

      var dxf = tr["dxf"];
      var dyf = tr["dyf"];
      var dzf = tr["dzf"];




      dt = dt/1000;

      var fs = framesps * dt;

      var dx = tr["dx"];
      var dy = tr["dy"];
      var dz = tr["dz"];

/*
      v["dx"] = dx+dxf/fs;
      v["dy"] = dy+dyf/fs; 
      v["dz"] = dz+dzf/fs; */

      dxf = dxf/fs;
      dyf = dyf/fs;
      dzf = dzf/fs;

      var ndx = PhiloGL.Fx.compute(0,dxf,delta);
      var ndy = PhiloGL.Fx.compute(0,dyf,delta);
      var ndz = PhiloGL.Fx.compute(0,dzf,delta);

      //changeDinT(idO,idT,ndx,ndy,ndz);



      var ox = getDxfromObj(idO); 
      var oy = getDyfromObj(idO);
      var oz = getDzfromObj(idO);

      changeDinObj(idO,ox+ndx,oy+ndy,oz+ndz);




    }

    if(tr["t"] === "scale"){

    var x = tr["x"];
    var y = tr["y"];
    var z = tr["z"];
    var xx = 1/x;

    var sx = tr["sx"];
    var nx;
    //console.log(x);
    

    if(x>1){
      
    nx = PhiloGL.Fx.compute(1,x,delta);
    
    var dx = sx - nx;
    changeSinT(idO,idT,sx-dx,1,1);
    var ox = getSxfromObj(idO);
    changeSinObj(idO,ox-dx,1,1);
  }
    if(x<1){
      //ox*(1-dx)
    nx = PhiloGL.Fx.compute(1,x,delta);
    var dx = sx - nx;
    changeSinT(idO,idT,sx-dx,1,1);
    var ox = getSxfromObj(idO);
    changeSinObj(idO,ox-(dx/x),1,1);
  }
    


  }
  

  




    if(tr["t"] === "rotate"){
    var dt = tr["t1"] - tr["t0"];



    var rx = tr["rx"];
    var ry = tr["ry"];
    var rz = tr["rz"];



    var rsx = tr.dgx;
    var rsy = tr.dgy;
    var rsz = tr.dgz;

      

      rsx = (rsx/90)*Math.PI;
      rsy = (rsy/90)*Math.PI;
      rsz = (rsz/90)*Math.PI;


      var nnx = dt/1000*framesps;
      rsx = rsx/nnx;
      rsy = rsy/nnx;
      rsz = rsz/nnx;



      var nx = PhiloGL.Fx.compute(0,rsx,delta);
      var ny = PhiloGL.Fx.compute(0,rsy,delta);
      var nz = PhiloGL.Fx.compute(0,rsz,delta);




      var difx = nx -rx;
      var dify = ny -ry;
      var difz = nz -rz;

      //changeRinT(idO,idT,nx,ny,nz);
    
      var ox = getRxfromObj(idO); 
      var oy = getRyfromObj(idO);
      var oz = getRzfromObj(idO);
    
    changeRinObj(idO,ox+difx,oy+dify,oz+difz);






    }


  }
          
  





 function calculateScene(){
  for (var a in animations) {

    models.add(animations[a]);

  }
}


      var drawObjects = function(){

        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for(var m in animations ){
          var og = animations[m]["obj"];
          var n = animations[m]["n"] ;

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


            var drawInitialObjects = function(){
        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for(var m in models.elems ){
          var og = models.elems[m]["obj"];
          var n = models.elems[m]["n"] ;
          var x0 = models.elems[m]["x0"];
          var y0 = models.elems[m]["y0"];
          var z0 = models.elems[m]["z0"];

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

    for (var i in animations) {
      var o = animations[i];
      var idO = o["id"];
      var ts = o["transitions"];
      for(var t in ts){
        var idT = ts[t]["id"];
        vvvvv(idO,idT);
      }
      
    }
  }

  calculateScene();
  drawInitialObjects();
  animateScene();

      


      
      
    }
  });
  
}





