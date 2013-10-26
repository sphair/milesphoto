function vignette(imageData) {


    for (var i = 0; i < imageData.data.length; i += 4) {
        // change image colors

        var d = distance(imageData, i / 4);
        var coeff = 0.4;
        imageData.data[i] = imageData.data[i] * d * coeff + (1 - coeff) * imageData.data[i];
        imageData.data[i + 1] = imageData.data[i + 1 ] * d * coeff + (1 - coeff) * imageData.data[i + 1];
        imageData.data[i + 2] = imageData.data[i + 2] * d * coeff + (1 - coeff) * imageData.data[i + 2];
    }

    return imageData;
}

function distance(imageData, i) {
    var hw = (imageData.width / 2);
    var hh = (imageData.height / 2);

    var y = i / imageData.width;
    var x = i % imageData.width;
    var dx = Math.abs(x - hw);
    var dy = Math.abs(y - hh);
    var distance = Math.sqrt(dy * dy + dx * dx);
    return 1 - Math.min(distance, hh) / hh;

}