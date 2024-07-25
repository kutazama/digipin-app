export function Get_DIGIPIN(lat, lon) {
    const L1 = [
        ['0', '2', '0', '0'],
        ['3', '4', '5', '6'],
        ['G', '8', '7', 'M'],
        ['J', '9', 'K', 'L']
    ];

    const L2 = [
        ['J', 'G', '9', '8'],
        ['K', '3', '2', '7'],
        ['L', '4', '5', '6'],
        ['M', 'P', 'W', 'X']
    ];

    let vDIGIPIN = ''; 
    let MinLat = 1.50; let MaxLat = 39.00; let MinLon = 63.50; let MaxLon = 99.00;
    let LatDivBy = 4; let LonDivBy = 4;
    
    let row = 0; let column = 0; 
    let LatDivDeg = 0; let LonDivDeg = 0;

    if (lat < MinLat || lat > MaxLat || lon < MinLon || lon > MaxLon) {
        return 'Out of Bound';
    }

    for (let Lvl = 1; Lvl <= 10; Lvl++) {
        LatDivDeg = (MaxLat - MinLat) / LatDivBy;
        LonDivDeg = (MaxLon - MinLon) / LonDivBy;

        let NextLvlMaxLat = MaxLat;
        let NextLvlMinLat = MaxLat - LatDivDeg;

        for (let x = 0; x < LatDivBy; x++) {
            if (lat >= NextLvlMinLat && lat < NextLvlMaxLat) {
                row = x;
                break;
            }
            else {
                NextLvlMaxLat = NextLvlMinLat
                NextLvlMinLat = NextLvlMaxLat - LatDivDeg;
            }
        }

        let NextLvlMinLon = MinLon;
        let NextLvlMaxLon = MinLon + LonDivDeg;

        for (let x = 0; x < LonDivBy; x++) {
            if (lon >= NextLvlMinLon && lon < NextLvlMaxLon) {
                column = x;
                break;
            }
            else {
                NextLvlMinLon = NextLvlMaxLon;
                NextLvlMaxLon = NextLvlMinLon + LonDivDeg;
            }
        }
        if (Lvl === 1) {
            if (L1[row][column] === "0") {
                return "Out of Bound";
            }
            vDIGIPIN += L1[row][column];
        } else {
            vDIGIPIN += L2[row][column];
            if (Lvl === 3 || Lvl === 6) {
                vDIGIPIN += "-";
            }
        }

        MinLat = NextLvlMinLat; MaxLat = NextLvlMaxLat;
        MinLon = NextLvlMinLon; MaxLon = NextLvlMaxLon;
    } 
    return vDIGIPIN;
}

export function Get_LatLong(digipin) {
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

    var MinLat = 1.50, MaxLat = 39.00, MinLon = 63.50, MaxLon = 99.00;
    var LatDivBy = 4, LonDivBy = 4;

    if (!/^[0-9A-Z-]+$/.test(digipin)) {
        return 'Invalid DIGIPIN';
    }

    for (let Lvl = 1, i = 0; Lvl <= 10; Lvl++, i++) {
        if (digipin[i] === '-') {
            i++;
        }

        var LatDivDeg = (MaxLat - MinLat) / LatDivBy;
        var LonDivDeg = (MaxLon - MinLon) / LonDivBy;

        var found = false;
        for (let r = 0; r < LatDivBy; r++) {
            for (let c = 0; c < LonDivBy; c++) {
                if ((Lvl === 1 && L1[r][c] === digipin[i]) || (Lvl > 1 && L2[r][c] === digipin[i])) {
                    MinLat += r * LatDivDeg;
                    MaxLat = MinLat + LatDivDeg;
                    MinLon += c * LonDivDeg;
                    MaxLon = MinLon + LonDivDeg;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        if (!found) {
            return 'Invalid DIGIPIN';
        }
    }

    var latitude = (MinLat + MaxLat) / 2;
    var longitude = (MinLon + MaxLon) / 2;

    return { latitude, longitude };
}