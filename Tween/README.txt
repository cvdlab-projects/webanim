MAIN FEATURES IMPLEMENTED

* PLAY
* STOP
* PAUSE
* REWIND
* FF
* RESUME
* PLAY FROM SECOND
* PLAY FROM FRAME
* ANIMATE MESHES
	* TRANSLATE 
	* SCALE 
	* ROTATE (ON OBJECT AXES)
* CHOOSE A BUILT-IN INTERPOLATION FUNCTION
* POSSIBILITY TO DEFINE AN INTERPOLATION FUNCTION
* DEFINE A SPLINE TO ANIMATE THE CAMERA
* LOOK-AT
* 6 DEFAULT CAMERAS
* DEFINE AND ANIMATE YOUR OWN CAMERA





Come usare il nostro tool:

Struttura delle transizioni:

t0 = {id:1,t:"translate",t0: 0,  t1: 6000,   dxf:0,    dyf:0,   dzf:-500, func: .. };
t1 = {id:2,t:"scale",    t0: 0,  t1: 3000,   sxf:0.5,  syf:2,   szf:2,    func: .. };
t2 = {id:3,t:"rotate",   t0: 0,  t1: 6000,   dgx:-90,  dgy:90,  dgz:90,   func: .. };

Struttura di una "animazione"

anim = {id:8, obj:mesh, transitions:[t0,t1,t2], x0:-500, y0:-500, z0:-500,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

id unico, obj: la mesh da disegnare, x0,y0,z0 posizioni iniziali, gli altri di default vanno come mostrato.

l'animazione va messa in un array già definito (possiamo accordarci perchè lo definiate voi)

-> animations.push(anim); 

* Creare Camere

createCamera(obj)-> obj = {x0: ,y0: ,z0: }

le camere possono essere animate come tutti gli altri oggetti, quindi basta mettere la camera
al posto della mesh:

anim = {id:8, obj:camera,…}

per le camere specificare la funzione TWEEN.Easing.Linear.None 



