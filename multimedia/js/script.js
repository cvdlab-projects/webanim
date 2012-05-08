!(function(exports) {
	var frame = $('#frame')[0];
	var button = $('#getFrameButton');
	var startStop = $('#startStop');

	var canvas = $('#canvas')[0];
	var c2d = canvas.getContext('2d');
	c2d.fillStyle = "#FF8800";
	c2d.translate(canvas.width / 2, canvas.height / 2);

	var data;
	var angle = 0;

	var squarePosition = {
		s: canvas.height / 20,
		x: canvas.width / 4,
		y: canvas.height / 4
	};

	var getFrame = function(e) {
			data = c2d.getImageData(0, 0, canvas.width, canvas.height);
			var c2df = frame.getContext('2d');
			c2df.putImageData(data, 0, 0);
		};

	var timingGetFrame;

	var startStopRecording = function(e) {
			if (timingGetFrame !== undefined) {
				clearInterval(timingGetFrame);
				timingGetFrame = undefined;
			} else {
				timingGetFrame = setInterval(function(e) {
			data = c2d.getImageData(0, 0, canvas.width, canvas.height);
			var c2df = frame.getContext('2d');
			c2df.putImageData(data, 0, 0);
		}, 30);
			}
		}

	var timingAnimation = setInterval(function() {
			c2d.clearRect(0, 0, canvas.width, canvas.height);
			c2d.fillRect(squarePosition.x, squarePosition.y, squarePosition.s, squarePosition.s);
			c2d.rotate(angle + Math.PI / 512);
		}, 30);

	button.on('click', getFrame);
	startStop.on('click', startStopRecording);
}(this));
