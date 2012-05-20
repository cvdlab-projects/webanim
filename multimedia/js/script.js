!(function(exports) {
	// Animation Canvas
	var canvas = $('#canvas')[0];
	var c2d = canvas.getContext('2d');
	c2d.fillStyle = "#FF8800";
	c2d.translate(canvas.width / 2, canvas.height / 2);

	// Controls
	var videoNameTextBox = $('#videoName');
	var idTagTextBox = $('#idTag'); // Not Used, Yet
	var fpsVideoTextBox = $('#fpsVideo');
	var getFrameButton = $('#getFrameButton');
	var startStopButton = $('#startStop');
	var createVideoButton = $('#createVideo');

	// Data Structure for containing Video properties
	var videoObject = {
		width: canvas.width,
		height: canvas.height,
		videoName: videoNameTextBox.val(),
		frameNumber: 0,
		capturedFrames: {}
	};

	// Canvas Image Data container
	var imageData;


	// BEGIN 
	// Dummy Elements added only for testing
	var timingGetFrame;
	var rotationAngle = Math.PI / 256;
	var squarePosition = {
		s: canvas.height / 20,
		x: canvas.width / 4,
		y: canvas.height / 4
	};
	var timingAnimation = setInterval(function() {
		c2d.clearRect(0, 0, canvas.width, canvas.height);
		c2d.fillRect(squarePosition.x, squarePosition.y, squarePosition.s, squarePosition.s);
		c2d.rotate(rotationAngle);
	}, 1000/30);
	// END

	function changeRecordingStatus() {
		var on = "Recording";
		var off ="Ready to record";

		if($('#recordingStatus p:first-child').text() === on) {
			$('#recordingStatus').append('<p>' + off + '</p>');
		} else {
			$('#recordingStatus').append('<p>' + on + '</p>');
		}
		console.log($('#recordingStatus p:first-child'));
		$('#recordingStatus p:first-child').remove();

		$('#recordingStatus').toggleClass("recordingStatusOff recordingStatusOn");
	}

	// Add Event Handlers
	videoNameTextBox.on('keyup', function() {
		videoObject.videoName = $(this).val();
	});

	getFrameButton.on('click', function(e) {
		videoObject.capturedFrames[videoObject.frameNumber++] = canvas.toDataURL('image/bmp');
		$("#recordedFrames").val(videoObject.frameNumber);
	});

	startStopButton.on('click', function(e) {
		changeRecordingStatus();
		if (timingGetFrame !== undefined) {
			clearInterval(timingGetFrame);
			timingGetFrame = undefined;
		} else {
			timingGetFrame = setInterval(function(e) {
				videoObject.capturedFrames[videoObject.frameNumber++] = canvas.toDataURL();
				$("#recordedFrames").val(videoObject.frameNumber);
			}, 1000/parseInt(fpsVideoTextBox.val()));
		}
	});

	createVideoButton.on('click', function(e) {
		$.ajax({
			type: "POST",
			url: ("http://localhost:8080/encodeVideo"),
			data: videoObject,
			error: function(){
					alert('Bad request, fill all data fields');
				},
			success: function() {
				$('#videoPlayer').remove();
				var newVideoPlayer = '<video id="videoPlayer" ' +
									 'width=640 ' +
							  		 'height=480 ' +
							  		 'controls="controls" >' +
							  		 '<source src="./media/video/' + videoObject.videoName + '.ogg" ' +
							  		 'type="video/ogg" />' +
							  		 'Il browser non supporta html5' + 
							  		 '</video>';
				$('.container').append(newVideoPlayer);
				alert("Video caricato correttamente :D\nE' stato aggiunto un player in fondo alla pagina per visualizzarlo :)");
				
			}
		});
	});

}(this));
