/**
 *	Function that forward the request to the right handler (if it exist) or return a 404 not found error response.
 *
 *	@param { Object } handle object
 *	@param { String } pathname to the resource to access
 *	@param { Object } reqest The XMLHttpRequest Object.
 *	@param { Object } response XMLHttpResponse Object.
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
};

/**
 * 	Allow the route function to be invoked.
 *	@exports start  as exports.start.
 */

exports.route = route;
