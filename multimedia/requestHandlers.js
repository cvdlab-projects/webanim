var querystring = require("querystring"),
    fs = require("fs"),
    path = require("path"),
    nodeVideo = require("video"),
    formidable = require("formidable"),
    buffer = require("buffer");
pngHandler = require("./png");

function data2bitmap(data) {
    var png = new pngHandler.PNG(data);
    var line;
    var imageMap = [];
    while (line = png.readLine()) {
        for (var x = 0; x < line.length; x++) {
            imageMap.push((line[x] & 0xFF0000) >> 16);
            imageMap.push((line[x] & 0xFF00) >> 8);
            imageMap.push(line[x] & 0xFF);
        }
    }
    return imageMap;
}

function encodeVideo(response, request) {
    console.log("Request handler 'encodeVideo' was called.");
    var form = new formidable.IncomingForm();
    console.log("Parsing data source...");
    form.parse(request, function(error, fields, files) {

        if (fields.videoName !== "") {
            var filePathName = './media/video/' + fields.videoName + '.ogv';
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
        }

        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

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

function loader(response, request) {
    var filePath = '.' + request.url;
    contType = {
        '.js': 'text/javascript',
        '.css': 'text/css'
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

function start(response) {
    console.log("Request handler 'start' was called.");

    var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" ' + 'content="text/html; charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/upload" enctype="multipart/form-data" ' + 'method="post">' + '<input type="file" name="upload" multiple="multiple">' + '<input type="submit" value="Upload file" />' + '</form>' + '</body>' + '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        console.log(fields);

        /* Possible error on Windows systems:
       tried to rename to an already existing file */
        fs.rename(files.upload.path, "/tmp/test.png", function(err) {
            if (err) {
                fs.unlink("/tmp/test.png");
                fs.rename(files.upload.path, "/tmp/test.png");
            }
        });
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/tmp/test.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.index = index;
exports.start = start;
exports.loader = loader;
exports.encodeVideo = encodeVideo;
exports.upload = upload;
exports.show = show;
