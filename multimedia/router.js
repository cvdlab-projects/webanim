/**
 *The router.js script define a route function, which forward the request to the 
 *right request handler (if it exist) or return a 404 not found error response.
 *
 *The function takes some arguments that are:
 *		-the handle object
 *		-the pathname to the resource to access
 *		-the response object
 *		-the request object
 */

function route(handle, pathname, response, request) {
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		handle[pathname](response, request);
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, {
			"Content-Type": "text/html"
		});
		response.write("404 Not found");
		response.end();
	}
}



/**
 *Exports the route function outside, so that it is accessible from the outside
 */

exports.route = route;
