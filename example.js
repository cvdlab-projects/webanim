var sbc = new StoryboardController();
var sb = sbc.storyboard;

sbc.addEvent("3");
sbc.addEvent("4");
sbc.addEvent("5");

sbc.startAddNewSegment("1");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(3);
sbc.setDurationForNewSegment(2);
sbc.setDescriptionForNewSegment(["quadrato","translate",1,2,3,0,0,0,0,0,0]);
sbc.addNewSegment();

sbc.startAddNewSegment("2");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(5);
sbc.setDescriptionForNewSegment(["triangolo","translate",2,2,3,0,0,0,0,0,0]);
sbc.addNewSegment();

sbc.startAddNewSegment("3");
sbc.setFromEventForNewSegment(3);
sbc.setToEventForNewSegment(5);
sbc.setDurationForNewSegment(3);
sbc.setDescriptionForNewSegment(["quadrato","rotate",0,0,0,90,80,60,0,0,0]);
sbc.addNewSegment();

sbc.startAddNewSegment("4");
sbc.setFromEventForNewSegment(4);
sbc.setToEventForNewSegment(2);
sbc.setDurationForNewSegment(2);
sbc.setDescriptionForNewSegment(["triangolo","scale",0,0,0,0,0,0,0.2,0.2,0.2]);
sbc.addNewSegment();

sbc.startAddNewSegment("5");
sbc.setFromEventForNewSegment(5);
sbc.setToEventForNewSegment(2);
sbc.setDurationForNewSegment(6);
sbc.setDescriptionForNewSegment(["quadrato","scale",0,0,0,0,0,0,0.5,0.5,0.5]);
sbc.addNewSegment();

sbc.startAddNewSegment("6");
sbc.setFromEventForNewSegment(5);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(2);
sbc.setDescriptionForNewSegment(["circle","rotate",0,0,0,60,20,50,0,0,0]);
sbc.addNewSegment();

if(sbc.isValidStoryboard())
	var timeline = sbc.processStoryboard();