WEBANIM.Rendering = (function () {

  // Crea un nuovo pulsante [privata].
  function createControlButton (title, callback)
  {
    var button;

    button = document.createElement ("button");
    button.textContent = title;
    button.onclick = callback;
    button.style.verticalAlign = "top";

    return button;
  }

  /**
   * Crea un'eccezione.
   * @param {String} arg Il messaggio dell'eccezione.
   * @return {RenderingArea} Una nuova istanza.
   */
  function RenderingException (arg)
  {
    this.message = arg;
  }

  /**
   * Crea una nuova istanza dell'area di rendering.
   * @param {HTMLElement} container Elemento che conterrà l'area ed i controlli.
   * @param {Number} w Larghezza dell'area di rendering.
   * @param {Number} h Altezza dell'area di rendering.
   * @param {Storyboard} storyboard Oggetto che contine la specifica dell'animazione.
   * @return {RenderingArea} Una nuova istanza.
   */
  function RenderingArea (container, w, h, storyboard)
  {
    if (storyboard === undefined)
      throw new RenderingException ("Storyboard informations required!");

    this.cameras = [];
    this.meshes = [];
    for (var i in storyboard.segments) {
      var filtered;

      // Per semplicità unisco i due array, così li filtro insieme
      filtered = this.cameras.concat (this.meshes).filter (function (element) {
        return element === storyboard.segments[i].mesh;
      });
      if (filtered.length === 0) {
        if (storyboard.segments[i].mesh instanceof THREE.PerspectiveCamera)
          this.cameras.push (storyboard.segments[i].mesh);
        else
          this.meshes.push (storyboard.segments[i].mesh);
      }
    }

    if (this.cameras.length === 0)
      throw new RenderingException ("No camera defined!");
    this.camera = this.cameras[0];

    this.scene = new THREE.Scene ();
    // Aggiungo le mesh alla scena
    for (var i in this.meshes)
      this.scene.add (this.meshes[i]);
    this.scene.add (this.camera);

    // Creo una luce standard che va bene sempre
    this.light = new THREE.PointLight (0xFFFFFF);
    this.light.position = this.camera.position;
    this.scene.add (this.light);

    this.renderer = new THREE.WebGLRenderer ({
      antialias : true,
      clearAlpha : 1.0,
      precision : "highp"
    });
    this.renderer.setSize (w, h);

    this.container = container;

    this.tweens = [];
    for (var i in this.meshes) {
      var tween;

      tween = new TWEEN.Tween ({
        position : this.meshes[i].position,
        rotation : this.meshes[i].rotation,
        scale : this.meshes[i].scale
      });
      this.tweens.push (tween);
    }
    this.startTime = 0;
    this.pauseTime = 0;
  }

  /**
   * Mostra tutti gli elementi dell'interfaccia, e avvia il ciclo principale per
   * l'esecuzione dell'animazione e la gestione degli eventi dell'utente.
   */
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

  /**
   * Cambia la camera corrente. E' da considerarsi protetto; ora è usato solo nei
   * pulsanti di controllo.
   * @param {Number} i Numero d'ordine della camera da attivare; parte da 0.
   */
  RenderingArea.prototype.changeCamera = function (i) {
    this.scene.remove (this.camera);
    this.camera = this.cameras[i];
    this.light.position = this.camera.position;
    this.scene.add (this.camera);
  };

  /**
   * Avvia l'animazione.
   */
  RenderingArea.prototype.play = function () {
    this.startTime = new Date ().getTime ();

    if (this.pauseTime !== 0) {
      
    }

    for (var i in this.tweens) {
      this.tweens[i].start ();
    }
  };

  /**
   * Sospende l'animazione.
   */
  RenderingArea.prototype.pause = function () {
    this.pauseTime = (new Date ().getTime ()) - this.startTime;
    for (var i in this.tweens) {
      this.tweens[i].stop ();
    }
  };

  /**
   * Ferma l'animazione e la riavvolge.
   */
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
