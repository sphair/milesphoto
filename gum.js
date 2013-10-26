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
    this.callback = opts.callback;
    var body = document.querySelector('body');
    this.videoElem = body.appendChild(document.createElement('video'));
    this.canvasElem = body.appendChild(document.createElement('canvas'));
    this.link = body.appendChild(document.createElement('a'));
    this.link.setAttribute('href', '#');
    this.link.appendChild(document.createTextNode("Grab image"));
    this.link.addEventListener('click', this.getImageData.bind(this));
    this.context = this.canvasElem.getContext('2d');
    this.videoElem.setAttribute('style', 'display:none;');
    this.canvasElem.addEventListener('click', this.getImageData.bind(this));
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

    //var self = this;
    //setInterval(function () {
    //    self.grabFrame();
    //    self.startCapturing();
    //}, 33);
};

ImageCapturer.prototype.grabFrame = function () {
    this.context.drawImage(this.videoElem, 0, 0, this.width, this.height);
};

ImageCapturer.prototype.getImageData = function () {
    if (this.callback) {
        this.callback(this.context.getImageData(0, 0, this.width, this.height));
    }
};