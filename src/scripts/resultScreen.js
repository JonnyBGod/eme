import React from 'react-native';
import moment from 'moment';
import RNShakeEventIOS from 'react-native-shake-event-ios';

import {Actions} from 'react-native-router-flux';

import API, {api} from "/../actions/Loopback";
import ItemsStore from "/../stores/items";

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
  Text,
  TextInput,
  View,
  TouchableOpacity,
  DeviceEventEmitter,
  InteractionManager
} = React;

let ResultScreen = React.createClass({
  getInitialState() {
    return {
      loading: true,
      items: []
    };
  },

   componentDidMount() {
    ItemsStore.listen(this.onItemsChange);

    RNShakeEventIOS.addEventListener('shake', () => {      
      this.shuffle();
    });

    this.shuffle();
  },

  componentWillUnmount() {
    ItemsStore.unlisten(this.onItemsChange);

    RNShakeEventIOS.removeEventListener('shake');
  },

  onItemsChange(currentState) {
    this.setState({
      loading: false,
      items: currentState.data
    });
  },

  shuffle() {
    // TODO
    this.setState({
      loading: true
    });

    API.shuffle(this.props.category);
  },

  render() {
    console.log(this.state.items);

    return this.state.loading === true ?
      (<View style = { styles.horizontal }>
        <mdl.Spinner strokeColor="white"/>
      </View>) : 
      (<View style={styles.container}>
        {this.state.items.map((el, i) => {
          return <View key={el._id} style={styles.section}>
            <TouchableOpacity onPress={() => Actions.ItemScreen({ item: el, category: this.props.category })}>
              <View style={styles.sectionTextContainer}>
                <Text style={styles.sectionText}>{el.properties.INF_NOME}</Text>
              </View>
            </TouchableOpacity>
          </View>;
        })}
      </View>);
  },
});

const styles = StyleSheet.create({
  horizontal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5a6b77'
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: windowSize.width,
    height: windowSize.height/6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionText: {
    color: 'white',
    fontSize: 18
  }
});

export default ResultScreen;
