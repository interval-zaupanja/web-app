export const getImageDimensions = function (uri) {
    let iZadnjiPodcrtaj = 0
    let iZadnjiX = 0
    let iZadnjaPika = 0
    for (let i = 0; i < uri.length; i++) {
        if (uri.charAt(i) === '_') {
            iZadnjiPodcrtaj = i
        } else if (uri.charAt(i) === '.') {
            iZadnjaPika = i
        } else if (uri.charAt(i) === 'x') {
            iZadnjiX = i
        }
    }

    let widthSrc = uri.substring(iZadnjiPodcrtaj + 1, iZadnjiX)
    let heightSrc = uri.substring(iZadnjiX + 1, iZadnjaPika)

    return { widthSrc, heightSrc}
}