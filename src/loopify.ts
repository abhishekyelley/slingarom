import { AudioControlType } from "./types/AudioControlType";

export default (function () {

    function loopify(uri: string, cb: (err: Error | null, audioControl?: AudioControlType) => void) {

        // var context = new (window.AudioContext || window?.webkitAudioContext)();
        const context = new window.AudioContext();
        const request = new XMLHttpRequest();

        request.responseType = "arraybuffer";
        request.open("GET", uri, true);

        // XHR failed
        request.onerror = function () {
            cb(new Error("Couldn't load audio from " + uri));
        };

        // XHR complete
        request.onload = function () {
            context.decodeAudioData(request.response as ArrayBuffer, success, function (err) {
                // Audio was bad
                cb(new Error("Couldn't decode audio from " + uri));
            });
        };

        request.send();

        function success(buffer: AudioBuffer) {

            var source: AudioBufferSourceNode | null;

            function play() {

                // Stop if it's already playing
                stop();

                // Create a new source (can't replay an existing source)
                source = context.createBufferSource();
                source.connect(context.destination);

                // Set the buffer
                source.buffer = buffer;
                source.loop = true;

                // Play it
                source.start(0);

            }

            function stop() {

                // Stop and clear if it's playing
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
    // if (typeof define === "function" && define.amd) {
    //     define(function () { return loopify; });
    // } else if (typeof module === "object" && module.exports) {
    //     module.exports = loopify;
    // } else {
    //     this.loopify = loopify;
    // }

})();
