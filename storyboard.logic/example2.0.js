var fc = new FrontController();

fc.addEvent("3");
fc.addEvent("4");
fc.addEvent("5");

/* [description, idFrom, idTo, duration, behaviourInfo] */
fc.addSegment(["1",1,3,2,["quadrato","translate",1,2,3,0,0,0,0,0,0]]);
fc.addSegment(["2",1,4,5,["triangolo","translate",2,2,3,0,0,0,0,0,0]]);
fc.addSegment(["3",3,5,3,["quadrato","rotate",0,0,0,90,80,60,0,0,0]]);
fc.addSegment(["4",4,2,2,["triangolo","scale",0,0,0,0,0,0,0.2,0.2,0.2]]);
fc.addSegment(["5",5,2,6,["quadrato","scalee",0,0,0,0,0,0,0.5,0.5,0.5]]);
fc.addSegment(["6",5,4,2,["circle","rotate",0,0,0,60,20,50,0,0,0]]);


if(fc.isStoryboardValid())
	fc.processStoryboard();
else
	fc.getValidityIssues();