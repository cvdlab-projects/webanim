WebAnim: Video encoding and streaming module
============================================

*Authors: Matteo Pellegrini, Antonio Zoccoli*

In this document we are going to explain, as simple as possible, the targets aimed by this project, the solutions we found to reach them, what has been implementend and what must be still done.

Origin
------
The WebAnim project was born whithin a bigger project promoted by Alberto Paoluzzi, full professor at Roma Tre University, in his Biomedical Informatic class.<br/>
 The target of this project consist in developing tools for the modeling, rendering, animation of biological object like proteins, cells and organs on a web environment. The WebAnim project, as the name may suggest, has to care about animate 3D models according to a storyboard, and record the scene in a video providing an interface for searching them throgh tags and play them into the browser.
The video encoding and streaming module handle recording and playing features.

1. Targets
----------
The WebAnim video encoding and streaming module main targets (and features) are:

* Record the scene shown on a canvas element
* Play the recorded video.

In the following we will expose the studies made on this two feature, the problems encountered and the solution we propose.

2. Analisys and Solutions
-------------------------
The recording function involves two actors:

* the client on which the scene is displayed
* a server which recieve the scene frames, encode them into a video, and play the video on the page


This architecture is necessary because, with actual technologies, is impossible to encode a video locally within the browser.<br/>
It's evident that an approch like this introduce some problems like:

* efficency
* network overloading

which can be added some video quality constraints:

* number of recorded frames per second (fps)
* size of recording canvas

that influence efficency and network overloading very much.<br/>
To do some math, a video of 120 seconds at 25 fps with a resolution of 640x480 pixels is about 3000 frames to be captured and sent; it's evident some optimization is needed.<br/>
We explored two different approches to capture frames:

* the `getImageData()` method provided by the `canvas.context` element
* the `toDataURL()` method provided by the `canvas` element

On the first apporach we'll spend very few words on this approach, because it's heavly inefficient. Indeed testing it with the quality constraints defined above, the browser become slower till it freeze, making the service unusable.

The second approach is more interesting both because its efficency and a number of issues it raised. The `toDataURL()` is a method provided by the `canvas` element defined in the `HTML5 Standard` which return the canvas' content in a string encoded in base64.
Testing this method with che video quality constraints defined before it worked well, without slowing down the browser, and moreover thinkig about the encoding in base64 it compress a lot the data to be sent to the server. <br/>
The choice was easy, we decided for the `toDataURL()` method. But due it's behaviour while econding the video, we had to decode the string into an RGB buffer. This step was a little problematic, because we discovered that each browser decoded the image using a different filter, infact while Opera and Firefox worked at the first try, Chrome showed some graphical glitches during the animation. We solved it analysing the header of the encoded png sent, and found that Chrome use a `subtraction` filter, while Opera and Firefox use no filter. To make things work with more browsers we had to implement the no filter and the sub filter decoding algorithms and a mechanism to find which one to use.
Actually all the frames data are sent to the server through a `POST` request.

3. Server structure
-------------------
The architecture of the server, as shown in fig.1 [link] consist in three main component:

* Server module
* Router module
* RequestHandler module

When a client perform a request, it is intercepted by the Server module. Server forwards the request to the Router which query the Request Handler to know if exist a requestHandler for that request. If so Router apply the requestHandler found, which will elaborate a response that will be sent to the Client, else Router will elaborate a default error response.