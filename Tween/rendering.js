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

  // Effettua il clone di un qualsiasi oggetto
  function clone (o)
  {
    return JSON.parse (JSON.stringify (o));
  }

  function parseModel (model, arg2, arg3)
  {
    var obj;

    if (model === "Camera")
      obj = new THREE.PerspectiveCamera (45, arg2 / arg3, 0.1, 10000);
    else if (model === "Cube")
      obj = new THREE.Mesh (new THREE.CubeGeometry ());
    else if (model === "Cylinder")
      obj = new THREE.Mesh (new THREE.CylinderGeometry ());
    else if (model === "Icosahedron")
      obj = new THREE.Mesh (new THREE.IcosahedronGeometry ());
    else if (model === "Octahedron")
      obj = new THREE.Mesh (new THREE.OctahedronGeometry ());
    else if (model === "Plane")
      obj = new THREE.Mesh (new THREE.PlaneGeometry ());
    else if (model === "Sphere")
      obj = new THREE.Mesh (new THREE.SphereGeometry ());
    else if (model === "Tetrahedron")
      obj = new THREE.Mesh (new THREE.TetrahedronGeometry ());
    else if (model === "Torus")
      obj = new THREE.Mesh (new THREE.TorusGeometry ());

    return obj;
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
    var _this;

    if (storyboard === undefined)
      throw new RenderingException ("Storyboard informations required!");

    this.cameras = [];
    this.cameras2 = [];
    this.meshes = [];
    this.meshes2 = [];
    for (var i in storyboard.segments) {
      var data;
      var filtered;

      data = storyboard.segments[i].actor.model.data;
      // Per semplicità unisco i due array, così li filtro insieme
      filtered = this.cameras.concat (this.meshes).filter (function (element) {
        return element === data;
      });
      if (filtered.length === 0) {
        if (data instanceof THREE.PerspectiveCamera) {
          this.cameras.push (data);
          this.cameras2.push (clone (data));
        } else {
          this.meshes.push (data);
          this.meshes2.push (clone (data));
        }
      }
    }

    if (this.cameras.length === 0)
      throw new RenderingException ("No camera defined!");
    this.camera = this.cameras[0];

    this.scene = new THREE.Scene ();
    // Aggiungo gli oggetti alla scena
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
    var prevStates = [];
    for (var i = 0; i < this.meshes.length; ++i) {
      prevStates.push ({
        tx : 0, ty : 0, tz : 0,
        rx : 0, ry : 0, rz : 0,
        sx : 1, sy : 1, sz : 1
      });
    }
    for (var i in storyboard.segments) {
      var segment;
      var tween;

      segment = storyboard.segments[i];
      tween = new TWEEN.Tween ({
        tx : ,
        ty : ,
        tz : ,
        rx : ,
        ry : ,
        rz : ,
        sx : ,
        sy : ,
        sz : 
      });
      tween.to ({}, segment.duration);
      _this = this;
      tween.onUpdate (function () {
        // _this.meshes[i].position.set (this.tx, this.ty, this.tz);
        // _this.meshes[i].rotation.set (this.rx, this.ry, this.rz);
        // _this.meshes[i].scale.set (this.sx, this.sy, this.sz);
      });
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
          __changeCamera (j);
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
   * Cambia la camera corrente. E' da considerarsi privato; ora è usato solo nei
   * pulsanti di controllo.
   * @param {Number} i Numero d'ordine della camera da attivare; parte da 0.
   */
  RenderingArea.prototype.__changeCamera = function (i) {
    this.scene.remove (this.camera);
    this.camera = this.cameras[i];
    this.light.position = this.camera.position;
    this.scene.add (this.camera);
  };

  /**
   * Resetta lo stato attuale delle mesh a quello iniziale, effettuando un flip
   * degli array. E' da considerarsi privato.
   */
  RenderingArea.prototype.__flipMeshesStates = function () {
    for (var i in this.meshes)
      this.scene.remove (this.meshes[i]);
    this.meshes = this.meshes2;
    this.meshes2 = clone (this.meshes);
    for (var i in this.meshes)
      this.scene.add (this.meshes[i]);
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
    // others ....
    __flipMeshesState ();
  };

  return {
    RenderingException : RenderingException,
    RenderingArea : RenderingArea
  };

}) ();
