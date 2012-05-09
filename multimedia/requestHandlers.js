var querystring = require("querystring"),
  fs = require("fs"),
  path = require("path"),
  nodeVideo = require("video");
  formidable = require("formidable");


function encodeVideo(response, request) {
  var data = request.data;
  var video = new FixedVideo(data.width, data.height);
  video.setOutputFile('./media/video/' + data.name + '.ogv');
  for (rgbFrame in data.capturedFrames) {
    video.newFrame(data.capturedFrames[rgbFrame]);
  }
  video.end();
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
