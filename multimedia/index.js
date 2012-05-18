/**
 *The index.js is the script which takes care of starting the server
 *and defining the router and the request handler that the server had
 *to use.
 */

/**
 *Importing server, router and requestHandlers script
 */

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");



/**
 *An handle object is created (initially empty).
 *For any request handler that is going to be used, it must be added to 
 *the handle object in the following way:
 *
 *		handle["exampleRequestName"] = requestHandlers.exampleRequestName
 *
 *Of course in the requestHandlers script must be defined a function called:
 * 
 *		function exampleRequestName(response [,request]){...}
 *
 */

var handle = {}
handle["/"] = requestHandlers.index;
handle["/index"] = requestHandlers.index;
handle["/js"] = requestHandlers.loader;
handle["/css"] = requestHandlers.loader;
handle["/encodeVideo"] = requestHandlers.encodeVideo;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;



/**
 *Starts the server passing the route function and the handle object
 */

server.start(router.route, handle);
