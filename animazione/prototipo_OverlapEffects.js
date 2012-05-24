function indexOfTransition(array,obj){

  for(var i in array){
    var a = array[i];
    if(obj["id"] === a["id"])
      return i;

  }

  return -1;

}

function arrayClone(arr){
  var ret=[];
  for(var i in arr){
    ret.push(arr[i]);
  }
  return ret;
}

function existsID(array,n){
  var l = array.filter(function(item){
    return (n === item.id);

  });

  if(l.length >=1)
    return true;
  return false;
}

function generateID(array){
  var randomnumber=Math.floor(Math.random()*100000);
  while(existsID(array,randomnumber)){
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
  console.log(animations);

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
      }
    }

    setDeltas(translate);

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
          var id1 = generateID(nTranslate);

          divide1 = {id:id1,t:"translate",t0: tt["t0"],t1: nxtStop,dxf:dxf,dyf:dyf,dzf:dzf,dx:tt.dx,dy:tt.dy,dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};
          
          var ndelta = tt.t1 - nxtStop;
          var dxf = (ndelta/1000) * tt.ddx;
          var dyf = (ndelta/1000) * tt.ddy;
          var dzf = (ndelta/1000) * tt.ddz;
          var id2 = generateID(nTranslate);

          divide2 = {id:id2,t:"translate",t0: nxtStop,t1: tt["t1"],dxf:dxf,dyf:dyf,dzf:dzf,dx:tt.dx,dy:tt.dy,dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};


        }
        if(nxtStop === tt.t1){
          var id1 = generateID(nTranslate);
          divide1 = {id:tt["id"],t:"translate",t0: tt["t0"],t1: tt["t1"],dxf:tt["dxf"],dyf:tt.dyf,dzf:tt.dzf,dx:tt.dx,dy:tt.dy,dz:tt.dz,ddx:tt["ddx"],ddy:tt["ddy"],ddz:tt["ddz"]};
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
      }
    }

    merge(nTranslate);

    obj.transitions = [];
    obj["transitions"] = obj["transitions"].concat(mergeTranslate);   
  }

};



function startAnimation(models,frames){


  //la funzione necessita che i modelli vengano passati dall'esterno
var fps = frames || 25;
var pentagon = new PhiloGL.O3D.Model({
    vertices: [1,-0.5,0, -1,-0.5,0, 1,0.5,0, -1,0.5,0, 0,1,0],

    colors: [1, 0, 0, 1,
             0, 1, 0, 1,
             0, 0, 1, 1,
             1, 0, 0, 1,
             0, 1, 0, 1,]

    ,indices: [2,0,1,1,2,3,2,3,4]
  });

  
var triangle = new PhiloGL.O3D.Model({
    vertices: [ 0,  1, 0,
               -1, -1, 0,
                1, -1, 0],

    colors: [1, 0, 0, 1,
             0, 1, 0, 1,
             0, 0, 1, 1],
    indices: [0,1,2]
  });

  var cube = new PhiloGL.O3D.Model({
    vertices: [-1, -1,  1,
                1, -1,  1,
                1,  1,  1,
               -1,  1,  1,

               -1, -1, -1,
               -1,  1, -1,
                1,  1, -1,
                1, -1, -1,

               -1,  1, -1,
               -1,  1,  1,
                1,  1,  1,
                1,  1, -1,

               -1, -1, -1,
                1, -1, -1,
                1, -1,  1,
               -1, -1,  1,

                1, -1, -1,
                1,  1, -1,
                1,  1,  1,
                1, -1,  1,

               -1, -1, -1,
               -1, -1,  1,
               -1,  1,  1,
               -1,  1, -1],

    colors: [1, 0, 0, 1, 
             1, 0, 0, 1,
             1, 0, 0, 1,
             1, 0, 0, 1,
             1, 1, 0, 1, 
             1, 1, 0, 1, 
             1, 1, 0, 1, 
             1, 1, 0, 1, 
             0, 1, 0, 1, 
             0, 1, 0, 1, 
             0, 1, 0, 1, 
             0, 1, 0, 1, 
             1, 0.5, 0.5, 1, 
             1, 0.5, 0.5, 1, 
             1, 0.5, 0.5, 1, 
             1, 0.5, 0.5, 1, 
             1, 0, 1, 1, 
             1, 0, 1, 1, 
             1, 0, 1, 1, 
             1, 0, 1, 1, 
             0, 0, 1, 1,
             0, 0, 1, 1,
             0, 0, 1, 1,
             0, 0, 1, 1],

    indices: [0, 1, 2, 0, 2, 3,
              4, 5, 6, 4, 6, 7,
              8, 9, 10, 8, 10, 11,
              12, 13, 14, 12, 14, 15,
              16, 17, 18, 16, 18, 19,
              20, 21, 22, 20, 22, 23]
  });
              square_t1 = {id:4,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              square_t2 = {id:6,t:"scale",t0: 0,t1: 3000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              square_t3 = {id:5,t:"rotate",t0: 0,t1: 1000,dgx:-180,dgy:0,dgz:0,rx:0,ry:0,rz:0};

              

              tri_t1 = {id:1,t:"translate",t0: 0,t1: 3000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              tri_t2 = {id:2,t:"scale",t0: 0,t1: 3000,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              tri_t3 = {id:3,t:"rotate",t0:0, t1:1000, dgx:90,dgy:20,dgz:0,rx:0,ry:0,rz:0};



              ct1 = {id:7,t:"translate",t0: 0,t1: 500,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};
              ct2 = {id:8,t:"scale",t0: 1000,t1: 1500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct3 = {id:9,t:"scale",t0: 1501,t1: 2000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct4 = {id:10,t:"translate",t0: 3000,t1: 6000,dxf:0,dyf:0,dzf:5,dx:0,dy:0,dz:0};
              ct5 = {id:11,t:"scale",t0: 2001,t1: 2500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct6 = {id:12,t:"scale",t0: 2501,t1: 3000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct7 = {id:13,t:"scale",t0: 3001,t1: 3500,x:0.5,y:0.5,z:0.5,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct8 = {id:14,t:"scale",t0: 3501,t1: 4000,x:2,y:2,z:2,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct9 = {id:15,t:"scale",t0: 4001,t1: 4500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct10= {id:16,t:"scale",t0: 4501,t1: 5000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct11= {id:17,t:"scale",t0: 5001,t1: 5500,x:0.5,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct12= {id:18,t:"scale",t0: 5501,t1: 6000,x:2,y:1,z:1,sx:1,sy:1,sz:1,osx:1,osy:1,osz:1,ofx:1,ofy:1,ofz:1,ini:false};
              ct13= {id:19,t:"rotate",t0:0, t1:6000, dgx:360,dgy:360,dgz:360,rx:0,ry:0,rz:0};
              ct14= {id:20,t:"translate",t0: 500,t1: 1000,dxf:0,dyf:0,dzf:5,dx:0,dy:0,dz:0};
              ct15= {id:21,t:"translate",t0: 1000,t1: 1500,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0};


              var struct1 = {id:1,obj:pentagon,n:5,transitions: [tri_t2,square_t2],x0:-1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              var struct2 = {id:2,obj:triangle,n:3,transitions: [square_t1,square_t2],x0:1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              //var struct3 = {id:3,obj:cube,n:4,transitions: [ct1,ct2,ct3,ct4,ct5,ct6,ct7,ct8,ct9,ct10,ct11,ct12,ct13,ct14,ct15],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              var struct3 = {id:3,obj:cube,n:4,transitions: [square_t2,tri_t2],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};


              var square_t1 = {id:4,t:"translate",t0: 0,t1: 5000,dxf:0,dyf:0,dzf:-5,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};
              var tri_t1 = {id:1,t:"translate",t0: 2500,t1: 7500,dxf:0,dyf:0,dzf:5,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};
              var tri_t4 = {id:6,t:"translate",t0: 1000,t1: 7500,dxf:0,dyf:0,dzf:3,dx:0,dy:0,dz:0,ddx:0,ddy:0,ddz:0};
              var struct1 = {id:1,obj:cube,n:5,transitions: [tri_t1,square_t1,tri_t4],x0:-1.5,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
              

              console.log(animations);
              var animations = models || [struct1];
              console.log(animations);

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
function webGLStart(anim,fps,stop,from,to) {

  var stop = stop || false;
  var from = from || 0;
  var to = to || 10;
  var framesps = fps;

  var animations = anim;
  var objs =[];

  var models = new Set();

  //Create App
  PhiloGL('animationcanvas', {
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

  var changeOSinT = function(idO,idT,x,y,z){
    var t = getTransitionByID(idO,idT);
      t["osx"]=x;
      t["osy"]=y;
      t["osz"]=z;

  }

    var changeOFinT = function(idO,idT,x,y,z){
    var t = getTransitionByID(idO,idT);
      t["ofx"]=x;
      t["ofy"]=y;
      t["ofz"]=z;

  }

    var getIni = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["ini"];

  }

  var getOSX = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["osx"];

  }

  var getOFX = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["ofx"];

  }


  var getOSY = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["osy"];

  }

  var getOFY = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["ofy"];

  }

  var getOSZ = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["osz"];

  }

  var getOFZ = function(idO,idT){
    var t = getTransitionByID(idO,idT);
      return t["ofz"];

  }

  var setIni = function(idO,idT,ini){
    var t = getTransitionByID(idO,idT);
      t["ini"]= ini;

  }

var startTransition = function(idOb,idTr,n) {
    var idO = idOb;
    var idT = idTr;
    var tt = getTransitionByID(idO,idTr);

    

    var t0 = tt["t0"];
    var t1 = tt["t1"];
 
    var fx = new PhiloGL.Fx({
      duration: (t1 - t0),
      delay: (t0),
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
      v["dz"] = dz+dzf/fs; 

      dxf = dxf/fs;
      dyf = dyf/fs;
      dzf = dzf/fs;*/



      var ndx = PhiloGL.Fx.compute(0,dxf,delta);
      var ndy = PhiloGL.Fx.compute(0,dyf,delta);
      var ndz = PhiloGL.Fx.compute(0,dzf,delta);
      
      var difx = ndx -dx;
      var dify = ndy -dy;
      var difz = ndz -dz;

      changeDinT(idO,idT,dx+difx,dy+dify,dz+difz);



      var ox = getDxfromObj(idO); 
      var oy = getDyfromObj(idO);
      var oz = getDzfromObj(idO);

      changeDinObj(idO,ox+difx,oy+dify,oz+difz);




    }

    if(tr["t"] === "scale"){

    var ini = getIni(idO,idT);

    var x = tr["x"];
    var y = tr["y"];
    var z = tr["z"];

    var osx;
    var osy;
    var osz;

    var ofx;
    var ofy;
    var ofx;

    var ox;
    var oy;
    var oz;

    var sx;
    var sy;
    var sz;

    var nx;
    var ny;
    var nz;

    //se è la prima volta che viene eseguita, inizializza i valori
    if(!ini && delta!==0){
    osx = getSxfromObj(idO);
    osy = getSyfromObj(idO);
    osz = getSzfromObj(idO);

    ofx = osx * x;
    ofy = osy * y;
    ofz = osz * z;

    changeOSinT(idO,idT,osx,osy,osz);
    changeOFinT(idO,idT,ofx,ofy,ofz);
    setIni(idO,idT,true);
    changeSinT(idO,idT,osx,osy,osz);
    }

    osx = getOSX(idO,idT);
    osy = getOSY(idO,idT);
    osz = getOSZ(idO,idT);

    ofx = getOFX(idO,idT);
    ofy = getOFY(idO,idT);
    ofz = getOFZ(idO,idT);

  
    nx = PhiloGL.Fx.compute(1,x,delta);
    ny = PhiloGL.Fx.compute(osy,ofy,delta);
    nz = PhiloGL.Fx.compute(osz,ofz,delta);

    sx = tr["sx"];
    sy = tr["sy"];
    sz = tr["sz"];

    var dx = nx - sx;
    var dy = ny - sy;
    var dz = nz - sz;

    changeSinT(idO,idT,sx+dx,sy+dy,sz+dz);

    var ox = getSxfromObj(idO);
    var oy = getSyfromObj(idO);
    var oz = getSzfromObj(idO);

    changeSinObj(idO,nx,ny,nz);
  
    


  }


    if(tr["t"] === "rotate"){
    var dt = tr["t1"] - tr["t0"];



    var rx = tr["rx"];
    var ry = tr["ry"];
    var rz = tr["rz"];



    var rsx = tr.dgx;
    var rsy = tr.dgy;
    var rsz = tr.dgz;

      

      rsx = (rsx/90)*(Math.PI/2);
      rsy = (rsy/90)*(Math.PI/2);
      rsz = (rsz/90)*(Math.PI/2);

/*
      var nnx = dt/1000*framesps;
      rsx = rsx/nnx;
      rsy = rsy/nnx;
      rsz = rsz/nnx;*/



      var nx = PhiloGL.Fx.compute(0,rsx,delta);
      var ny = PhiloGL.Fx.compute(0,rsy,delta);
      var nz = PhiloGL.Fx.compute(0,rsz,delta);




      var difx = nx -rx;
      var dify = ny -ry;
      var difz = nz -rz;

      changeRinT(idO,idT,rx+difx,ry+dify,rz+difz);
    
      var ox = getRxfromObj(idO); 
      var oy = getRyfromObj(idO);
      var oz = getRzfromObj(idO);
    
      changeRinObj(idO,ox+difx,oy+dify,oz+difz);






    }


  }
          
  





var calculateScene = function(startTime){
  for (var a in animations) {

    var obj = animations[a];
    var model = obj.obj;

    models.add(obj);
    /*for (var b in obj["transitions"]) {

      var transition = obj["transitions"][b];

      var t0 = transition.t0;
      var t1 = transition.t1;
      var type = transition.t

      var elimina = false;

      if(startTime > t0){

        var t0n = 0;
        var t1n = t1 - t0;

        var percent = (100*(startTime - t0))/t1n;
        percent = percent/100;
        if(percent>1){
          percent = 1;
          elimina = true;
        }

        if(type === "translate"){

          var dxf = transition.dxf;
          var dyf = transition.dyf;
          var dzf = transition.dzf;

          var xp = percent * dxf;
          var yp = percent * dyf;
          var zp = percent * dzf;

          //update transition start-end values
          
          transition.dxf = dxf - xp;
          transition.dyf = dyf - yp;
          transition.dzf = dzf - zp;
          
          

          if(startTime>t0 && startTime<t1){
            transition.t0 = 0;
            transition.t1 = transition.t1 - startTime;
          }

          var x0 = obj.x0;
          var y0 = obj.y0;
          var z0 = obj.z0;

          //update model position
          obj.dx = obj.dx + xp;
          obj.dy = obj.dy + yp;
          obj.dz = obj.dz + zp;

          var dx = obj.dx;
          var dy = obj.dy;
          var dz = obj.dz;

          model.position.set((x0 + dx), (y0  +dy), (z0 +dz));



        }


          if(type === "rotate"){

          var dgx = transition.dgx;
          var dgy = transition.dgy;
          var dgz = transition.dgz;

          dgx = (dgx/90)*(Math.PI/2);
          dgy = (dgy/90)*(Math.PI/2);
          dgz = (dgz/90)*(Math.PI/2);

          var xp = percent * dgx;
          var yp = percent * dgy;
          var zp = percent * dgz;

          //update transition start-end values
          transition.dgx = (dgx - xp)/(Math.PI/2)*90;
          transition.dgy = (dgy - yp)/(Math.PI/2)*90;
          transition.dgz = (dgz - zp)/(Math.PI/2)*90;

          if(startTime>t0 && startTime<t1){
            transition.t0 = 0;
            transition.t1 = transition.t1 - startTime;
          }

          //update model position
          obj.rx = obj.rx + xp;
          obj.ry = obj.ry + yp;
          obj.rz = obj.rz + zp;

          var rx = obj.rx;
          var ry = obj.ry;
          var rz = obj.rz;

          model.rotation.set(rx,ry,rz);



        }


        if(elimina){
          var index = obj["transitions"].indexOf(transition["id"]); // Find the index
          if(index!=-1) 
          obj["transitions"].splice(index, 1); // Remove it if really found!
        elimina = false;
        }




      }
      
    }*/

  }
}


  var drawObjects = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for(var m in animations ){
      var og = animations[m]["obj"];         

      setupElement(og);
      program.setBuffer('indices', {
      value: og.indices,
      bufferType: gl.ELEMENT_ARRAY_BUFFER,
      size: 1
      });
      gl.drawElements(gl.TRIANGLES, og.indices.length,gl.UNSIGNED_SHORT, 0);
      
    }

  }


  var drawInitialObjects = function(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(var m in animations ){
      var og = animations[m]["obj"];
      var x0 = animations[m]["x0"];
      var y0 = animations[m]["y0"];
      var z0 = animations[m]["z0"];

      og.position.set(x0, y0 , z0);

      setupElement(og);
      program.setBuffer('indices', {
      value: og.indices,
      bufferType: gl.ELEMENT_ARRAY_BUFFER,
      size: 1
      });
      gl.drawElements(gl.TRIANGLES, og.indices.length,gl.UNSIGNED_SHORT, 0);
      
    }

    

  }


     

  var animateScene = function(){

    for (var i in animations) {
      var o = animations[i];
      var idO = o["id"];
      var ts = o["transitions"];
      for(var t in ts){
        var idT = ts[t]["id"];
        startTransition(idO,idT);
      }
      
    }
  }

  sovrapponiEffetti(animations);
  drawInitialObjects();
  calculateScene(from);
  drawObjects();


  if(!stop){
  animateScene();
  }


  


      


      
      
    }
  });
  
}





