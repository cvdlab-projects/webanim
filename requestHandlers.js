/**
 *Importing some module (more docs is coming..)
 */

var querystring = require("querystring"),
    fs = require("fs"),
    path = require("path"),
    nodeVideo = require("video"),
    formidable = require("formidable"),
    buffer = require("buffer");
	pngHandler = require("./png"),
	url = require('url'),
    clucene = require("./node_modules/clucene/clucene").CLucene;


/**
 *Indexing elements (based on clucene module)
 */
var cluceneDatabasePath = "./clucene_index";
var lucene = new clucene.Lucene();

/**
 *The data2bitmap function converts a png image into a RGB buffer.
 *It takes as argument the data string, encoded in base64 which represent 
 *the image/png frame
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
}


/**
 *The encodeVideo function handles the making of an .ogv video from a collection of frames sent to the server.
 */
function encodeVideo(response, request) {
    console.log("Request handler 'encodeVideo' was called.");
    var form = new formidable.IncomingForm();
    console.log("Parsing data source...");
    form.parse(request, function(error, fields, files) {

        if (fields.videoName !== "") {
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

            console.log("Setting video dimension to " + frameWidth + "x" + frameHeight);
            video = new nodeVideo.FixedVideo(parseInt(fields.width), parseInt(fields.height));

            console.log("Saving video to file '" + filePathName + "'");
            video.setOutputFile(filePathName);

            console.log("Reconstructing image structure of " + frameNumber + " frames...");

            var begin = new Date().getTime();
            for (frameId = 0; frameId < frameNumber; frameId++) {
                console.log("Reconstructing frame number " + frameId);
                base64text = fields['capturedFrames[' + frameId + ']'];
                base64imageData = base64text.substring(base64text.indexOf(",") + 1);
                imageMap = data2bitmap(base64imageData);
                video.newFrame(new Buffer(imageMap));
            }
            console.log("Done!");

            video.end();
            console.log("Video saved successfully!");
            
            console.log("Indexing video through Lucene");
            var doc = new clucene.Document();

            console.log(fields.searchTag);
            doc.addField('videoName', fields.videoName + '_' + timeStamp, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
            doc.addField('videoPath', './media/video/' + fields.videoName + '_' + timeStamp + '.ogg', clucene.STORE_YES|clucene.INDEX_UNTOKENIZED);
            doc.addField('searchTag', fields.searchTag, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
            doc.addField('videoDescription', fields.videoDescription, clucene.STORE_YES|clucene.INDEX_TOKENIZED);
			doc.addField('videoPreview', fields['capturedFrames['+Math.floor(Math.random()*(frameNumber/10) +1)+']'], clucene.STORE_YES);
            
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
}

/**
 *Search function for recovering videos
 */
function searchVideo(response, request) {
    console.log("Request handler 'searchVideo' was called.");
	console.log(request.url);
	var q = url.parse(request.url, true).query['q'];
    console.log("Searching for videos...");

        if (q !== "" && q !== undefined && q!==null) {
            console.log(q);          
            var queryTerm = q.replace(/=/gi ,":");
			console.log(queryTerm);
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
}


/**
 *The index function handles the access to the index page
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
}



/**
 *The loader function handles the loading of text files, such as .css, .js, .html
 *
 */
function loader(response, request) {
    var filePath = '.' + request.url;
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
}

/*Download video*/
function downloadVideo(response, request){
    var filename =  "./media/video/" + url.parse(request.url).pathname.split("/").pop();
    var dlprogress = 0;
    console.log(filename);
    
    // setInterval(function () {
    //    console.log("Download progress: " + dlprogress + " bytes");
    // }, 1000);
    
    //response.setHeader('Content-disposition', 'attachment; filename=' + filename);
    //response.setHeader('Content-type', 'video/ogg');

    var downloadfile = fs.createReadStream(filename);
    console.log("Download file vale: " + downloadfile);
    downloadfile.on('data', function (chunk) {
        dlprogress += chunk.length;
        response.write(chunk, encoding='binary');
    });
    downloadfile.on("end", function() {
        response.end();
        console.log("Finished downloading " + filename);
    });
}



/**
 *Exports all the request handlers function outside the module
 */
exports.index = index;
exports.loader = loader;
exports.encodeVideo = encodeVideo;
exports.searchVideo = searchVideo;
exports.downloadVideo = downloadVideo;