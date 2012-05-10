!(function(exports) {
	// Animation Canvas
	var canvas = $('#canvas')[0];
	var c2d = canvas.getContext('2d');
	c2d.fillStyle = "#FF8800";
	c2d.translate(canvas.width / 2, canvas.height / 2);

	// Controls
	var videoNameTextBox = $('#videoName');
	var idTagTextBox = $('#idTag'); // Not Used, Yet
	var fpsVideoTextBox = $('#fpsVideo'); // Not Used, Yet
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
	var frame = $('#frame')[0];
	var timingGetFrame;
	var angle = 0;
	var squarePosition = {
		s: canvas.height / 20,
		x: canvas.width / 4,
		y: canvas.height / 4
	};
	var timingAnimation = setInterval(function() {
		c2d.clearRect(0, 0, canvas.width, canvas.height);
		c2d.fillRect(squarePosition.x, squarePosition.y, squarePosition.s, squarePosition.s);
		c2d.rotate(angle + Math.PI / 512);
	}, 30);
	// END

	// Add Event Handlers
	videoNameTextBox.on('keyup', function() {
		videoObject.videoName = $(this).val();
	});

	getFrameButton.on('click', function(e) {
		console.log(e);
		imageData = c2d.getImageData(0, 0, canvas.width, canvas.height);
		videoObject.capturedFrames[videoObject.frameNumber++] = imageData;
		console.log(videoObject);
		var c2df = frame.getContext('2d');
		c2df.putImageData(imageData, 0, 0);
	});

	startStopButton.on('click', function(e) {
		if (timingGetFrame !== undefined) {
			clearInterval(timingGetFrame);
			timingGetFrame = undefined;
		} else {
			timingGetFrame = setInterval(function(e) {
				imageData = c2d.getImageData(0, 0, canvas.width, canvas.height);
				videoObject.capturedFrames[videoObject.frameNumber++] = imageData;
				var c2df = frame.getContext('2d');
				c2df.putImageData(imageData, 0, 0);
			}, 30);
		}
	});

	createVideoButton.on('click', function(e) {
		$.ajax({
			type: "POST",
			url: "http://localhost:8080/encodeVideo",
			data: videoObject,
			dataType: JSON,
			success: function() {
				alert("Video caricato correttamente :D")
			}
		});
	});

}(this));
