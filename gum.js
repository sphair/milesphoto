navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


navigator.getMedia(
        // constraints
        {
            video: true,
            audio: false
        },
        // successCallback
        function(stream) {
            var video = document.querySelector('#icv');
            video.src = (window.URL && window.URL.createObjectURL( stream )) || stream;
            video.play();
        },

        // errorCallback
        function(err) {
            console.log("The following error occured: " + err);
        }
);