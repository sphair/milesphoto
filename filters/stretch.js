function stretch(imageData) {

    var mm = minmax(imageData);
    var diff = mm.max - mm.min;

    // change image colors
    for (var i = 0; i < imageData.data.length; i += 4) {
        var output = (imageData.data[i] *  255) / diff;

        imageData.data[i] = output;
        imageData.data[i + 1] = output;
        imageData.data[i + 2] = output;
    }

    return imageData;
}

function minmax(imageData) {
    var min = 255;
    var max = 0;
    for (var i = 0; i < imageData.data.length; i += 4) {
        min = Math.min(min, imageData.data[i]);
        max = Math.max(max, imageData.data[i]);
    }
    return {min:min, max:max};
}