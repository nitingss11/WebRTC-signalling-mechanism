document.getElementById('as-broadcaster').onclick = function() {
    disableInputButtons();
    connection.extra.broadcaster = true;
    DetectRTC.load(function() {
        if (DetectRTC.videoInputDevices.length > 1) {
            connection.mediaConstraints = {
                audio: {
		googEchoCancellation : true,
		googAutoGainControl : true,
		googNoiseSuppression : true,
		googHighpassFilter : true,
		googNoiseSuppression2 : true,
		googAutoGainControl2 : true,
		googEchoCancellation2 : true
		},
                video: {
                    deviceId: DetectRTC.videoInputDevices[0].deviceId
                }
            };
        }
        connection.openOrJoin(document.getElementById('room-id').value, function(isRoomExist, roomid, error) {
            if (error) {
                console.error('openOrJoin', error, roomid);
                return;
            }
            showRoomURL(roomid);
            afterConnectingSocket();
            if (!connection.isInitiator) {
                console.log('I am creating my own room as well.');
                var initialStatus = connection.dontCaptureUserMedia;
                connection.dontCaptureUserMedia = true;
                connection.open(connection.userid, function(isRoomOpened, roomid, error) {
                    if (error) {
                        console.error('open', error, roomid);
                        return;
                    }
                    connection.dontCaptureUserMedia = initialStatus;
                    connection.isInitiator = false;
                });
            }
            if (DetectRTC.videoInputDevices.length > 1) {
                document.getElementById('switch-camera').disabled = true;
                var idx = 0;
                document.getElementById('switch-camera').onclick = function() {
                    var deviceId = DetectRTC.videoInputDevices[0].deviceId;
                    if (idx % 2 == 0) {
                        deviceId = DetectRTC.videoInputDevices[1].deviceId;
                    }
                    idx++;
                    this.disabled = true;
                    navigator.mediaDevices.getUserMedia({
                        video: {
                            deviceId: deviceId
                        }
                    }).then(function(cam) {
                        document.getElementById(connection.userid).media.srcObject = cam;
                        document.getElementById('switch-camera').disabled = true;
                        connection.getAllParticipants().forEach(function(remoteUserId) {
                            var peer = connection.peers[remoteUserId].peer;
                            var sender = peer.getSenders().filter(function(s) {
                                return s.track.kind === 'video'
                            })[0];
                            var track = cam.getTracks().filter(function(s) {
                                return s.kind === 'video'
                            })[0];
                            if (sender && track) {
                                sender.track.stop();
                                sender.replaceTrack(track);
                            }
                        });
                        var audioTrack = connection.attachStreams[0].getTracks().filter(function(s) {
                            return s.kind === 'audio'
                        })[0];
                            
                        if(audioTrack) {
                            cam.addTrack(audioTrack);
                        }
                            
                        connection.attachStreams = [cam];
                    });
                };
            }
        });
    });
};
document.getElementById('as-viewer').onclick = function() {
    disableInputButtons();
    joinBroadcastLooper(document.getElementById('room-id').value);
};

