import React from 'react-native';
import moment from 'moment';
import _ from "underscore";

import {Actions} from 'react-native-router-flux';

import API, {api} from "/../actions/Loopback";
import CategoriesStore from "/../stores/categories";

import invariant from 'invariant';

import {MKButton, MKColor, mdl} from 'react-native-material-kit';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import strings from '/../strings';

import Dimensions from 'Dimensions';
const windowSize = Dimensions.get('window');

const {
  ListView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  InteractionManager
} = React;

const LOADING = {};

let SelectScreen = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
  },

  componentWillUnmount() {
  },

  render() {
    return (
      <View style={styles.container}>
        {CategoriesStore.getState().categories.map((el, i) => {
          return <View key={'btn-'+i} style={styles.section}>
            <TouchableOpacity onPress={() => Actions.ResultScreen({ category: el })}>
              <Image style={{width: windowSize.width, height: windowSize.height/4}} source={{uri: el}} />
              <View style={styles.sectionTextContainer}>
                <Text style={styles.sectionText}>{el}</Text>
              </View>
            </TouchableOpacity>
          </View>;
        })}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  centerText: {
    alignItems: 'center',
    padding: 20
  },
  noRidesText: {
    color: '#5a6b77',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
    alignItems: 'center'
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  section: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a6b77'
  },
  sectionTextContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: windowSize.width,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    color: 'white',
    fontSize: 20
  }
});

export default SelectScreen;
