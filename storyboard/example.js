var sbc = new StoryboardController();
var sb = sbc.storyboard;

sbc.addEvent("3");
sbc.addEvent("4");
sbc.addEvent("5");

sbc.startAddNewSegment("1");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(3);
sbc.setDurationForNewSegment(2);
sbc.addNewSegment();

sbc.startAddNewSegment("2");
sbc.setFromEventForNewSegment(1);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(5);
sbc.addNewSegment();

sbc.startAddNewSegment("3");
sbc.setFromEventForNewSegment(3);
sbc.setToEventForNewSegment(5);
sbc.setDurationForNewSegment(3);
sbc.addNewSegment();

sbc.startAddNewSegment("4");
sbc.setFromEventForNewSegment(4);
sbc.setToEventForNewSegment(2);
sbc.setDurationForNewSegment(2);
sbc.addNewSegment();

sbc.startAddNewSegment("5");
sbc.setFromEventForNewSegment(5);
sbc.setToEventForNewSegment(2);
sbc.setDurationForNewSegment(6);
sbc.addNewSegment();

sbc.startAddNewSegment("6");
sbc.setFromEventForNewSegment(5);
sbc.setToEventForNewSegment(4);
sbc.setDurationForNewSegment(2);
sbc.addNewSegment();

sbc.processStoryboard();