/**
 *The index.js is the script which takes care of starting the server
 *and defining the router and the request handler that the server had
 *to use.
 */

/**
 *	Server module for node.js.
 *	@requires server
 */
var server = require("./server");

/**
 *	Router module for node.js.
 *	@requires router
 */
var router = require("./router");

/**
 *	RequestHandler module for node.js.
 *	@requires requestHandlers
 */
var requestHandlers = require("./requestHandlers");



/**
 *	An handle object is created (initially empty).
 *	For any request handler that is going to be used, it must be added to 
 *	the handle object in the following way:
 *
 *		handle["exampleRequestName"] = requestHandlers.exampleRequestName
 *
 *	Of course in the requestHandlers script must be defined a function called:
 * 
 *		function exampleRequestName(response [,request]){...}
 *
 */

var handle = {}
handle["/"] = requestHandlers.loader;
handle["/index"] = requestHandlers.index;
handle["/js"] = requestHandlers.loader;
handle["/lib"] = requestHandlers.loader;
handle["/css"] = requestHandlers.loader;
handle["/media"] = requestHandlers.loader;
handle["/encodeVideo"] = requestHandlers.encodeVideo;
handle["/searchVideo"] = requestHandlers.searchVideo;
handle["/downloadVideo"] = requestHandlers.downloadVideo;



/**
 *	Starts the server
 */

server.start(router.route, handle);
