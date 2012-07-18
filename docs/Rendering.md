# RENDERING
######web animation sub-project

- - -

>##Introduction
> 
> >The purpose of this subproject was to animate objects 3d chosen by the user in the previous  
> >initialization phase.
> >To achieve this goal we used two javascript libraries: Three.js and Tween.js.
> >The first is a library for rendering objects and drawing on canvas:
> >With Three you can draw 3D and 2D objects such as cubes, pyramids, spheres as well as be able
> > to define your own meshes.
> >The second one deals with animation: It is possible to define a tween, a transition, assigning 
> >a starting time, duration, and the action to be performed in that particular time. 

- - - 
- - -


> ##How it works:
> >In the initialization Phase, every 3d object as well as every animation is taken and put
> >inside a structure (an array) together with cameras and user defined meshes.
> >For each camera we put in the array, a button is created in the UI to give the possibility
> > to the user to exchange them at execution time.
> >Objects initial state (position, rotation, scale) is saved.
>
>		function setupScene(){
>		    init(800, 600); // THREE.js initialization
>			saveOriginalState(); // original state is saved
>			createTweensFromTransitions(); // tweens are created
>		    meshesStartingState(); // meshes are set starting state
>		    animate();
>
>		}


> For each animation a new Tween object is created with his parameters (starting time, action,
> >etc...)
> >
> >In the rendering script there's a main loop that calls the function "RequestAnimationFrame".
> >It tells the browser that you wish to perform an animation; this requests that the browser 
> >schedule a repaint of the window for the next animation frame.  The method takes as an 
> >argument 
> >a callback to be invoked before the repaint.



> ###### `JS Code:`

>	    function animate() {
>
>	        requestAnimationFrame( animate );
>	        render();
>	    }
>
>	    function render() {
>
>	        renderer.render( scene, camera );
>
>	    }
>	    
>
> >In this way objects are shown in their original/starting state ready to be animated.
>
>		function play(){
>			playFrom(); // calculate the scene at the selected start time 
>			
>			if(!isanimating || ispaused){
>				for(var i in tweens){
>
>					tweens[i].start();	
>						
>				}
>				isanimating = true;
>			}		
>		}
>		
>
> > When Play button is pushed, tweens are started so meshes are rotated or scaled or moved from
> >their original position. 
> >If the animation is stopped or restarted, the original state is restore and every tween is 
> >recreated. This happens also in case of start from a specific second with the added step 
> > of calculating and adding to the starting state the effects preceding the starting time .
> 
>
>	      function stop(){
>			for(var i in tweens){
>
>					tweens[i].stop();		
>			}	
>			TWEEN.removeAll(); //old tweens are removed
>			restoreTransitions(); //tween are recreated
>			meshesStartingState();	// meshes are set in the original starting state
>			tweens = [];
>			startTime = 0; // set start time
>		}


- - -
- - -
> 
> 
>##Functions and features:
> > Tween gives the possibility just to start and pause the animation.
> > We developed the following features :
> >
> > #####PLAY
> > >granted by TWEEN.js
> 
> > ######STOP
> > >to stop the animation we pause it, we load meshes in the starting state (previously 
> > >saved), and restore tweens.
> 
> > #####PAUSE
> > > granted by TWEEN.js
> 
> > #####FAST FORWARD
> > > set the start time === end time and calculate the scene composition at that certain time.
> 
> > #####REWIND
> > > like STOP
> 
> > #####CAMERAS ANIMATION
> > > cameras are treated as animated objects so they can be rotated, scaled and moved.
> 
> > #####START FROM SECOND
> > > depending on the starting time, a new starting state is calculated.
> > > Playing the animation it will start tweens from that specific state.
> 
> > #####START FROM FRAME
> > > like Start from second, but with frames
> 
> > #####LOOK AT CENTER
> 
> > #####SWITCHING BETWEEN CAMERAS
> > > during the animation, cameras can be switched.
> >
- - -
- - -













