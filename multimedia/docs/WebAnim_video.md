WebAnim: Video encoding and streaming module
============================================

*Authors: Matteo Pellegrini, Antonio Zoccoli*

In this document we are going to explain, as simple as possible, the targets aimed by this project, the solutions we found to reach them, what has been implementend and what must be still done.

Origin
-------
The WebAnim project was born whithin a bigger project promoted by Alberto Paoluzzi, full professor at Roma Tre University, in his Biomedical Informatic class.<br/>
 The target of this project consist in developing tools for the modeling, rendering, animation of biological object like proteins, cells and organs on a web environment. The WebAnim project, as the name may suggest, has to care about animate 3D models according to a storyboard, and record the scene in a video providing an interface for searching them throgh tags and play them into the browser.
The video encoding and streaming module handle recording and playing features.

1. Targets
-------
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

to which can be added some video quality constraints:

* up to 25 fps
* at least 640*480 pixel resolution

that influence efficency and network overloading very much.<br/>
To do some math, a video of 120 seconds with the quality constraints defined above is about 3000 frames to be captured and sent; it's evident some optimization is needed.<br/>
We explored two different approches to capture frames:

* the `getImageData()` method provided by the `canvas.context` element
* the `toDataURL()` method provided by the `canvas` element

On the first apporach we'll spend very few words on this approach, because it's heavly inefficient. Indeed testing it with the quality constraints defined above, the browser become slower till it freeze, making the service unusable.

The second approach is more interesting both because its efficency and a number of issues it raised. The `toDataURL()` is a method provided by the `canvas` element defined in the `HTML5 Standard` which encode the canvas' content in a string encoded in base64.
Testing this method with che video quality constraints defined before it worked well, without slowing down the browser, and moreover thinkig about the encoding in base64 it compress a lot the data to be sent to the server. <br/>
The choice was easy,we decided for the `toDataURL()` method. But due it's behaviour while econding the video, we had to decode the string into an RGB buffer. This step was a little problematic, because on first instance the reconstructed image from a frame sent using Google Chrome gave some problem, while using Opera or Firefox it worked perfectly. We solved it analysing the heather of the encoded png sent, and found that Chrome use a Sub filter, while Opera and Firefox use no filter. To make things work with more browsers we implementend the no filter and the sub filter decoding algorithm, (we'll add the up filter to add support to Safari).
Actually all the frames data are sent to the server through a `POST` request.

3. Server structure
-------------------
//To be completed





