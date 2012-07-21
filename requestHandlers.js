/**
 *	Querystring module of node.js.
 *	@requires querystring
 */
var querystring = require("querystring");

/**
 *	Filesystem module of node.js.
 *	@requires fs
 */
var fs = require("fs");

/**
 *	Path module of node.js.
 *	@requires path
 */
var path = require("path");

/**
 *	Node Video module of node.js.
 *	@requires video
 */
var nodeVideo = require("video"),

/**
 *	Formidable module of node.js.
 *	@requires formidable
 */
var formidable = require("formidable"),

/**
 *	Buffer module of node.js.
 *	@requires buffer
 */
var buffer = require("buffer"),

/**
 *	Png module for handling png images
 *	@requires http
 */
var pngHandler = require("./png"),

/**
 *	Url module of node.js.
 *	@requires url
 */
var url = require('url'),

/**
 *	Clucene module of node.js.
 *	@requires clucene
 */
var clucene = require("./node_modules/clucene/clucene").CLucene;


/**
 *  Initialize clucene and database path
 */
var cluceneDatabasePath = "./clucene_index";
var lucene = new clucene.Lucene();

/**
 *	Function that converts a png image into a RGB buffer.
 *	@param { String } data A base64 encoding of a png image.
 *	@return { number buffer[] } image A buffer containing the image's RGB encoding
 */
function data2bitmap(data) {
    var png = new pngHandler.PNG(data);
    var line;
    var imageMap = [];
    while (line = png.readLine()) {
        for (var x = 0; x < line.length; x++) {
			var tmp = line[x];
			imageMap.push(((tmp & 0xFF0000) >> 16),((tmp & 0xFF00) >> 8),(tmp & 0xFF));
        }
    }
    return imageMap;
};

/**
 *	Function that handles the generation of a .ogv video from a collection of frames sent to the server. into the XMLHttpRequest.
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
 *
 */
function encodeVideo(response, request) {
	console.log("Request handler 'encodeVideo' was called.");
	var form = new formidable.IncomingForm();
	
	//Parsing data source..
	form.parse(request, function(error, fields, files) {

		
		if (fields.videoName !== "") {
			
			//Video data initialization
			var timeStamp = new Date().getTime();
			var filePathName = './media/video/' + fields.videoName + '_' + timeStamp +'.ogg';
			var frameWidth = parseInt(fields.width) || 0;
			var frameHeight = parseInt(fields.height) || 0;
			var frameNumber = parseInt(fields.frameNumber);
			var pixelNumber = 0;
			var frameId = 0;
			var base64text;
			var base64imageData;
			var video;

			console.log("\nGenerating Video...");
			console.log("Setting video dimensions to " + frameWidth + "x" + frameHeight);
			
			//Create a new video Object with the fixed dimensions
			video = new nodeVideo.FixedVideo(parseInt(fields.width), parseInt(fields.height));

			console.log("Saving video to file '" + filePathName + "'");
			
			//Create video output file
			video.setOutputFile(filePathName);

			console.log("Reconstructing image structure of " + frameNumber + " frames...");

			var begin = new Date().getTime();
			
			/**
			 * Converts all the frames of the video from base64 to RGB 
			 * and add them to the video Object			
			 */
			for (frameId = 0; frameId < frameNumber; frameId++) {
				console.log("Reconstructing frame number " + frameId);
				base64text = fields['capturedFrames[' + frameId + ']'];
				base64imageData = base64text.substring(base64text.indexOf(",") + 1);
				imageMap = data2bitmap(base64imageData);
				video.newFrame(new Buffer(imageMap));
			}
			console.log("Done!");
			
			//Save video on the server
			video.end();

			console.log("Video saved successfully!");            
			console.log("Indexing video through Lucene");
			
			//Create a new CLucene document Object
			var doc = new clucene.Document();

			console.log(fields.searchTag);
			
			//Insert into the document all the fields needed for the indexing
			doc.addField('videoName', fields.videoName + '_' + timeStamp, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
			doc.addField('videoPath', './media/video/' + fields.videoName + '_' + timeStamp + '.ogg', clucene.STORE_YES|clucene.INDEX_UNTOKENIZED);
			doc.addField('searchTag', fields.searchTag, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
			doc.addField('videoDescription', fields.videoDescription, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
			doc.addField('videoPreview', fields['capturedFrames['+Math.floor(Math.random()*(frameNumber/10) +1)+']'], clucene.STORE_YES);

			//Add the document to the index
			lucene.addDocument("" + timeStamp, doc, cluceneDatabasePath, function(err, indexTime) {
				lucene.closeWriter();
			});

			console.log("Video correctly indexed!");

			response.writeHead(200, { 'Content-Type': 'text/plain'});
			response.write(filePathName);

		}else{
			response.writeHead(400);
		}        

		response.end();
	});
};

/**
 *	Function that handles the video search on the server.
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
 *
 */
function searchVideo(response, request) {
	
	console.log("Request handler 'searchVideo' was called.");
	console.log(request.url);
	console.log("Searching for videos...");
	
	var q = url.parse(request.url, true).query['q'];	

        if (q !== "" && q !== undefined && q!==null) {
            console.log(q);  

	// Preparing the query to submit to CLucene
	var queryTerm = q.replace(/=/gi ,":");
	console.log(queryTerm);
		
	//search into CLucene database
	lucene.search(cluceneDatabasePath, queryTerm, function(err, results) {
		if (err) {
			response.writeHead(500)
			console.log('Search error: ' + err);
			response.end();
		}
		if(results!==null && results!==undefined && results.length > 0){
			response.writeHead(200, { 'Content-Type': 'text/html'});
			response.write(JSON.stringify(results));
			response.end();
		}else{
			response.writeHead(404, { 'Content-Type': 'text/html'});
			response.write("Nessun video trovato");
			response.end();
		}
	});
        }else{
            response.writeHead(400);
            response.end();
        }
};

/**
 *	Function that handles the access to the index page
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
 *
 */
function index(response) {
    fs.readFile('./index.html', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.end(content, 'utf-8');
        }
    });
};

/**
 *	Function that handles the loading of requested resources.
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
 *
 */
function loader(response, request) {
	var filePath = '.' + request.url;
	
	// Select the content type of the requested resource
	contType = {
	'.js': 'text/javascript',
	'.css': 'text/css',
		'.ogv': 'video/ogg',
		'.png': 'image/png',
		'.jpeg': 'image/jpeg',
		'.ico' : 'vnd.microsoft.icon',
		'.ttf': 'font/ttf'
	};
	
	if (filePath == './') filePath = './index.html';
	var extname = path.extname(filePath);
	var contentType = contType[extname] || 'text/html';

	path.exists(filePath, function(exists) {
		
		if (exists) {
			
			//Try to acccess the requested resource
			fs.readFile(filePath, function(error, content) {
				if (error) {
				    response.writeHead(500);
				    response.end();
				} else {
					response.writeHead(200, {
						'Content-Type': contentType
					});
					response.end(content, 'utf-8');
				}
			});
		} else {
			response.writeHead(404);
			response.end();
		}
	});
};

/**
 *	Function that handles the video download request.
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
 *
 */
function downloadVideo(response, request){
	
	var filename =  "./media/video/" + url.parse(request.url).pathname.split("/").pop();
	var dlprogress = 0;
	var downloadfile = fs.createReadStream(filename);
	
	console.log(filename); 	
	console.log("Download file vale: " + downloadfile);
	
	downloadfile.on('data', function (chunk) {
		dlprogress += chunk.length;
		response.write(chunk, encoding='binary');
	});
	
	downloadfile.on("end", function() {
		response.end();
		console.log("Finished downloading " + filename);
	});
};

/**
 *Exports all the request handlers function outside the module
 */
exports.index = index;
exports.loader = loader;
exports.encodeVideo = encodeVideo;
exports.searchVideo = searchVideo;
exports.downloadVideo = downloadVideo;
