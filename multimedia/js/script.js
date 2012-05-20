!(function(exports) {
	self = {};
	//Templates
	var controls = '<div id="videoControls"><ul id="leftPanel">'+
					'<li>File Name:<input id="videoName" type="text" value="video_name"></input></li>'+
					'<li>Tag:<input id="idTag" type="text" value=""></input></li>'+
					'<li>FPS:<input id="fpsVideo" type="text" value="25"></input></li>'+
					'<li> Recorded frames:<input id="recordedFrames" type="text" value="0"></input></li>'+
					'<li><input id="getFrameButton" type="button" value="GetFrame"></input></li>'+
					'<li><input id="startStop" type="button" value="Start/Stop Recording"></input></li>'+
					'<li><input id="createVideo" type="button" value="Create Video"></input></li>'+
					'</ul></div>';
	var rStatus = '<div id="recordingStatus" class="recordingStatusOff"><p>Ready to record</p></div>';

	function changeRecordingStatus() {
		var on = "Recording";
		var off ="Ready to record";

		if($('#recordingStatus p:first-child').text() === on) {
			$('#recordingStatus').append('<p>' + off + '</p>');
		} else {
			$('#recordingStatus').append('<p>' + on + '</p>');
		}
		//console.log($('#recordingStatus p:first-child'));
		$('#recordingStatus p:first-child').remove();

		$('#recordingStatus').toggleClass("recordingStatusOff recordingStatusOn");
	}
	
	var setRecordingCanvas = function(id){ self.recordingCanvas = $(id)[0]; };
	var getRecordingCanvas = function() { return self.recordingCanvas; };
	var appendVideoControls = function(container) { container.append(controls); };
	var prependVideoControls = function(container) { container.prepend(controls); };
	var appendRecordingStatus = function(container) { container.append(rStatus); loadButtons(); };
	var prependRecordingStatus = function(container) { container.prepend(rStatus); loadButtons(); };	
	var removeRecordingStatus = function(){ $('#recordingStatus').remove() };
	var removeControlsButton = function() { $('#videoControls').remove() };
	var setVideoContainer = function(id) { self.videoContainer = $(id); };
	var loadButtons = function(){
		self.videoNameTextBox = $('#videoName');
		self.idTagTextBox = $('#idTag'); // Not Used, Yet
		self.fpsVideoTextBox = $('#fpsVideo');
		self.getFrameButton = $('#getFrameButton');
		self.startStopButton = $('#startStop');
		self.createVideoButton = $('#createVideo');

		self.videoObject = {
			width: self.recordingCanvas.width,
			height: self.recordingCanvas.height,
			videoName: self.videoNameTextBox.val(),
			frameNumber: 0,
			capturedFrames: {}
		};
		
		self.videoNameTextBox.on('keyup', function() {
			self.videoObject.videoName = $(this).val();
		});

		self.getFrameButton.on('click', function(e) {
			videoObject.capturedFrames[self.videoObject.frameNumber++] = self.recordingCanvas.toDataURL();
			$("#recordedFrames").val(self.videoObject.frameNumber);
		});

		self.startStopButton.on('click', function(e) {
			changeRecordingStatus();
			if (timingGetFrame !== undefined) {
				clearInterval(timingGetFrame);
				timingGetFrame = undefined;
			} else {
				timingGetFrame = setInterval(function(e) {
					self.videoObject.capturedFrames[self.videoObject.frameNumber++] = self.recordingCanvas.toDataURL();
					$("#recordedFrames").val(self.videoObject.frameNumber);
				}, 1000/parseInt(self.fpsVideoTextBox.val()));
			}
		});

		self.createVideoButton.on('click', function(e) {
			$.ajax({
				type: "POST",
				url: ("http://localhost:8080/encodeVideo/"),
				data: self.videoObject,
				error: function(){
						alert('Bad request, fill all data fields');
					},
				success: function() {
					$('#videoPlayer').remove();
					var newVideoPlayer = '<video id="videoPlayer" ' +
										 'width=640 ' +
								  		 'height=480 ' +
								  		 'controls="controls" >' +
								  		 '<source src="./media/video/' + self.videoObject.videoName + '.ogg" ' +
								  		 'type="video/ogg" />' +
								  		 'Il browser non supporta html5' + 
								  		 '</video>';
					self.videoContainer.append(newVideoPlayer);
					alert("Video caricato correttamente :D\nE' stato aggiunto un player in fondo alla pagina per visualizzarlo :)");
				
				}
			});
		});
	}


	//Exported functions outside the env
	exports.setRecordingCanvas = setRecordingCanvas;
	exports.getRecordingCanvas = getRecordingCanvas;
	exports.appendVideoControls = appendVideoControls;
	exports.prependVideoControls = prependVideoControls;
	exports.appendRecordingStatus = appendRecordingStatus;
	exports.prependRecordingStatus = prependRecordingStatus;	
	exports.removeRecordingStatus = removeRecordingStatus;
	exports.removeControlsButton = removeControlsButton;
	exports.loadButtons = loadButtons;
	exports.setVideoContainer = setVideoContainer;

}(this));
