
function bw(imageData) {
    for (var i = 0; i < imageData.data.length; i += 4) {
        // change image colors

        var weights = [0.2989, 0.5870, 0.1140];
        var output = weights[0] * imageData.data[i] + weights[1] * imageData.data[i +1] +  weights[2] * imageData.data[i +2];

        imageData.data[i] = output;
        imageData.data[i + 1] =  output;
        imageData.data[i + 2] =  output;
    }

    return imageData;
}