export const getImageDimensions = function (uri) {
    // da dobimo višino in širino slike, jo je potrebno najprej (skrito) naložiti v DOM
    var img = document.createElement("img");
    img.src = uri
    img.id = uri
    var odlozisce = document.getElementById("odlozisce")
    odlozisce.appendChild(img)

    // preberemo lastnosti skrite slike
    const existingImg = document.getElementById(uri);
    var widthSrc = existingImg.width;
    var heightSrc = existingImg.height;
    existingImg.remove()

    return { widthSrc, heightSrc}
}