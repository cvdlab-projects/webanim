var sbc = new StoryboardController(new Listener());
sbc.addEvent("A");
sbc.addEvent("B");
sbc.addActor("quadrato","quadrato"); //
sbc.addActor("triangolo","triangolo"); //
sbc.startAddSegment(1,3);
sbc.setActorForNewSegment(1); //
sbc.setDescriptionForNewSegment("1-A");
sbc.setDurationForNewSegment(4);
sbc.addSegment();
sbc.startAddSegment(3,4);
sbc.setActorForNewSegment(2); //
sbc.setDescriptionForNewSegment("A-B");
sbc.setDurationForNewSegment(3);
sbc.addSegment();
sbc.startAddSegment(1,4);
sbc.setActorForNewSegment(1); //
sbc.setDescriptionForNewSegment("1-B");
sbc.setDurationForNewSegment(5);
sbc.addSegment();
sbc.startAddSegment(4,2);
sbc.setActorForNewSegment(2);//
sbc.setDescriptionForNewSegment("B-2");
sbc.setDurationForNewSegment(2);
sbc.addSegment();
sbc.processStoryboard();