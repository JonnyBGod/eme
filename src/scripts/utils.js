import {StyleSheet} from 'react-native';

const MAX_VALUE = 200;

function getStyleFromScore(score: number): StyleObj {
  if (score < 0) {
    return styles.noScore;
  }

  var normalizedScore = Math.round((score / 100) * MAX_VALUE);
  return {
    color: 'rgb(' +
      (MAX_VALUE - normalizedScore) + ', ' +
      normalizedScore + ', ' +
      0 +
    ')'
  };
}

var styles = StyleSheet.create({
  noScore: {
    color: '#999999',
  },
});

function getTextFromScore(score: number): string {
  return score > 0 ? score + '%' : 'N/A';
}

function getImageSource(movie: Object, kind: ?string): {uri: ?string} {
  var uri = movie && movie.posters ? movie.posters.thumbnail : null;
  if (uri && kind) {
    uri = uri.replace('tmb', kind);
  }
  return { uri };
}

function formatImageUrl(url: string): string {
  return 'https:'+ url;
}

var polyline = {};

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
polyline.decode = function(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};


function flipped(coords) {
    var flipped = [];
    for (var i = 0; i < coords.length; i++) {
        flipped.push(coords[i].slice().reverse());
    }
    return flipped;
}

if (typeof module === 'object' && module.exports) {
    module.exports = polyline;
}

module.exports = {getStyleFromScore, getTextFromScore, getImageSource, formatImageUrl, polyline}