WEBANIM.Rendering = (function () {

  function createControlButton (title, callback)
  {
    var button;

    button = document.createElement ("button");
    button.textContent = title;
    button.onclick = callback;
    button.style.verticalAlign = "top";

    return button;
  }

  function RenderingException (arg)
  {
    if (arg instanceof String)
      this.message = arg;
    else
      this.parent = arg;
  }

  function RenderingArea (container, w, h, storyboard)
  {
    if (storyboard === undefined)
      throw new RenderingException ("Storyboard informations required!");

    this.cameras = [];
    // TODO: dobbiamo adattare l'oggetto di Marco/Daniele alle nostre esigenze
//    if (this.cameras.length === 0)
//      throw new RenderingException ("No camera defined!");
//    this.camera = this.cameras[0];

    this.scene = new THREE.Scene ();
    // TODO: aggiungere tutti gli oggetti alla scena
    this.scene.add (this.camera);

    this.light = new THREE.PointLight (0xFFFFFF);
//    this.light.position = this.camera.position;
    this.scene.add (this.light);

    this.renderer = new THREE.WebGLRenderer ({
      antialias : true,
      clearAlpha : 1.0,
      precision : "highp"
    });
    this.renderer.setSize (w, h);

    this.container = container;

    this.tweens = [];
    // TODO: creare i tween dai segmenti
    this.startTime = 0;
    this.pauseTime = 0;
  }

  RenderingArea.prototype.show = function () {
    var _this;

    // Aggiungo il canvas
    this.container.appendChild (this.renderer.domElement);

    // Aggiungo a destra i pulsanti di controllo
    this.container.appendChild (createControlButton ("Play", this.play));
    this.container.appendChild (createControlButton ("Pause", this.pause));
    this.container.appendChild (createControlButton ("Stop", this.stop));

    // Vado a capo ...
    this.container.appendChild (document.createElement ("br"));
    // Aggiungo sotto al canvas i pulsanti delle camere
    for (var i in this.cameras) {
      var index;
      var button;

      index = parseInt (i) + 1;
      button = document.createElement ("button");
      button.textContent = "Camera " + index;
      // Questo accrocco è per impostare una funzione con parametro
      button.onclick = function (j) {
        return function () {
          this.changeCamera (j);
        };
      } (i);
      this.container.appendChild (button);
    }

    // Main loop ...
    _this = this;
    function animate ()
    {
      TWEEN.update ();
      _this.renderer.render (_this.scene, _this.camera);
      requestAnimationFrame (animate);
    }

    // Avvio il main loop
    animate ();
  };

  RenderingArea.prototype.changeCamera = function (i) {
    this.scene.remove (this.camera);
    this.camera = this.cameras[i];
    this.light.position = this.camera.position;
    this.scene.add (this.camera);
  };

  RenderingArea.prototype.play = function () {
    this.startTime = new Date ().getTime ();

    if (this.pauseTime !== 0) {
      
    }

    for (var i in this.tweens) {
      this.tweens[i].start ();
    }
  };

  RenderingArea.prototype.pause = function () {
    this.pauseTime = (new Date ().getTime ()) - this.startTime;
    for (var i in this.tweens) {
      this.tweens[i].stop ();
    }
  };

  RenderingArea.prototype.stop = function () {
    this.startTime = 0;
    this.pauseTime = 0;
    for (var i in this.tweens) {
      this.tweens[i].stop ();
    }
  };

  return {
    RenderingException : RenderingException,
    RenderingArea : RenderingArea
  };

}) ();
