!(function (exports) {

  var canvas = $('#paper');
  var ctx = canvas[0].getContext("2d");
  var width = canvas.width();
  var height = canvas.height();
  var radius = 15;
  var bgComponentsDefault = [232,232,232];

  var buttonClear = $('#clearGraph');
  var addArc = $('#addArc');

  var bgComponents = bgComponentsDefault;

  var circles = []; //mantiene traccia dei cerchi disegnati

  var nodes = []; //array di nodi da restituire
  var arcs = []; //array di archi
  var number = 0; //usato per assegnare un id incrementale ai nodi

  //costruttore cerchio
  var Circle = function (x, y, raduis) {
    this.x = x;
    this.y = y;
    this.id = number;
    this.radius = radius;
  }

  //disegna l' arco
  var Linea = function (n1,n2){
    var xs = circles[n1].x;
    var ys = circles[n1].y;

    ctx.moveTo(xs,ys);
    ctx.lineTo(circles[n2].x, circles[n2].y);
    ctx.stroke();
  }

  //costruttore nodo
  var Node = function (){
    //...attributi del nodo con this
    this.id = number;

    console.log('nodo creato');
  }

  //costruttore arco
  var Arc = function (n1,n2) {
    //attributi arco
    this.n1 = n1;
    this.n2 = n2;

    console.log('arco creato');
  }

  Circle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
    ctx.stroke();
  };

  var initCanvas = function (bgColor) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineWidth = 2;
  };

  var init_number = function (){ number = 0;}; //resetta il contatore dei nodi
  
  var draw = function () {
    initCanvas('rgb(' + bgComponents.join() + ')');
    circles.forEach(function (circle) {
      circle.draw();
      ctx.font = "10px Verdana";
      ctx.fillStyle="#334485"; // colora il testo
      ctx.fillText(circle.id, circle.x, circle.y);
    });
  };

  //funzioni che ridisegnano gli archi dopo che il canvas è stato aggiornato (nuovo nodo inserito)
  var drawArc =function(Arc){
    Linea(Arc.n1, Arc.n2);
  }
  var drawArcs = function(){
    arcs.forEach(drawArc);
    
  }


  canvas.on('mousedown', function (e) {
    circles.push(new Circle(e.offsetX, e.offsetY, radius));
    nodes.push(new Node( )); //aggiunge nodo alla lista
    number++;
    console.log('numero nodi', number);
    draw();
    drawArcs();
    addSelect();
    addSelect2();
  });


  buttonClear.on('click', function (e) {
    circles = [];
    arcs = [];
    initCanvas();
    draw();
    initSelect();
    init_number(); //azzera il contatore
  });


  addArc.on('click', function (e) {
    //Recupero valori
    var mia_select = document.getElementById("mia_select");
    var n1 = mia_select.options[mia_select.selectedIndex].value;
    var mia_select = document.getElementById("mia_select2");
    var n2 = mia_select.options[mia_select.selectedIndex].value;

    Linea(n1,n2);
    arcs.push(new Arc(n1,n2));

    //Non invio la form
    return false;
  });

  //funzioni per creare select dinamiche: richiamate ogni volta che viene aggiunto un nodo
  var addSelect = function(){
    var op = document.getElementById("mia_select");
    op.options.length=0;
    for (var i =0; i<number;i++){

      op.options[i] = new Option("nodo " +i, i);
    }
  }
  var addSelect2 = function(){
    var op = document.getElementById("mia_select2");
    op.options.length=0;
    for (var i =0; i<number;i++){

      op.options[i] = new Option("nodo " +i, i);
    }
  }
  var initSelect = function(){
    var op = document.getElementById("mia_select");
    var op2 = document.getElementById("mia_select2");
    op.options.length=0;
    op2.options.length=0;
  }
  
  initCanvas('rgb(' + bgComponents.join() + ')');

}(this));
