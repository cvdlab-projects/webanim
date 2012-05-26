function startFromSecond(animations,startTime){

  for(var i in animations){

    var obj = animations[i];
    var model = obj.obj;


    //reset values;
    obj.dx = 0;
    obj.dy = 0;
    obj.dz = 0;

    obj.rx = 0;
    obj.ry = 0;
    obj.rz = 0;

    obj.sx = 1;
    obj.sy = 1;
    obj.sz = 1;

    for (var j in obj["transitions"]) {

      var transition = obj["transitions"][j];

      var t0 = transition.t0;
      var t1 = transition.t1;
      var type = transition.t;

      var elimina = false;

      if(startTime > t0){

        var t0n = 0;
        var t1n = t1 - t0;

        var percent = (100*(startTime - t0))/t1n;
        percent = percent/100;
        if(percent >= 1){
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
          obj.dx = (obj.dx + xp) ;
          obj.dy = (obj.dy + yp);
          obj.dz = (obj.dz + zp);

          var dx = obj.dx;
          var dy = obj.dy;
          var dz = obj.dz;



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
          obj.rx += (obj.rx + xp)/(Math.PI/2)*90;
          obj.ry += (obj.ry + yp)/(Math.PI/2)*90;
          obj.rz += (obj.rz + zp)/(Math.PI/2)*90;

          var rx = obj.rx;
          var ry = obj.ry;
          var rz = obj.rz;




        }


          if(type === "scale"){

          var startingx = transition.sxf;
          var startingy = transition.syf;
          var startingz = transition.szf ;


          var ndelta = startTime/(t1-t0)*1000;
          if(ndelta > 1000)
            ndelta = 1000;

          var incrx = startingx - 1;
          var incry = startingy - 1;
          var incrz = startingz - 1;

          var sxf,syf,szf;
          if(incrx !== 0){
            sxf = (incrx*(ndelta/1000))+1;
          }
          else{
            sxf = 1;
          }
          if(incry !== 0){
            syf = (incry*(ndelta/1000))+1;
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

          //update transition start-end values
          transition.sxf = ((startingx - sxf)/sxf) +1;
          transition.syf = ((startingy - syf)/syf) +1;
          transition.szf = ((startingz - szf)/szf) +1;

          if(startTime>=t0 && startTime<=t1){
            transition.t0 = 0;
            transition.t1 = transition.t1 - startTime;
          }

          //update model position
          obj.sx *= sxf;
          obj.sy *= syf;
          obj.sz *= szf;

          var sx = obj.sx;
          var sy = obj.sy;
          var sz = obj.sz;




        }


        if(elimina){
          var index = indexOf(obj["transitions"],transition["id"]); // Find the index
          if(index!=-1) 
          obj["transitions"].splice(index, 1); // Remove it if really found!
        elimina = false;
        }

      }
      if (startTime > t1) {

        transition.t0 -= startTime;
        transition.t1 -= startTime;

      }
      
    }

  }

}

function indexOf(array,id){
  for (var i in array) {
    if(array[i].id === id)
      return i;
    
  }
  return -1;

}

function startFromFrame(obj) {
  var framerate = obj.framerate || 60;
  var frame = obj.frame || 0;
  var animations = obj.animations;
	var startTime = (frame/framerate)*1000;
	startFromSecond(animations,startTime);
	
}

