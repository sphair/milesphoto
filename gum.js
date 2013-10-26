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
    this.realtimeCallback = opts.realtimeCallback;
    this.captureCallback = opts.captureCallback;
    this.filterMethod = opts.filter;
    var targetElement = document.querySelector(this.selector);
    this.videoElem = targetElement.appendChild(document.createElement('video'));
    this.canvasInElem = targetElement.appendChild(document.createElement('canvas'));
    this.contextIn = this.canvasInElem.getContext('2d');
    this.canvasOutElem = targetElement.appendChild(document.createElement('canvas'));
    this.contextOut = this.canvasOutElem.getContext('2d');
    this.videoElem.setAttribute('style', 'display:none;');
    this.canvasInElem.setAttribute('style', 'display:none;');

    this.canvasOutElem.addEventListener('click', this.returnImageData.bind(this));
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
    this.canvasInElem.setAttribute('width', this.width);
    this.canvasOutElem.setAttribute('width', this.width);
    this.canvasInElem.setAttribute('height', this.height);
    this.canvasOutElem.setAttribute('height', this.height);
    this.startCapturing();
};


ImageCapturer.prototype.startCapturing = function () {
    window.requestAnimationFrame(this.startCapturing.bind(this));
    this.grabFrame();
};

ImageCapturer.prototype.grabFrame = function () {
    this.contextIn.drawImage(this.videoElem, 0, 0, this.width, this.height);
    this.contextOut.putImageData(this.internalFilter(this.contextIn.getImageData(0, 0, this.width, this.height)), 0, 0);
    if (this.realtimeCallback) {
        this.realtimeCallback(this.contextIn.getImageData(0, 0, this.width, this.height));
    }
};

ImageCapturer.prototype.internalFilter = function (imageData) {
    if(this.filterMethod) {
        return this.filterMethod(imageData);
    } else {
        return imageData;
    }
};


ImageCapturer.prototype.returnImageData = function () {
    if (this.captureCallback) {
        this.captureCallback(this.contextOut.getImageData(0, 0, this.width, this.height));
    }
};

