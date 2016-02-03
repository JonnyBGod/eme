import React from 'react-native';
import moment from 'moment';
import _ from "underscore";

import {Actions} from 'react-native-router-flux';

import API, {api} from "/../actions/Loopback";
import UserStore from "/../stores/user";
import ItemsStore from "/../stores/items";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {mdl} from 'react-native-material-kit';

import MapboxGLMap from 'react-native-mapbox-gl';

import strings from '/../strings';

import utils from './utils';

const {
  Component,
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  InteractionManager
} = React;

const window = Dimensions.get('window');
const mapRef = 'mapRef';


class ItemScreen extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ride: props.ride,
      annotations: [],
      isLoading: true
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        annotations: this.getAnnotations(),
        isLoading: false
      });
    });
  }

  componentWillUnmount() {
  }

  getAnnotations() {
    let annotations = [{
      type: 'point',
      coordinates: [this.props.item.geometry.coordinates[1], this.props.item.geometry.coordinates[0]],
      title: this.props.item.properties.INF_NOME,
      subtitle: this.props.item.properties.INF_MORADA,
      id: this.props.item.properties.GlobalID
    }];

    return annotations;
  }

  getNEfromPoints(points) {
    let lats = [];
    let lngs = [];

    for (var i = 0; i < points.length; i++) {
      lats.push(points[i].lat);
      lngs.push(points[i].lng);
    };

    return {
      lat: Math.min.apply( Math, lats ),
      lng: Math.max.apply( Math, lngs )
    };
  }

  getSWfromPoints(points) {
    let lats = [];
    let lngs = [];

    for (var i = 0; i < points.length; i++) {
      lats.push(points[i].lat);
      lngs.push(points[i].lng);
    };

    return {
      lat: Math.max.apply( Math, lats ),
      lng: Math.min.apply( Math, lngs )
    };
  }

  getCenter() {
    return {
      latitude: this.props.item.geometry.coordinates[1],
      longitude: this.props.item.geometry.coordinates[0]
    };
  }

  getZoom() {
  	return 15;

    var WORLD_DIM = { height: 512, width: 512 };

    function latRad(lat) {
      var sin = Math.sin(lat * Math.PI / 180);
      var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = this.state.ride.route ? this.state.ride.route.bounds.northeast : this.getNEfromPoints([this.state.ride.from.geometry.location, this.state.ride.to.geometry.location]);
    var sw = this.state.ride.route ? this.state.ride.route.bounds.southwest : this.getSWfromPoints([this.state.ride.from.geometry.location, this.state.ride.to.geometry.location]);

    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(window.height * .7, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(window.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom) || 0;
  }

  render() {
  	console.log(this.props.item);

    const content = this.state.isLoading === true ?
      <View style={styles.map}/> :
      <MapboxGLMap
        style={styles.map}
        rotateEnabled={false}
        ref={mapRef}
        accessToken={'pk.eyJ1Ijoiam9ubnliZ29kIiwiYSI6IlllZHR2bU0ifQ.P7548E-WutS4LxQ3zoZ5aA'}
        styleURL={'mapbox://styles/mapbox/streets-v8'}
        centerCoordinate={this.getCenter()}
        zoomLevel={this.getZoom()}
        showsUserLocation={true}
        annotations={this.state.annotations} />;

    return (
      <View style = { styles.mainSection }>
        
        <View style = {styles.infoContainer}>
          <View style={styles.textContainer}>
            <Image style={{width: window.width-20, height: window.height/4}} source={{uri: this.props.category}} />

            <Text style={styles.title} numberOfLines={1}>
              {this.props.item.properties.INF_NOME}
            </Text>
            <Text style={styles.line} numberOfLines={1}>
              {this.props.item.properties.INF_MORADA}
            </Text>
          </View>
        </View>

        {content}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainSection: {
    flex: 1
  },
  infoContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 10,
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  map: {
    flex: 3,
    backgroundColor: 'rgb(140, 203, 247)'
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  date: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    color: '#5a6b77'
  },
  title: {
    color: 'black',
    fontSize: 16,
    paddingVertical: 6
  },
  line: {
    color: '#5a6b77',
    fontSize: 14,
  },
  passengers: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  passenger: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 10
  },
  navButtonLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 5,
    marginTop: -3
  },
  navButtonRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: 10,
    marginTop: -3
  },
  navIconT: {
    width: 30,
    height: 30,
    paddingTop: 1
  },
  navText: {
    color: 'white',
    fontSize: 18,
    height: 27
  },
  navIcon: {
    width: 30,
    height: 30
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  status: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 1,
    paddingHorizontal: 6,
    height: 20,
  },
  car: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 1,
    paddingHorizontal: 6,
    height: 20,
    marginTop: 8
  }
});

export default ItemScreen;
