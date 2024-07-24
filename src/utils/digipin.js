export function Get_DIGIPIN(lat, lon) {
    var L1 = [
        ['0', '2', '0', '0'],
        ['3', '4', '5', '6'],
        ['G', '8', '7', 'M'],
        ['J', '9', 'K', 'L']
    ];

    var L2 = [
        ['J', 'G', '9', '8'],
        ['K', '3', '2', '7'],
        ['L', '4', '5', '6'],
        ['M', 'P', 'W', 'X']
    ];

    var vDIGIPIN = ''; 
    var MinLat = 1.50; var MaxLat = 39.00; var MinLon = 63.50; var MaxLon = 99.00;
    var LatDivBy = 4; var LonDivBy = 4;

    if (lat < MinLat || lat > MaxLat || lon < MinLon || lon > MaxLon) {
        return 'Out of Bound';
    }

    for (let Lvl = 1; Lvl <= 10; Lvl++) {
        var LatDivDeg = (MaxLat - MinLat) / LatDivBy;
        var LonDivDeg = (MaxLon - MinLon) / LonDivBy;

        var r = Math.floor((lat - MinLat) / LatDivDeg);
        var c = Math.floor((lon - MinLon) / LonDivDeg);

        if (Lvl === 1) {
            if (L1[r][c] === "0") {
                return "Out of Bound";
            }
            vDIGIPIN += L1[r][c];
        } else {
            vDIGIPIN += L2[r][c];
            if (Lvl === 3 || Lvl === 6) {
                vDIGIPIN += "-";
            }
        }

        MinLat += r * LatDivDeg;
        MaxLat = MinLat + LatDivDeg;
        MinLon += c * LonDivDeg;
        MaxLon = MinLon + LonDivDeg;
    } 
    return vDIGIPIN;
}