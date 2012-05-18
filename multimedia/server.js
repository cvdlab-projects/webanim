/**
 *Requiring http and url module of node.js
 */

var http = require("http");
var url = require("url");



/**
 *The function called on server's start. It takes some arguments:
 *		-the route function from the router module
 *		-the handle object
 *
 *It also define an onRequest(request, response) function wich is called at every request
 *which forward the request to the right requestHandler defined in the handle object
 *through the route function.
 *
 *The start function also create the server and makes it listen on the choosen port
 */

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = ("/" + url.parse(request.url).pathname.split("/")[1]) || "/";
		console.log("Request for " + pathname + " received.");
		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8080);
	console.log("Server has started.");
}



/**
 *Exporting the start function outside the script, so the server can be started.
 */

exports.start = start;
