/**
 *	Http module of node.js.
 *	@requires http
 */
var http = require("http");
 
 /**
  *	Url module of node.js.
  *	@requires url
  */
var url = require("url");



/**
 *	The function called on server's start.
 *	It is listening on port 8080.
 *	@param { function } route The routing function.
 *	@param { function } handle An Object containing the request handler functions.
 *
 */
function start(route, handle) {
	
	 /**	The function called at every request.
	  *	It uses route function and handle object to elaborate request and produce the response.
	  *	@param { Object } reqest The XMLHttpRequest Object.
	  *	@param { Object } response XMLHttpResponse Object.
	  *
	  */	
	function onRequest(request, response) {
		var tmp = url.parse(request.url).pathname.split("/");
		var pathname = (tmp.length > 2)? ("/"+tmp[1]):"/";
		console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8080);
	console.log("Server has started.");
};



/**
 *	Allow the server to be started.
 *	@exports start  as exports.start.
 */
exports.start = start;
