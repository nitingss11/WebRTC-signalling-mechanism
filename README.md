# WebRTC-signalling-mechanism
Design and implement a hybrid WebRTC signalling mechanism for unidirectional &amp; bi-directional video conferencing

# Install node.js on the system
sudo apt-get install nodejs

# Also install npm which is a Node.js pachage manager
sudo apt-get install npm

# Install RTCMultiConnection using npm
npm install rtcmulticonnection

This creates node_modules/rtcmulticonnection in the Home directory.
Then add the project files in the above folder.


## To set up a server:
Edit the "socketURL" and "port" in the config.json file to the particular server ip address and server
port number.
Also edit connection.socketURL value in the index.html file to the value same as above.


# Then run the server on your machine by executing the following command in the same folder
node server --ssl

This makes the project up and running on the server.

So, to access the project just go to its url.

Now, if you want to be a broadcast initiator, enter a room number and click “Broadcast”.

And if anyone wants to join as a broadcast entity to a room, he can just enter that particular room
number and click “Broadcast”.

And if anyone just wants to be a Viewer, he just needs to enter a particular room number and click
“Viewer”.
