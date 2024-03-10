export default (function () {
    function loopify(uri, cb) {
        const context = new window.AudioContext();
        const request = new XMLHttpRequest();
        request.responseType = "arraybuffer";
        request.open("GET", uri, true);
        request.onerror = function () {
            cb(new Error("Couldn't load audio from " + uri));
        };
        request.onload = function () {
            context.decodeAudioData(request.response, success, function (err) {
                cb(new Error("Couldn't decode audio from " + uri));
            });
        };
        request.send();
        function success(buffer) {
            var source;
            function play() {
                stop();
                source = context.createBufferSource();
                source.connect(context.destination);
                source.buffer = buffer;
                source.loop = true;
                source.start(0);
            }
            function stop() {
                if (source) {
                    source.stop();
                    source = null;
                }
            }
            cb(null, {
                play,
                stop,
            });
        }
    }
    loopify.version = "0.1";
    return loopify;
})();
