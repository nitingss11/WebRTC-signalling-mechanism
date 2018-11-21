function showRoomURL(roomid) {
    var roomIdDisplay = roomid;
    var html = 'Room ID : ' + roomIdDisplay;
    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;
    roomURLsDiv.style.display = 'block';
}
(function() {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;
    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }
    var match, search = window.location.search;
    while (match = r.exec(search.substring(1)))
        params[d(match[1])] = d(match[2]);
    window.params = params;
})();
var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
    roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
    roomid = connection.token();
}
document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
    localStorage.setItem(connection.socketMessageEvent, this.value);
};
var hashString = location.hash.replace('#', '');
if (hashString.length && hashString.indexOf('comment-') == 0) {
    hashString = '';
}
var roomid = params.roomid;
if (!roomid && hashString.length) {
    roomid = hashString;
}
function joinBroadcastLooper(roomid) {
    connection.extra.broadcaster = false;
    connection.dontCaptureUserMedia = true;
    connection.session.oneway = true;
    (function reCheckRoomPresence() {
        connection.checkPresence(roomid, function(isRoomExist, roomid, extra) {
            if (extra._room) {
                if (extra._room.isFull) {
                    alert('Room is full.');
                }
                if (extra._room.isPasswordProtected) {
                    alert('Room is password protected');
                }
            }
            if (isRoomExist) {
                connection.join(roomid, function(isRoomJoined, roomid, error) {
                    if (error) {
                        console.error('join', error, roomid);
                        return;
                    }
                    afterConnectingSocket();
                });
                return;
            }
            setTimeout(reCheckRoomPresence, 5000);
        });
    })();
    disableInputButtons();
}
if (roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    joinBroadcastLooper(roomid);
}
