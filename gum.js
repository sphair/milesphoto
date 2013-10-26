navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

//document.addEventListener('DOMContentLoaded', function () {
//    document.querySelector('#grabLink').addEventListener('click', grabFrame);
//});


var ImageCapturer = function (opts) {
    this.selector = opts.selector || '#ic';
    this.feedCallback = opts.feedCallback;
    this.captureCallback = opts.captureCallback;
    var targetElement = document.querySelector(this.selector);
    this.videoElem = targetElement.appendChild(document.createElement('video'));
    this.canvasElem = targetElement.appendChild(document.createElement('canvas'));
    this.context = this.canvasElem.getContext('2d');
    this.videoElem.setAttribute('style', 'display:none;');
    this.canvasElem.addEventListener('click', this.returnImageData.bind(this));
};

ImageCapturer.prototype.start = function () {
    var self = this;
    navigator.getMedia(
            // constraints
            {
                video: true,
                audio: false
            },
            // successCallback
            function (stream) {
                self.videoElem.addEventListener('loadedmetadata', function () {
                    self.onLoadedMetadata();
                });
                self.videoElem.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
                self.videoElem.play();
            },

            // errorCallback
            function (err) {
                console.log("The following error occured: " + err);
            }
    );
};

ImageCapturer.prototype.onLoadedMetadata = function () {
    this.width = this.videoElem.videoWidth;
    this.height = this.videoElem.videoHeight;
    this.canvasElem.setAttribute('width', this.width);
    this.canvasElem.setAttribute('height', this.height);
    this.startCapturing();
};


ImageCapturer.prototype.startCapturing = function () {
    window.requestAnimationFrame(this.startCapturing.bind(this));
    this.grabFrame();
};

ImageCapturer.prototype.grabFrame = function () {
    this.context.drawImage(this.videoElem, 0, 0, this.width, this.height);

    if (this.feedCallback) {
        this.feedCallback(this.context.getImageData(0, 0, this.width, this.height));
    }
};


ImageCapturer.prototype.returnImageData = function () {
    if (this.captureCallback) {
        this.captureCallback(this.context.getImageData(0, 0, this.width, this.height));
    }
};