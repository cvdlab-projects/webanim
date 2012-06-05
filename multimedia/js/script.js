!(function(exports) {
	self = {};
	//Templates
	var controls = '<div id="videoControls"><ul id="leftPanel">'+
					'<li>File Name:<input id="videoName" class="textboxDefault" type="text" value="insert name"></input></li>'+
					'<li>Tag:<input id="searchTag" class="textboxDefault" type="text" value="insert tag"></input></li>'+
					'<li>Description:<input id="videoDescription" class="textboxDefault" height="300" type="text" value="insert description"></input></li>'+
					'<li><input id="searchVideo" type="button" value="Search Video"></input></li>'+
					'<li><br /></li>'+
					'<li>FPS:<input id="fpsVideo" type="text" value="25"></input></li>'+
					'<li>Recorded frames:<input id="recordedFrames" type="text" value="0" readonly></input></li>'+
					'<li><input id="createVideo" type="button" value="Create Video"></input></li>'+
					'<li><br /></li>'+
					'<li><input id="getFrameButton" type="button" value="GetFrame"></input></li>'+
					'<li><input id="startStop" type="button" value="Start/Stop Recording"></input></li>'+
					'<li><input id="emptyBuffer" type="button" value="Remove Recorded Frames"></input></li>'+
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
		self.searchTagTextBox = $('#searchTag');
		self.videoDescriptionTextBox = $('#videoDescription');
		self.searchVideoButton = $('#searchVideo');
		self.fpsVideoTextBox = $('#fpsVideo');
		self.getFrameButton = $('#getFrameButton');
		self.startStopButton = $('#startStop');
		self.createVideoButton = $('#createVideo');
		self.emptyBufferButton = $('#emptyBuffer');

		self.videoObject = {
			width: self.recordingCanvas.width,
			height: self.recordingCanvas.height,
			videoName: self.videoNameTextBox.val(),
			searchTag: self.searchTagTextBox.val(),
			videoDescription: self.videoDescriptionTextBox.val(),
			frameNumber: 0,
			capturedFrames: {}
		};
		
		self.videoNameTextBox.on('keyup', function() {
			self.videoObject.videoName = $(this).val().replace(/ /g,"_"); // il nome non puo contenere spazi
		});

		self.videoNameTextBox.on('focus', function() {
			if($(this).val() === 'insert name') {
				$(this).val('');
				$(this).removeClass('textboxDefault');
			}
		});

		self.videoNameTextBox.on('blur', function() {
			if($(this).val() === '') {
				$(this).val('insert name');
				$(this).addClass('textboxDefault');
			}
		});

		self.searchTagTextBox.on('keyup', function() {
			self.videoObject.searchTag = $(this).val();
		});

		self.searchTagTextBox.on('focus', function() {
			if($(this).val() === 'insert tag') {
				$(this).val('');
				$(this).removeClass('textboxDefault');
			}
		});

		self.searchTagTextBox.on('blur', function() {
			if($(this).val() === '') {
				$(this).val('insert tag');
				$(this).addClass('textboxDefault');
			}
		});

		self.videoDescriptionTextBox.on('keyup', function() {
			self.videoObject.videoDescription = $(this).val();
		});

		self.videoDescriptionTextBox.on('focus', function() {
			if($(this).val() === 'insert description') {
				$(this).val('');
				$(this).removeClass('textboxDefault');
			}
		});

		self.videoDescriptionTextBox.on('blur', function() {
			if($(this).val() === '') {
				$(this).val('insert description');
				$(this).addClass('textboxDefault');
			}
		});

		self.emptyBufferButton.on('click', function() {
			self.videoObject.capturedFrames = [];
			self.videoObject.frameNumber = 0;
			$("#recordedFrames").val(self.videoObject.frameNumber);
		});

		self.getFrameButton.on('click', function(e) {
			self.videoObject.capturedFrames[self.videoObject.frameNumber++] = self.recordingCanvas.toDataURL();
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
				url: ("./encodeVideo/"), //url: ("http://localhost:8080/encodeVideo/"),
				data: self.videoObject,
				error: function(){
						alert('Bad request, fill all data fields');
					},
				success: function(result) {
					$('#videoPlayer').remove();
					var newVideoPlayer = '<video id="videoPlayer" ' +
										 'width=640 ' +
								  		 'height=480 ' +
								  		 'controls="controls" >' +
								  		 '<source src="' + result + '" ' +
								  		 'type="video/ogg" />' +
								  		 'Il browser non supporta html5' + 
								  		 '</video>';
					self.videoContainer.append(newVideoPlayer);
					//alert("Video caricato correttamente :D\nE' stato aggiunto un player in fondo alla pagina per visualizzarlo :)");
				}
			});
		});

		// DELETABLE
		/*
		self.searchVideoButton.on('click', function(e) {
			$.ajax({
				type: "POST",
				dataType: "text",
				url: ("./searchVideo/"),
				data: self.videoObject,
				error: function() {
						alert('Bad request, fill all data fields');
					},
				success: function(result) {
                    var resp = '<ul id="resultList">';
                    for(var i = result.indexOf('}') + 1; i != 0; i = result.indexOf('}') + 1) {
                    	var temp = $.parseJSON(result.substring(0,i));
                    	resp += '<li class="resultItem">' + 
                            	'<div>Name: ' + temp.videoName.substring(0,temp.videoName.lastIndexOf('_')) + '</div>' +
                            	'<div>Tag: ' + temp.searchTag + '</div>' +
                            	'<div>Description: ' + temp.videoDescription + '</div>' +
                            	'<div><input type="button" value="Download"></input></div>' +
                            	'</li>';
                           result = result.substring(i);
                    }
                    resp += '</ul>';
					$("#result").html(resp);
					//alert('Service Message: "Black Magic here"');
				}
			});
		});
	}
	*/


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
