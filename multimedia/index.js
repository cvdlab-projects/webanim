var server = require("./server");
var router = require("./router");

var requestHandlers = require("./requestHandlers");

var handle = {}

handle["/"] = requestHandlers.index;
handle["/index"] = requestHandlers.index;

handle["/js"] = requestHandlers.loader;
handle["/css"] = requestHandlers.loader;

handle["/encodeVideo"] = requestHandlers.encodeVideo;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);
