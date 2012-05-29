var canvas;
var context;
var nodes = [];
var arcs = [];
var arc = [];
var lastId = 1;

canvas = $('#graph')[0];
context = canvas.getContext ('2d');

context.fillStyle = 'rgb(128, 128, 128)';
context.fillRect (0, 0, 800, 600);

$(canvas).click (function (event) {

  var x, y;
  var startArc = false;

  x = event.offsetX;
  y = event.offsetY;

  for (var i in nodes) {
    if (Math.sqrt (Math.pow (x - nodes[i].x, 2) +
                   Math.pow (y - nodes[i].y, 2)) <= 18) {
      startArc = true;
      arc.push ({x : nodes[i].x, y : nodes[i].y});
      break;
    }
  }

  if (!startArc) {
    context.beginPath ();
    context.fillStyle = 'rgb(0, 0, 0)';
    context.arc (x, y, 18, 0, 2 * Math.PI);
    context.fill ();
    context.closePath ();

    context.beginPath ();
    context.fillStyle = 'rgb(255, 255, 255)';
    context.arc (x, y, 16, 0, 2 * Math.PI);
    context.fill ();
    context.closePath ();

    lastId += 1;
    nodes.push ({id : lastId, x : x, y : y});
  } else {
    context.beginPath ();
    context.strokeStyle = 'rgb(255, 0, 0)';
    context.arc (arc[0].x, arc[0].y, 20, 0, 2 * Math.PI);
    context.stroke ();
    context.closePath ();

    if (arc.length === 2) {
      context.beginPath ();
      context.moveTo (arc[0].x, arc[0].y);
      context.strokeStyle = 'rgb(0, 0, 0)';
      context.lineTo (arc[1].x, arc[1].y);
      context.stroke ();
      context.closePath ();
      arc = [];
      $('#insertData').dialog ({modal : true});
    }
  }

});

function saveArc ()
{
  arcs.push ({
    id : Math.floor (Math.random () * 100),
    obj : new THREE.Mesh (new THREE.CubeGeometry ()),
    t : "translate",
    t0 : 0,
    t1 : parseInt ($('#inT').val ()),
    dxf : parseFloat ($('#inX').val ()),
    dyf : parseFloat ($('#inY').val ()),
    dzf : parseFloat ($('#inZ').val ()),
  });
  $('#insertData').dialog ('destroy');
}
