var querystring = require("querystring"),
    fs = require("fs"),
    path = require("path"),
    nodeVideo = require("video"),
    formidable = require("formidable"),
    buffer = require("buffer");



// TEMP

    // MODIFICARE QESTO METODO PER PRENDERE O PARSARE IL GIUSTO TIPO DI DATO

    // creates a base64 encoded string containing BMP data
    // takes an imagedata object as argument 
    var createBMP = function(oData) {
        var aHeader = [];
    
        var iWidth = oData.width;
        var iHeight = oData.height;

        aHeader.push(0x42); // magic 1
        aHeader.push(0x4D); 
    
        var iFileSize = iWidth*iHeight*3 + 54; // total header size = 54 bytes
        aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256); iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256);

        aHeader.push(0); // reserved
        aHeader.push(0);
        aHeader.push(0); // reserved
        aHeader.push(0);

        aHeader.push(54); // dataoffset
        aHeader.push(0);
        aHeader.push(0);
        aHeader.push(0);

        var aInfoHeader = [];
        aInfoHeader.push(40); // info header size
        aInfoHeader.push(0);
        aInfoHeader.push(0);
        aInfoHeader.push(0);

        var iImageWidth = iWidth;
        aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256); iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256);
    
        var iImageHeight = iHeight;
        aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256); iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256);
    
        aInfoHeader.push(1); // num of planes
        aInfoHeader.push(0);
    
        aInfoHeader.push(24); // num of bits per pixel
        aInfoHeader.push(0);
    
        aInfoHeader.push(0); // compression = none
        aInfoHeader.push(0);
        aInfoHeader.push(0);
        aInfoHeader.push(0);
    
        var iDataSize = iWidth*iHeight*3; 
        aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256); iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256); 
    
        for (var i=0;i<16;i++) {
            aInfoHeader.push(0);    // these bytes not used
        }
    
        var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

        var aImgData = oData.data;

        var strPixelData = "";
        var y = iHeight;
        do {
            var iOffsetY = iWidth*(y-1)*4;
            var strPixelRow = "";
            for (var x=0;x<iWidth;x++) {
                var iOffsetX = 4*x;

                strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+2]);
                strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX+1]);
                strPixelRow += String.fromCharCode(aImgData[iOffsetY+iOffsetX]);
            }
            for (var c=0;c<iPadding;c++) {
                strPixelRow += String.fromCharCode(0);
            }
            strPixelData += strPixelRow;
        } while (--y);

        console.log(strPixelData);

        return strPixelData;
    }


// TEMP



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

console.log(fields);

            console.log("\nGenerating Video...");

            console.log("Setting video dimension to " + frameWidth + "x" + frameHeight);
            video = new nodeVideo.FixedVideo(parseInt(fields.width), parseInt(fields.height));

            console.log("Saving video to file '" + filePathName + "'");
            video.setOutputFile(filePathName);

            console.log("Reconstructing image structure of " + frameNumber + " frames...");
            for (frameId = 0; frameId < frameNumber; frameId++) {
                console.log("Reconstructing frame number " + frameId);

                // VEDERE QUALI DATI PASSARE E COME A CREATEBMP
                var temp = fields['capturedFrames[' + frameId + ']'];
                imageMap = createBMP(temp);
                
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
